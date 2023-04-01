import Align from "../../utils/utilities/align";
import { limitAngle } from "../../utils/utilities/math";

export class Player extends Phaser.GameObjects.Sprite {
    scene = null;
    graphics = null;
    laser = null


    constructor(scene, x, y) {
        super(scene, x, y, 'PLAYER')
        this.scene = scene

        this.graphics = scene.add.graphics({ lineStyle: { width: 4, color: 0x00a8ff } });
        this.laser = new Phaser.Geom.Line(x, y, 0, 0)

        scene.add.existing(this)

        Align.scaleToGameW(this, 0.3, scene)
    }


    clearAim() {
        this.graphics.clear()
    }

    aim(position) {
        this.clearAim()

        this.laser.x1 = this.x
        this.laser.y1 = this.y
        this.laser.x2 = position.x
        this.laser.y2 = position.y

        Phaser.Geom.Line.SetToAngle(this.laser, this.x, this.y, limitAngle(Phaser.Geom.Line.Angle(this.laser)), 1000)

        this.graphics.strokeLineShape(this.laser);
    }
}