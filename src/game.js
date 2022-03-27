import NinePatchPlugin from '../lib/rexninepatchplugin.min.js';
import PixelationPipelinePlugin from '../lib/rexpixelationpipelineplugin.min.js';

import { BootScene } from "./scene/boot.js";
import { PreloadScene } from "./scene/preload.js";
import { TitleScene } from "./scene/title.js";
import { PlatformerScene } from "./scene/platformer.js";
import { BattleScene } from "./scene/battle.js";

var config = {
    type: Phaser.AUTO,
    width: 256,
    height: 240,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        },
        matter: {
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 256,
            height: 240,
        }
    },
    scene: [BootScene, PreloadScene, TitleScene, PlatformerScene, BattleScene],
    backgroundColor: '#252525',
    plugins: {
        global: [
            {
                key: 'rexNinePatchPlugin',
                plugin: NinePatchPlugin,
                start: true,
            },
            {
                key: 'rexPixelationPipeline',
                plugin: PixelationPipelinePlugin,
                start: true,
            }
        ]
    }
};

var game = new Phaser.Game(config);

game.scene.start('BootScene');
