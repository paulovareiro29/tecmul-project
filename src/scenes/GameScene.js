import Phaser from "phaser";
import CONSTANTS from "../utils/constants";
import { AlignGrid } from "../utils/utilities/alignGrid";
import { Align } from "../utils/utilities/align";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.GAME });
  }

  grid = null
  enemies = null
  balls = null

  turn = false
  level = false
  isPowerOn = false

  preload() {
    console.log("Preloading game scene..");
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

    /* this.grid.showNumbers(); */

    for (let i = 0; i < 79; i++) {
      if (i % 2 == 0) this.addEnemy(i, "ENEMY")
    }


    this.generateBalls()


    this.physics.add.collider(this.balls, this.enemies,(ball, enemy) => {this.onEnemyHit(ball, enemy, this)})
    this.physics.world.checkCollision.down = false

    this.input.on('pointerdown', (pointer) => this.onMouseClick(pointer))

    this.loadCheats()
  }

  update() {
    this.balls.getChildren().forEach((ball) => ball.update())

    if (this.checkIfLevelEnded() && !this.levelEnded()) {
      this.endTurn()
      this.endLevel()
    }

    if (this.areBallsOffScreen() && !this.turnEnded()) {
      this.endTurn()
      this.generateBalls()
    }
  }

  startTurn() {
    this.turn = true
  }

  endTurn() {
    this.balls.clear()
    this.turn = false
  }

  turnEnded() {
    return !this.turn
  }

  levelEnded() {
    return !this.level
  }

  endLevel() {
    this.level = false

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

  areBallsOffScreen() {
    return this.balls.getChildren().length <= 0
  }

  checkIfLevelEnded() {
    return this.enemies.getChildren().length <= 0
  }

  generateBalls() {
    for (let i = 0; i < 20; i++) {
      this.addBall()
    }
  }

  addBall() {
    new Ball(this, this.game.renderer.width / 2, this.game.renderer.height - 15, this.balls)
  }

  onMouseClick(pointer) {
    const { x, y } = pointer

    if (this.turn) return;

    this.balls.getChildren().forEach((ball, index) => {
      setTimeout(() => ball.fire({ x, y }), index * 60)
    })

    this.startTurn()
  }

  addEnemy(position, key) {
    this.grid.placeAtIndex(position, new Enemy(this, key, this.enemies))
  }

  onEnemyHit(ball, enemy, game) {
    enemy.onHit(game.isPowerOn ? enemy.health : ball.getPower())
  }
  
  loadCheats(){
    const keyM = this.input.keyboard.addKey('m')
    keyM.on('down', () => {
      console.log("M key pressed")
      this.isPowerOn =!this.isPowerOn
    })
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