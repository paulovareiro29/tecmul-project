import CONSTANTS from "../../utils/constants"
import Button from "./Button"
import HUD from "./HUD"
import Text from "./Text"

export default class MenuHUD extends HUD {

    /* ENTITIES */
    title = null
    play = null

    constructor(scene) {
        super(scene)

        this.title = new Text(this.scene, this.width * 0.5, this.height * 0.20, "BBSpace", 48).setOrigin(0.5)
        this.play = new Button(this.scene, this.width * 0.5, this.height * 0.5, 'Start Game', () => this.scene.scene.start(CONSTANTS.SCENES.GAME))

        this.addEntities(this.title, this.play)
    }
}