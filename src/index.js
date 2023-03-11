import Phaser from 'phaser';
import Scenes from "./scenes"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Scenes.Load, Scenes.Menu, Scenes.Game]
};

window.game = new Phaser.Game(config);
