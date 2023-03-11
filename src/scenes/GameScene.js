import Phaser from "phaser";
import CONSTANTS from "../utils/constants";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.GAME });
  }

  preload() {
    console.log("Preloading game scene..");
  }

  create() { }

  update() { }
}
