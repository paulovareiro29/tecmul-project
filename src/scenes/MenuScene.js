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
      .setOrigin(0)
      .setDepth(0)

    // Logo
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "LOGO")
      .setScale(4)
      .setDepth(1)

    // Play Button
    const play_button = this.add.text(this.game.renderer.width * 0.5, this.game.renderer.height * 0.5, "Play")
      .setFontSize(30)
      .setOrigin(0.5, 0.5)

    play_button.setInteractive()

    play_button.on('pointerover', () => {
      play_button.setFontSize(35)
    })

    play_button.on('pointerout', () => {
      play_button.setFontSize(30)
    })

    play_button.on('pointerup', () => {
      this.scene.start(CONSTANTS.SCENES.GAME)
    })

  }

  update() { }
}
