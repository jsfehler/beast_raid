export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload () {
        this.load.image("loading", "assets/loading.png");
    }

    create () {
        this.scene.start("PreloadScene");
    }
};
