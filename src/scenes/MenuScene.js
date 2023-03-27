import Phaser from "phaser";
import MenuHUD from "../entities/GUI/MenuHUD";
import CONSTANTS from "../utils/constants";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.SCENES.MENU });
  }

  /* HUD LOGIC */
  hud = null

  preload() {
    this.add.image(0, 0, "BACKGROUND")
      .setDisplaySize(this.game.renderer.width, this.game.renderer.height)
      .setInteractive({ useHandCursor: false })
      .setOrigin(0)
      .setDepth(0)
  }

  create() {
    this.hud = new MenuHUD(this)
  }

  update() { }
}

