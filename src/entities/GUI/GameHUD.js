import HUD from "./HUD"
import Text from "./Text"

export default class GameHUD extends HUD {

    /* ENTITIES */
    score = null
    turnsLeft = null
    gameover = null

    constructor(scene) {
        super(scene)

        this.gameover = new Text(this.scene, this.width / 2, this.height * 0.20, "GAME OVER", 48).setOrigin(0.5)
        this.score = new Text(this.scene, this.width * 0.02, this.height * 0.88, "Score: 0")
        this.turnsLeft = new Text(this.scene, this.width * 0.02, this.height * 0.92, "Turns Left: 0")


        this.gameover.visible = false
        this.addEntities(this.gameover, this.score, this.turnsLeft)

    }

    setScore(score) {
        this.score.setText(`Score: ${score}`)
    }

    setTurnsLeft(turns) {
        this.turnsLeft.setText(`Turns Left: ${turns}`)
    }

    setGameOver(bool) {
        this.isGameOver = bool

        if (this.isGameOver) {
            this.gameover.visible = true
            this.turnsLeft.visible = false
            this.score.setPosition(this.width / 2, this.height * 0.26).setOrigin(0.5)
        } else {
            this.gameover.visible = false
            this.turnsLeft.visible = true
            this.score.setPosition(this.width * 0.02, this.height * 0.88).setOrigin(0)
        }
    }
}