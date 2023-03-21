import Phaser from "phaser";
import CONSTANTS from "../utils/constants";
import { AlignGrid } from "../utils/utilities/alignGrid";
import { Align } from "../utils/utilities/align";

const LEVELS = [
  {
    enemies: 20,
    balls: 10,
    turns: 3
  },
  {
    enemies: 80,
    balls: 20,
    turns: 10
  }
]

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.GAME });
  }

  grid = null
  enemies = null
  balls = null

  hasStartedTurn = false
  isGameOver = false
  currentLevel = 0
  currentTurn = 0

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


    this.physics.add.collider(this.balls, this.enemies, this.onEnemyHit)
    this.physics.world.checkCollision.down = false

    this.input.on('pointerdown', (pointer) => this.onMouseClick(pointer))
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
  }

  endTurn() {
    this.clearBalls()
    this.hasStartedTurn = false
  }

  restartTurn() {
    this.endTurn()
    this.generateBalls()
    this.currentTurn++

    if (this.currentTurn >= LEVELS[this.currentLevel].turns) this.endGame()
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
    this.currentLevel++;

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
    for (let i = 0; i < LEVELS[this.currentLevel].balls; i++) {
      this.addBall()
    }
  }

  generateEnemies() {
    // TODO: Generate in map randomly
    for (let i = 0; i < LEVELS[this.currentLevel].enemies; i++) {
      if (i % 2 == 0) this.addEnemy(i, "ENEMY")
    }
  }

  clearBalls() {
    this.balls.clear(true, true)
  }

  clearEnemies() {
    this.enemies.clear(true, true)
  }

  clearAll() {
    this.clearBalls()
    this.clearEnemies()
  }

  addBall() {
    new Ball(this, this.game.renderer.width / 2, this.game.renderer.height - 15, this.balls)
  }

  onMouseClick(pointer) {
    const { x, y } = pointer

    if (this.hasStartedTurn || this.isGameOver) return;

    this.balls.getChildren().forEach((ball, index) => {
      setTimeout(() => ball.fire({ x, y }), index * 60)
    })

    this.startTurn()
  }

  addEnemy(position, key) {
    this.grid.placeAtIndex(position, new Enemy(this, key, this.enemies))
  }

  onEnemyHit(ball, enemy) {
    enemy.onHit(ball.getPower())
  }
}

class Ball extends Phaser.GameObjects.Sprite {
  power = 10
  group = null
  scene = null

  constructor(scene, x, y, group) {
    super(scene, x, y, 'BALL')
    this.group = group
    this.scene = scene

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

  constructor(scene, key, group) {
    super(scene, 0, 0, key)
    this.scene = scene
    this.group = group

    this.currentHealth = this.health

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
}