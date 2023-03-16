import Phaser from "phaser";
import CONSTANTS from "../utils/constants";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.MENU });
  }

  preload() {
    console.log("Preloading menu scene..");
  }

  create() {

    // Background
    this.add.image(0, 0, "BACKGROUND")
      .setDisplaySize(this.game.renderer.width, this.game.renderer.height)
      .setInteractive({ useHandCursor: false })
      .setOrigin(0)
      .setDepth(0)

    // Logo
    this.add.text(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "BBSpace")
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

    // Play Button
    const play_button = new Button(this.game.renderer.width * 0.5, this.game.renderer.height * 0.5, 'Start Game', this, () => this.scene.start(CONSTANTS.SCENES.GAME))

  }

  update() { }
}

class Button {
  constructor(x, y, label, scene, callback) {
    const button = scene.add.text(x, y, label)
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
        button.setStyle({ fill: "#f39c12" })
        scene.input.manager.setCursor({ cursor: 'pointer' })
      })
      .on('pointerout', () => {
        button.setStyle({ fill: "#111" })
        scene.input.manager.resetCursor({ cursor: true })
      })
  }
}