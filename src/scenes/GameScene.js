import Phaser from "phaser";
import CONSTANTS from "../utils/constants";
import { AlignGrid } from "../utils/utilities/alignGrid";

import LEVELS from "../utils/levels"
import { numberBetween, randomBetween } from "../utils/utilities/math";
import GameHUD from "../entities/GUI/GameHUD";
import { Enemy } from "../entities/Game/Enemy";
import { Ball } from "../entities/Game/Ball";
import GameOverHUD from "../entities/GUI/GameOverHUD";
import { Player } from "../entities/Game/Player";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.GAME });
  }

  /* ENTITIES */
  grid = null
  enemies = null
  balls = null
  player = null

  /* GAME LOGIC */
  hasStartedTurn = false
  isGameOver = false
  currentLevel = 0
  currentTurn = 0
  score = 0

  /* HUD LOGIC */
  gameHUD = null

  /* CHEATS */
  isPowerOn = false

  preload() {
    this.add.image(0, 0, "BACKGROUND")
      .setDisplaySize(this.game.renderer.width, this.game.renderer.height)
      .setInteractive({ useHandCursor: false })
      .setOrigin(0)
      .setDepth(0)
  }

  create() {
    this.player = new Player(this, 0, 0)
    this.enemies = this.physics.add.group()
    this.balls = this.physics.add.group()
    this.grid = new AlignGrid({
      scene: this,
      rows: 17,
      cols: 10
    })
    this.hasStartedTurn = false
    this.isGameOver = false
    this.currentLevel = 0
    this.currentTurn = 0
    this.score = 0


    this.generateCurrentLevel()

    this.physics.add.collider(this.balls, this.enemies, (ball, enemy) => { this.onEnemyHit(ball, enemy, this) })
    this.physics.world.checkCollision.down = false

    this.input.on('pointerup', (pointer) => this.onMouseClick(pointer))

    this.loadCheats()

    this.gameHUD = new GameHUD(this)
    this.gameOverHUD = new GameOverHUD(this)
    this.gameOverHUD.hide()


    this.updateHUD()
  }

  update() {
    if (this.isGameOver) return

    /* UPDATE LOGIC */
    if (this.input.mousePointer.isDown && !this.hasStartedTurn && !this.isGameOver) {
      const { x, y } = this.input.mousePointer
      this.player.aim({ x, y })
    }

    /* GAME LOGIC */
    this.balls.getChildren().forEach((ball) => ball.update())

    if (this.areAllEnemiesDead()) {
      this.nextLevel()
    }

    if (this.areBallsOffScreen() && !this.isGameOver) {
      this.restartTurn()
    }
  }

  startTurn() {
    this.hasStartedTurn = true
    this.updateHUD()
  }

  endTurn() {
    this.clearBalls()
    this.hasStartedTurn = false
    this.updateHUD()
  }

  restartTurn() {
    this.endTurn()
    this.generateBalls()
    this.currentTurn++
    this.updateHUD()

    if (this.currentTurn >= LEVELS[this.currentLevel].maxTurns) this.endGame()
  }

  endGame() {
    this.clearAll()
    this.hasStartedTurn = false
    this.isGameOver = true


    if (this.currentLevel >= LEVELS.length) this.gameOverHUD.setWon(true)

    this.gameHUD.hide()
    this.gameOverHUD.show()
  }

  restartGame() {
    this.clearAll()

    this.isGameOver = false
    this.hasStartedTurn = false
    this.currentLevel = 0
    this.currentTurn = 0
    this.score = 0
    this.updateHUD()

    this.generateCurrentLevel()

    this.gameOverHUD.hide()
    this.gameHUD.show()
  }

  nextLevel() {
    this.endTurn()
    this.currentLevel++
    this.currentTurn = 0

    if (this.currentLevel >= LEVELS.length) return this.endGame()

    this.generateCurrentLevel()
    this.updateHUD()
  }

  areAllEnemiesDead() {
    return this.enemies.getChildren().length <= 0
  }

  areBallsOffScreen() {
    return this.balls.getChildren().length <= 0
  }

  generateCurrentLevel() {
    this.generateBalls()
    this.generateEnemies()
  }

  generateBalls() {
    const level = LEVELS[this.currentLevel]
    const position = {
      x: randomBetween(0, this.game.renderer.width),
      y: this.game.renderer.height - 15
    }
    this.player.setPosition(position.x, position.y)

    for (let i = 0; i < level.ballsPerTurn; i++) {
      this.addBall(position, level.ballPower)
    }
  }

  generateEnemies() {
    const level = LEVELS[this.currentLevel]

    const availableSpaces = new Array(109).fill(1).map((_, i) => ++i).filter((i) => i >= 20)

    for (let i = 0; i < level.totalEnemies; i++) {
      const index = randomBetween(0, availableSpaces.length)
      const position = availableSpaces[index]

      availableSpaces.splice(index, 1)
      this.addEnemy(position, CONSTANTS.ENEMY[randomBetween(0, CONSTANTS.ENEMY.length - 1)], level.enemyHealth)
    }
  }

  clearPlayer() {
    this.player.destroy()
  }

  clearBalls() {
    this.balls.clear(true, true)
  }

  clearEnemies() {
    this.enemies.getChildren().forEach(enemy => enemy.destroyHealthBars())
    this.enemies.clear(true, true)
  }

  clearAll() {
    this.clearPlayer()
    this.clearBalls()
    this.clearEnemies()
  }

  addBall(position, power) {
    new Ball(this, position.x, position.y, this.balls, power)
  }

  onMouseClick(pointer) {
    const { x, y } = pointer
    this.player.clearAim()

    if (this.hasStartedTurn || this.isGameOver) return;

    this.balls.getChildren().forEach((ball, index) => {
      setTimeout(() => ball.fire({ x, y }), index * 60)
    })

    this.startTurn()
  }

  addEnemy(position, key, health) {
    this.grid.placeAtIndex(position, new Enemy(this, key, this.enemies, health))
  }

  onEnemyHit(ball, enemy, game) {
    const damage = game.isPowerOn ? enemy.health : ball.getPower()
    enemy.onHit(damage)
    this.addScore(damage)
  }

  addScore(score) {
    this.score += score
    this.updateHUD()
  }

  loadCheats() {
    const keyM = this.input.keyboard.addKey('m')
    keyM.on('down', () => this.isPowerOn = !this.isPowerOn)
  }

  updateHUD() {
    this.gameOverHUD.setScore(this.score)
    this.gameHUD.setScore(this.score)
    this.gameHUD.setTurnsLeft(LEVELS[this.currentLevel].maxTurns - this.currentTurn - (this.hasStartedTurn ? 1 : 0))
  }
}
