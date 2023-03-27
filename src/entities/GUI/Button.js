export default class Button {
    instance = null

    constructor(scene, x, y, label, callback) {
        this.instance = scene.add.text(x, y, label)
            .setOrigin(0.5)
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
                this.instance.setStyle({ fill: "#f39c12" })
                scene.input.manager.setCursor({ cursor: 'pointer' })
            })
            .on('pointerout', () => {
                this.instance.setStyle({ fill: "#111" })
                scene.input.manager.resetCursor({ cursor: true })
            })
    }
}