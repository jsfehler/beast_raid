export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        // Physics
        scene.physics.world.enable([this]);

        this.body.setVelocity(0, 0).setBounce(0, 0);
        this.body.allowGravity = false;
        this.body.setCollideWorldBounds(true);
        this.body.immovable = true;

        // Animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
    }
}
