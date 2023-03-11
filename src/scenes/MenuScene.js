import Phaser from "phaser";
import CONSTANTS from "../utils/constants";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.MENU });
  }

  preload() {
    console.log("Preloading menu scene..");
  }

  create() { }

  update() { }
}
