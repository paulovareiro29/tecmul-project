export default class HUD {
    scene = null
    width = null
    height = null

    /* ENTITIES */
    entities = []

    constructor(scene) {
        this.scene = scene
        this.width = scene.game.renderer.width
        this.height = scene.game.renderer.height

        this.entities = []
    }

    addEntities(...entities) {
        for (const e of entities) {
            this.entities.push(e)
        }
    }

    hide() {
        for (const e of this.entities)
            if (e)
                e.visible = false
    }

    show() {
        for (const e of this.entities)
            if (e)
                e.visible = true
    }
} 