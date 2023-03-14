import Phaser from 'phaser';
import Scenes from "./scenes"

const config = {
    type: Phaser.AUTO,
    width: 375,
    height: 666,
    scene: [Scenes.Load, Scenes.Menu, Scenes.Game],
    physics: {
        default: 'arcade'
    }
};

window.game = new Phaser.Game(config);
