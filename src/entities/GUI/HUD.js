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
        for (const e in entities)
            this.entities.push(e)
    }

    hide() {
        for (const e in this.entities) e.visible = false
    }

    show() {
        for (const e in this.entities) e.visible = true
    }
} 