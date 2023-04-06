import Align from "../../utils/utilities/align";

export class Enemy extends Phaser.GameObjects.Sprite {

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
            if (this.healthBar.background) this.healthBar.background.destroy()
            if (this.healthBar.health) this.healthBar.health.destroy()

            this.scene.sound.play('EXPLOSION', { volume: 0.1 })
            this.group.remove(this)
            this.destroy()
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