import Align from "../../utils/utilities/align";

export class Player extends Phaser.GameObjects.Sprite {
    scene = null;

    constructor(scene, x, y) {
        super(scene, x, y, 'PLAYER')
        this.scene = scene

        scene.add.existing(this)

        Align.scaleToGameW(this, 0.3, scene)
    }
}