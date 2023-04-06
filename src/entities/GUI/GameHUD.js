import HUD from "./HUD"
import Text from "./Text"

export default class GameHUD extends HUD {

    /* ENTITIES */
    score = null
    turnsLeft = null

    constructor(scene) {
        super(scene)

        this.level = new Text(this.scene, this.width * 0.01, this.height * 0.01, "Level 0 out of 0")
        this.turnsLeft = new Text(this.scene, this.width * 0.01, this.height * 0.04, "Turns Left: 0")
        this.score = new Text(this.scene, this.width * 0.01, this.height * 0.07, "Score: 0")


        this.addEntities(this.score, this.turnsLeft, this.level)
    }

    setScore(score) {
        this.score.setText(`Score: ${score}`)
    }

    setTurnsLeft(turns) {
        this.turnsLeft.setText(`Turns Left: ${turns}`)
    }

    setLevel(current, total) {
        this.level.setText(`Level ${current} of ${total}`)
    }
}