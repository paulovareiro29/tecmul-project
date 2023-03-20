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

  turnStarted = false

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


    this.physics.add.collider(this.balls, this.enemies, this.onEnemyHit)
    this.physics.world.checkCollision.down = false

    this.input.on('pointerdown', (pointer) => this.onMouseClick(pointer))
  }

  update() {
    this.balls.getChildren().forEach((ball) => ball.update())

    if (this.checkIfTurnEnded()) {
      this.endTurn()
      this.generateBalls()
    }
  }

  startTurn() {
    this.turnStarted = true
  }

  endTurn() {
    this.turnStarted = false
  }

  checkIfTurnEnded() {
    return this.balls.getChildren().length <= 0
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

    if (this.turnStarted) return;

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
  group = null;
  scene = null;

  constructor(scene, key, group) {
    super(scene, 0, 0, key)
    this.scene = scene
    this.group = group

    scene.physics.add.existing(this)
    scene.add.existing(this)
    group.add(this)
    this.body.setImmovable()
    Align.scaleToGameW(this, .1, scene)
  }

  onHit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.group.remove(this)
      this.destroy()
    }

  }
}