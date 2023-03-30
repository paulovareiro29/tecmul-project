export default class Text extends Phaser.GameObjects.Text {
    instance = null

    constructor(scene, x, y, text, fontSize = 24) {
        super(scene, x, y, text)
        this.setStyle({
            fill: "#fff",
            fontSize: fontSize,
            fontStyle: "bold",
            wordWrap: {
                width: scene.width * 1,
                useAdvancedWrap: true
            }
        })

        scene.add.existing(this)
    }
}