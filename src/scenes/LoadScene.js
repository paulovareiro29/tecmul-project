import Phaser from "phaser";
import CONSTANTS from "../utils/constants";

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.LOAD });
  }

  preload() {
    console.log("Preloading loading scene..");
  }

  create() { }

  update() { }
}
