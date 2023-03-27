import Phaser from "phaser";
import CONSTANTS from "../utils/constants";
import { AlignGrid } from "../utils/utilities/alignGrid";
import { Align } from "../utils/utilities/align";

import LEVELS from "../utils/levels"
import { randomBetween } from "../utils/utilities/math";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.GAME });
  }

  /* ENTITIES */
  grid = null
  enemies = null
  balls = null

  /* GAME LOGIC */
  hasStartedTurn = false
  isGameOver = false
  currentLevel = 0
  currentTurn = 0
  score = 0

  /* GUI LOGIC */
  gui = null

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
    this.enemies = this.physics.add.group()
    this.balls = this.physics.add.group()
    this.grid = new AlignGrid({
      scene: this,
      rows: 17,
      cols: 10
    })

    this.generateCurrentLevel()

    this.physics.add.collider(this.balls, this.enemies, (ball, enemy) => { this.onEnemyHit(ball, enemy, this) })
    this.physics.world.checkCollision.down = false

    this.input.on('pointerup', (pointer) => this.onMouseClick(pointer))

    this.loadCheats()

    this.gui = new GUI(this)
    this.updateGUI()
  }

  update() {
    if (this.isGameOver) return

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
    this.updateGUI()
  }

  endTurn() {
    this.clearBalls()
    this.hasStartedTurn = false
    this.updateGUI()
  }

  restartTurn() {
    this.endTurn()
    this.generateBalls()
    this.currentTurn++
    this.updateGUI()

    if (this.currentTurn >= LEVELS[this.currentLevel].maxTurns) this.endGame()
  }

  endGame() {
    this.clearAll()
    this.hasStartedTurn = false
    this.isGameOver = true


    this.add.text(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "GAME OVER")
      .setOrigin(0.5)
      .setStyle({
        fill: "#fff",
        fontSize: 48,
        fontStyle: "bold",
        align: "center",
        wordWrap: {
          width: this.game.renderer.width * 0.7,
          useAdvancedWrap: true
        }
      })
  }

  nextLevel() {
    this.endTurn()
    this.currentLevel++
    this.currentTurn = 0

    if (this.currentLevel >= LEVELS.length) return this.endGame()

    this.generateCurrentLevel()
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
    const position = randomBetween(0, this.game.renderer.width)

    for (let i = 0; i < level.ballsPerTurn; i++) {
      this.addBall(position, level.ballPower)
    }
  }

  generateEnemies() {
    const level = LEVELS[this.currentLevel]

    const availableSpaces = new Array(99).fill(1).map((_, i) => ++i).filter((i) => i >= 10)

    for (let i = 0; i < level.totalEnemies; i++) {
      const index = randomBetween(0, availableSpaces.length)
      const position = availableSpaces[index]

      availableSpaces.splice(index, 1)
      this.addEnemy(position, "ENEMY", level.enemyHealth)
    }
  }

  clearBalls() {
    this.balls.clear(true, true)
  }

  clearEnemies() {
    this.enemies.getChildren().forEach(enemy => enemy.destroyHealthBars())
    this.enemies.clear(true, true)
  }

  clearAll() {
    this.clearBalls()
    this.clearEnemies()
  }

  addBall(position, power) {
    new Ball(this, position, this.game.renderer.height - 15, this.balls, power)
  }

  onMouseClick(pointer) {
    const { x, y } = pointer

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
    this.updateGUI()
  }

  loadCheats() {
    const keyM = this.input.keyboard.addKey('m')
    keyM.on('down', () => this.isPowerOn = !this.isPowerOn)
  }

  updateGUI() {
    this.gui.setScore(this.score)
    this.gui.setTurnsLeft(LEVELS[this.currentLevel].maxTurns - this.currentTurn - (this.hasStartedTurn ? 1 : 0))
  }
}

class Ball extends Phaser.GameObjects.Sprite {
  power = 10
  group = null
  scene = null

  constructor(scene, x, y, group, power) {
    super(scene, x, y, 'BALL')
    this.group = group
    this.scene = scene

    this.power = power

    scene.physics.add.existing(this)
    scene.add.existing(this)

    group.add(this)

    this.body.setBounce(1)
    this.body.setCollideWorldBounds(true)
    Align.scaleToGameW(this, 0.05, scene)
  }

  fire(direction) {
    const speed = 500;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, direction.x, direction.y);
    const velocityX = speed * Math.cos(angle)
    const velocityY = speed * Math.sin(angle)

    this.body.setVelocity(velocityX, velocityY)
  }

  getPower() {
    return this.power
  }

  update() {
    if (this.body.position.y > this.scene.physics.world.bounds.height) {
      this.group.remove(this)
    }
  }
}

class Enemy extends Phaser.GameObjects.Sprite {

  health = 100;
  currentHealth = 0;
  group = null;
  scene = null;

  healthBar = {
    background: null,
    health: null
  };

  constructor(scene, key, group, health) {
    super(scene, 0, 0, key)
    this.scene = scene
    this.group = group

    this.health = health
    this.currentHealth = health

    scene.physics.add.existing(this)
    scene.add.existing(this)
    group.add(this)
    this.body.setImmovable()
    Align.scaleToGameW(this, .1, scene)

  }

  onHit(damage) {
    this.currentHealth -= damage;
    this.updateHealthBar()

    if (this.currentHealth <= 0) {
      this.group.remove(this)
      this.destroy()
      if (this.healthBar.background) this.healthBar.background.destroy()
      if (this.healthBar.health) this.healthBar.health.destroy()
    }

  }

  getX() {
    return this.body.position.x
  }

  getY() {
    return this.body.position.y
  }

  getWidth() {
    return this.body.width
  }

  getHeight() {
    return this.body.height
  }

  updateHealthBar() {
    const x = this.getX() + this.getWidth() / 2
    const y = this.getY() + this.getHeight()
    const healthPercentage = this.currentHealth / this.health


    if (!this.healthBar.background) this.healthBar.background = this.scene.add.rectangle(x, y, this.getWidth(), 5, 0xff0000)
    if (!this.healthBar.health) this.healthBar.health = this.scene.add.rectangle(x, y, this.getWidth(), 5, 0x00ff00)

    this.healthBar.health.width = this.getWidth() * healthPercentage
  }

  destroyHealthBars() {
    this.healthBar.background?.destroy()
    this.healthBar.health?.destroy()
  }
}

class GUI {
  scene = null
  width = 0
  height = 0

  /* ENTITIES */
  score = null
  turnsLeft = null

  constructor(scene) {
    this.scene = scene
    this.width = this.scene.game.renderer.width
    this.height = this.scene.game.renderer.height

    this.score = this.text(this.width * 0.02, this.height * 0.88, "Score: 0")
    this.turnsLeft = this.text(this.width * 0.02, this.height * 0.92, "Turns Left: 0")
  }

  setScore(score) {
    this.score.setText(`Score: ${score}`)
  }

  setTurnsLeft(turns) {
    this.turnsLeft.setText(`Turns Left: ${turns}`)
  }

  text(x, y, text) {
    return this.scene.add.text(x, y, text).setStyle({
      fill: "#fff",
      fontSize: 24,
      fontStyle: "bold",
      wordWrap: {
        width: this.width * 0.7,
        useAdvancedWrap: true
      }
    })
  }
}