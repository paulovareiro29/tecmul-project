import CONSTANTS from "../../utils/constants"
import Button from "./Button"
import HUD from "./HUD"
import Text from "./Text"

export default class GameOverHUD extends HUD {

    /* ENTITIES */
    gameover = null
    restart = null
    exit = null

    constructor(scene) {
        super(scene)

        this.gameover = new Text(this.scene, this.width * 0.5, this.height * 0.20, "GAME OVER", 48).setOrigin(0.5)
        this.score = new Text(this.scene, this.width * 0.5, this.height * 0.26, "Score: 0").setOrigin(0.5)

        this.restart = new Button(this.scene, this.width * 0.5, this.height * 0.5, "Restart", () => {
            scene.scene.restart()
        })
        this.exit = new Button(this.scene, this.width * 0.5, this.height * 0.6, "Exit", () => {
            scene.scene.restart()
            scene.scene.start(CONSTANTS.SCENES.MENU)
        })

        this.addEntities(this.gameover, this.score, this.restart, this.exit)
    }

    setScore(score) {
        this.score.setText(`Score: ${score}`)
    }
}