import { safePlayAudio } from "../utils.js";


export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, worldData) {
        super(scene, x, y, texture, frame);

        this.scene = scene;

        scene.add.existing(this);

        // Physics
        scene.physics.world.enable([this]);

        this.body.gravity.y = 500;

        // Stop sprite from exiting map bounds.
        this.body.setCollideWorldBounds(true);

        // Animation
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'wallkick',
            frames: this.anims.generateFrameNumbers('player_wallkick', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'sparkJumpCrouch',
            frames: this.anims.generateFrameNumbers(
                'player_sparkjump_crouch', { start: 0, end: 2 }),
            frameRate: 3,
            repeat: 0,
        });


        this.anims.create({
            key: 'sparkJumpCrouchCharge',
            frames: this.anims.generateFrameNumbers(
                'player_sparkjump_crouch_charging', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'sparkJumpCrouchCharged',
            frames: this.anims.generateFrameNumbers(
                'player_sparkjump_crouch_charged', { start: 0, end: 0 }),
            frameRate: 3,
            repeat: 0
        });

        this.anims.create({
            key: 'sparkJumpRelease',
            frames: this.anims.generateFrameNumbers('player_sparkjump', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'playerIdleCharged',
            frames: this.anims.generateFrameNumbers('player_idle_charged', { start: 0, end: 0 }),
            frameRate: 3,
            repeat: 0
        });

        this.canMove = true;

        // Unlocked due to having beast
        let currentAbilities = scene.worldData.player.currentAbilities;

        this.beastAbilities = {
            'jump': false,
            'wallKick': false,
            'sparkJump': false,
        };

        Object.keys(currentAbilities).forEach(
            (key) => {
                var ability = currentAbilities[key];

                var x = this.beastAbilities[ability];
                if (x !== undefined) {
                    this.beastAbilities[ability] = true;
                }
            }
        )


        // Unlocked due to learning
        this.learnedAbilities = scene.worldData.player.learnedAbilities;

        this.sparkJumpCharging = false;
        this.sparkJumpCharged = false;

    }

    jump() {
        let sfx = this.scene.sound.add("sfxJump");
        safePlayAudio(this.scene, sfx);

        this.body.setVelocityY(-250);
        this.play('jump');
    }

    wallKick() {
        if ( this.body.blocked.left || this.body.blocked.right) {
            let sfx = this.scene.sound.add("sfxWallKick");
            safePlayAudio(this.scene, sfx);

            this.body.setVelocityX(-50);
            this.body.setVelocityY(-225);
            this.play('wallkick');

            if (this.body.blocked.left) {
                this.flipX = false;
            } else {
                this.flipX = true;
            }
        }
    }

    sparkJump() {
        this.sparkJumpCharged = false;

        this.body.setVelocityY(-1000);
        // this.body.setAcceleration(0, 1000);

        this.play('sparkJumpRelease');

    }

    update() {
        const floored = (this.body.onFloor() || this.body.touching.down);

        if (this.scene.cursors.left.isDown && this.canMove) {
            this.body.setVelocityX(-125);
            if (floored) {
                this.play('right', true);
                this.flipX = true;
            }
        } else if (this.scene.cursors.right.isDown && this.canMove) {
            this.body.setVelocityX(125);

            if (floored) {
                this.play('right', true)
                this.flipX = false;
            }

            //player.setFrame(0);
        } else if (floored)  {
            this.body.setVelocityX(0);

            if (!this.sparkJumpCharging) {
                if (this.sparkJumpCharged) {
                    this.play('playerIdleCharged');
                } else {
                    this.play('idle');
                }
            }
        }

        // Jump
        if (this.beastAbilities.jump || this.learnedAbilities.jump) {
            if (
                this.scene.jumpButton.isDown &&
                floored && this.canMove && !this.sparkJumpCharged
            ) {
                this.jump();
            }
        }

        var jumpDown = Phaser.Input.Keyboard.JustDown(this.scene.jumpButton);

        // Wall kick
        if (this.beastAbilities.wallKick || this.learnedAbilities.wallKick) {
            if (jumpDown) {
                this.wallKick();
            }
        }

        if (this.beastAbilities.sparkJump || this.learnedAbilities.sparkJump) {
            var keyObj = this.scene.input.keyboard.addKey('DOWN');

            keyObj.on('up', ()=> {
                if (this.sparkJumpCharged) {
                    this.play('playerIdleCharged');
                } else {
                    this.play('idle');
                }

                this.sparkJumpCharging = false;
            })

            // Spark jump
            if (this.scene.input.keyboard.checkDown(this.scene.cursors.down, 2000)) {

                // Charging
                if (!this.sparkJumpCharging && !this.sparkJumpCharged) {
                    this.sparkJumpCharging = true;
                    this.play('sparkJumpCrouch');
                    this.once(
                        'animationcomplete',
                        ()=> {this.play('sparkJumpCrouchCharge');},
                    )
                // Charged but holding down
                } else if (!this.sparkJumpCharged) {
                    this.sparkJumpCharging = false;
                    this.sparkJumpCharged = true;
                    this.play('sparkJumpCrouchCharged');
                }
            }

            if (jumpDown && this.sparkJumpCharged) {
                this.sparkJump();
            }
        }
    }
}
