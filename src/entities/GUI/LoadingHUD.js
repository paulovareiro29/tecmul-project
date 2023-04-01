import HUD from "./HUD"
import Text from "./Text"

export default class LoadingHUD extends HUD {

    /* ENTITIES */
    loading = null

    constructor(scene) {
        super(scene)

        this.loading = new Text(this.scene, this.width * 0.5, this.height * 0.5, "Loading...", 48).setOrigin(0.5)

        this.addEntities(this.loading)
    }
}