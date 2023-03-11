import Phaser from "phaser";
import CONSTANTS from "../utils/constants";

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.LOAD });
  }

  preload() {
    console.log("Preloading loading scene..");

    this.loadImages()
  }

  create() {
    this.scene.start(CONSTANTS.SCENES.MENU)
  }

  loadImages() {
    for (let item in CONSTANTS.IMAGE) {
      this.load.image(item, `./src/assets/${CONSTANTS.IMAGE[item]}`)
    }
  }
}
