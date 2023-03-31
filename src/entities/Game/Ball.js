import Align from "../../utils/utilities/align"
import { numberBetween } from "../../utils/utilities/math"

export class Ball extends Phaser.GameObjects.Sprite {
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
        const angle = numberBetween(-Phaser.Math.Angle.Between(this.x, this.y, direction.x, direction.y), -3.04, -0.1)

        const velocityX = speed * Math.cos(angle)
        const velocityY = speed * Math.sin(angle)

        if (this.body)
            this.body.setVelocity(velocityX, velocityY)

        this.scene.sound.play('LASERGUN', { volume: 0.1 })
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