export default class Button extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, callback) {
        super(scene, x, y, text)
        this.setOrigin(0.5)
            .setPadding(30, 10)
            .setStyle({
                backgroundColor: "#fff",
                fill: "#111",
                fontSize: 24,
                fontStyle: "bold"
            })
            .setInteractive()
            .on('pointerup', () => callback())
            .on('pointerover', () => {
                this.setStyle({ fill: "#f39c12" })
                scene.input.manager.setCursor({ cursor: 'pointer' })
            })
            .on('pointerout', () => {
                this.setStyle({ fill: "#111" })
                scene.input.manager.resetCursor({ cursor: true })
            })

        scene.add.existing(this)
    }

    setCallback(callback) {
        this.removeListener('pointerup')
        this.on('pointerup', () => callback())
    }
}