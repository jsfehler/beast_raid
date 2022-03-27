export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Plugins
        var loadingBar = this.add.sprite(
            this.cameras.main.centerX, this.cameras.main.centerY, "loading",
        );

        var baseDir = "assets";

        // Audio
        this.load.audio('battle', `${baseDir}/audio/biblically_accurate_angel.ogg`);
        this.load.audio('moonlight_basilica', `${baseDir}/audio/moonlight_basilica.ogg`);

        this.load.audio('m0_track', `${baseDir}/audio/i_need_more_jurassic_power.ogg`);
        this.load.audio('m4_track', `${baseDir}/audio/a_jump_to_the_sky_a_boot_to_the_head.ogg`);
        this.load.audio('m5_track', `${baseDir}/audio/walk_with_me_again.ogg`);

        this.load.audio('sfxJump', `${baseDir}/audio/sfx/jump.wav`);
        this.load.audio('sfxWallKick', `${baseDir}/audio/sfx/wallKick.wav`);

        this.load.audio('sfxSlash', `${baseDir}/audio/sfx/slash.wav`);
        this.load.audio('sfxHeal', `${baseDir}/audio/sfx/heal.wav`);

        this.load.audio('sfxMenuOpen', `${baseDir}/audio/sfx/menuOpen.wav`);

        this.load.audio('sfxPickupCoin', `${baseDir}/audio/sfx/pickupCoin.wav`);

        // Title
        this.load.image('titleLogo', `${baseDir}/titleLogo.png`);
        // Platformer

        // // Player
        this.load.spritesheet(
            'player',
            `${baseDir}/player/player.png`, { frameWidth: 16, frameHeight: 16 },
        );
        this.load.spritesheet(
            'player_walk',
            `${baseDir}/player/run.png`, { frameWidth: 16, frameHeight: 16 },
        );
        this.load.spritesheet(
            'player_jump',
            `${baseDir}/player/jump.png`, { frameWidth: 16, frameHeight: 16 },
        );
        this.load.spritesheet(
            'player_wallkick',
            `${baseDir}/player/wall_kick.png`, { frameWidth: 16, frameHeight: 16 },
        );

        // Spark Jump
        this.load.spritesheet(
            'player_sparkjump_crouch',
            `${baseDir}/player/crouch.png`, { frameWidth: 16, frameHeight: 16 },
        );

        this.load.spritesheet(
            'player_sparkjump_crouch_charging',
            `${baseDir}/player/crouch_charging.png`, { frameWidth: 16, frameHeight: 16 },
        );

        this.load.spritesheet(
            'player_sparkjump_crouch_charged',
            `${baseDir}/player/crouch_charged.png`, { frameWidth: 16, frameHeight: 16 },
        );

        this.load.spritesheet(
            'player_sparkjump',
            `${baseDir}/player/spark_jump.png`, { frameWidth: 16, frameHeight: 16 },
        );

        this.load.spritesheet(
            'player_idle_charged',
            `${baseDir}/player/player_charged.png`, { frameWidth: 16, frameHeight: 16 },
        );


        // // Enemy
        this.load.spritesheet(
            'enemy',
            `${baseDir}/enemy_sheet.png`, { frameWidth: 8, frameHeight: 8 },
        );

        // // Save Point
        this.load.spritesheet(
            'savePoint',
            `${baseDir}/save_point.png`, { frameWidth: 16, frameHeight: 32 },
        );

        // // Flame background
        this.load.spritesheet(
            'fireTile',
            `${baseDir}/tiles/fire_tile.png`, { frameWidth: 8, frameHeight: 8 },
        );

        // // Platformer upgrade capsule
        this.load.spritesheet(
            'upgradeCapsule',
            `${baseDir}/powerup.png`, { frameWidth: 8, frameHeight: 8 },
        )

        // // Coins
        this.load.spritesheet(
            'coin',
            `${baseDir}/coin.png`, { frameWidth: 8, frameHeight: 8 },
        )

        // UI

        this.load.image('closeButton', `${baseDir}/close.png`);
        this.load.image('backButton', `${baseDir}/backbutton.png`);

        // Prompt
        this.load.spritesheet(
            'promptBorderB', `${baseDir}/prompt/border.png`, { frameWidth: 96, frameHeight: 4 },
        );

        this.load.image(
            'promptBackground', `${baseDir}/prompt/background.png`,
        );

        // Skill Tree
        this.load.spritesheet(
            'circleIcon', `${baseDir}/circle_icon.png`, { frameWidth: 8, frameHeight: 8 },
        );
        this.load.image('edgeV', `${baseDir}/graph/edgeV.png`);
        this.load.image('edgeH', `${baseDir}/graph/edgeH.png`);
        this.load.image('edgeDDR', `${baseDir}/graph/edgeDDR.png`);
        this.load.image('edgeDDL', `${baseDir}/graph/edgeDDL.png`);

        // Table
        this.load.image('tableBg', `${baseDir}/table_bg.png`);
        this.load.image('tableRow', `${baseDir}/row.png`);

        // Turn Order
        this.load.image("turnOrderHeader", `${baseDir}/turn_order_header.png`);
        this.load.image("p1_icon", `${baseDir}/p1_icon.png`);
        this.load.image("p2_icon", `${baseDir}/p2_icon.png`);

        // TODO: get beastsData length
        for (var i = 0; i < 6; i ++) {
            this.load.image(`m${i}`, `${baseDir}/beasts/m${i}/m${i}.png`);
            this.load.image(
                `m${i}_icon`,
                `${baseDir}/beasts/m${i}/m${i}_icon.png`,
            );
        }

        // Unit stats
        this.load.image("hpLabel", `${baseDir}/hp_label.png`)
        this.load.image("ctLabel", `${baseDir}/ct_label.png`)

        this.load.image("track", `${baseDir}/track.png`);
        this.load.image("bar", `${baseDir}/bar.png`);

        // Action Menu
        this.load.spritesheet(
            "actMenu",
            `${baseDir}/act_menu_big.png`,
            { frameWidth: 16, frameHeight: 16 },
        );

        // Menu
        this.load.image("menuTrack", `${baseDir}/hbar/track.png`);
        this.load.spritesheet(
            'menuBar', `${baseDir}/hbar/bar.png`, { frameWidth: 4, frameHeight: 8 }
        );

        // Battle
        this.load.image("battleTargetPointer", `${baseDir}/battleTargetPointer.png`);

        this.load.image("battleFloor", `${baseDir}/battle_floor.png`);

        // Game loading bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.tilemapTiledJSON('map1', `${baseDir}/test1.json`);
        this.load.image('mapTiles', `${baseDir}/tiles/map.png`);
    }

    create() {
        var defaultWorldData = {
            maxEnemiesInArea: 4,
            usedEnemyPositions: [],
            usedSpecialEnemyPositions: [],
            currentAP: 0,
            player: {
                x: null,
                y: null,
                maxHp: 100,
                currentAbilities: {
                    'a': null,
                    'b': null,
                    'c': null,
                    'd': null,
                },
                learnedAbilities: {
                    'jump': false,
                    'wallKick': false,
                    'sparkJump': false,
                },
            },
            playerBeastsData: {
                "m0": {
                    "everCaught": false,
                    "active": false,
                },
                "m1": {
                    "everCaught": false,
                    "active": false,
                },
                "m2": {
                    "everCaught": false,
                    "active": false,
                },
                "m3": {
                    "everCaught": false,
                    "active": false,
                },
                "m4": {
                    "everCaught": false,
                    "active": false,
                },
                "m5": {
                    "everCaught": false,
                    "active": false,
                },
            },
            beastGraphsData: {
                'm0': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
                'm1': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
                'm2': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
                'm3': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
                'm4': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
                'm5': {
                    'nodes': {
                        'a': {'active': false},
                        'b': {'active': false},
                        'c': {'active': false},
                        'd': {'active': false},
                        'e': {'active': false},
                        'f': {'active': false},
                        'g': {'active': false},
                    }
                },
            },
        }

        this.scene.start("TitleScene", {defaultWorldData});
    }
};
