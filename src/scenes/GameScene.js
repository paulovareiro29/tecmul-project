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
  ball = null

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
    this.grid = new AlignGrid({
      scene: this,
      rows: 17,
      cols: 10
    })

    for (let i = 0; i < 79; i++) {
      if (i % 2 == 0) this.addEnemy(i, "ENEMY")
    }


    this.ball = new Ball(this, this.game.renderer.width / 2, this.game.renderer.height - 15)

    this.physics.add.collider(this.ball, this.enemies)

    this.input.on('pointerdown', (pointer) => this.onMouseClick(this, pointer))
  }

  update() { }

  onMouseClick(scene, pointer) {
    const { x, y } = pointer
    this.ball.fire({ x, y })
  }

  addEnemy(position, key) {
    let enemy = this.physics.add.sprite(0, 0, key)
    this.enemies.add(enemy)
    this.grid.placeAtIndex(position, enemy)
    enemy.setImmovable()
    Align.scaleToGameW(enemy, .1, this)
  }
}

class Ball extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'BALL')

    scene.physics.add.existing(this)
    scene.add.existing(this)

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
} 