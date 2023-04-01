import Phaser from "phaser";
import CONSTANTS from "../utils/constants";
import LoadingHUD from "../entities/GUI/LoadingHUD";

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.LOAD });
  }

  /* HUD LOGIC */
  loadingHUD = null

  preload() {
    console.log("Preloading loading scene..");

    this.loadingHUD = new LoadingHUD(this)

    this.loadImages()
    this.loadSounds()
  }

  create() {
    this.scene.start(CONSTANTS.SCENES.MENU)
    this.sound.play('BACKGROUNDMUSIC', { volume: 0.1, loop: true })
  }

  loadImages() {
    for (let item in CONSTANTS.IMAGE) {
      this.load.image(item, `./src/assets/${CONSTANTS.IMAGE[item]}`)
    }
  }

  loadSounds() {
    for (let item in CONSTANTS.SOUND) {
      this.load.audio(item, `./src/assets/${CONSTANTS.SOUND[item]}`)
    }
  }
}
