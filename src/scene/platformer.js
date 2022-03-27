import { arrayTools, safePlayAudio, menuButtonFontStyle } from "../utils.js";
import { Player } from "../platformer/player.js";
import { Enemy } from "../platformer/enemy.js";

import { createActiveBeastMenu } from "../ui/beastMenu.js";
import { createPassiveSkillsMenu } from "../ui/activeSkillsMenu.js";

import { saveData, loadAllData } from "../saveLoad.js";

import { defaultBattleRule, healBattleRule } from "../data/battleRule.js";

import { noCameraText } from "../ui/noCameraText.js";

import { beastsData } from "../data/beasts.js";

// If at a save point, allow player to save game.
var saveGame = function(scene) {
    let canSave = scene.physics.overlap(scene.player, scene.savePointSprites);
    if (canSave) {
        saveData('beastRaid', {0: scene.worldData});
    }
}


export class PlatformerScene extends Phaser.Scene {
    constructor() {
        super('PlatformerScene');
    }

    create(data) {
        this.worldData = data.data;
        this.slotNum = data.slotNum;

        this.platformerPaused = false;

        // Start music
        var musicConfig = {
            loop: true,
        };

        this.music = this.sound.add('moonlight_basilica', musicConfig);

        safePlayAudio(this, this.music);

        this.addInputs(this.input.keyboard);

        // Load map data
        var tilemap = this.make.tilemap({ key: "map1", tileWidth: 8, tileHeight: 8 });
        const tiles = tilemap.addTilesetImage("gh", "mapTiles");
        const layer = tilemap.createLayer("Tile Layer 1", tiles, 0, 0);
        // layer.setCollisionBetween(0, 2);
        layer.setCollision(2)

        this.physics.world.bounds.width = layer.width;
        this.physics.world.bounds.height = layer.height;

        // Setup animated tiles
        var allFireTilesData = tilemap.objects.filter(i => i.name == 'fire tile')[0];

        // Animation
        this.anims.create({
            key: 'fireTileIdle',
            frames: this.anims.generateFrameNumbers('fireTile', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        for (var i = 0; i < allFireTilesData.objects.length; i++) {
            var fireTile = allFireTilesData.objects[i];
            var fireTileSprite = this.add.sprite(fireTile.x + 4, fireTile.y + 4, 'fireTile');
            fireTileSprite.anims.play('fireTileIdle');
            this.physics.world.enable([fireTileSprite]);
        }

        // Setup player
        var playerStartPosition = tilemap.objects.filter(i => i.name == 'player start')[0];

        playerStartPosition = playerStartPosition.objects.filter(i => i.name == 'playerStart');
        playerStartPosition = playerStartPosition[0];

        var px = this.worldData.player.x || playerStartPosition.x;
        var py = this.worldData.player.y || playerStartPosition.y;

        this.player = new Player(
            this, px, py, 'player',
        );

        this.player.setDepth(1);

        // Force save when starting new game
        if (this.worldData.player.x === null) {
            let existingSaveData = loadAllData('beastRaid');

            let newSaveData = existingSaveData;
            newSaveData[this.slotNum] = this.worldData;
            saveData('beastRaid', newSaveData);
        }

        // Setup Enemies
        var allEnemiesData = tilemap.objects.filter(i => i.name == 'enemy spawn')[0];

        // Get enemy locations tagged as "mAny".
        var randomEnemiesData = allEnemiesData.objects.filter(i => i.name == 'mAny');

        var openEnemyPositions = randomEnemiesData;

        for (var i = 0; i < this.worldData.usedEnemyPositions.length; i++) {
            var j = this.worldData.usedEnemyPositions[i];
            openEnemyPositions = randomEnemiesData.filter(i => (i.x !== j[0]) && (i.y !== j[1]))
        }

        // Special Enemies, not randomly assigned
        var specialEnemiesData = allEnemiesData.objects.filter(i => i.name != 'mAny');
        var usedSpecialEnemyPositions = this.worldData.usedSpecialEnemyPositions;

        // Filter out dead special enemies
        for (var i = 0; i < usedSpecialEnemyPositions.length; i++) {
            var j = usedSpecialEnemyPositions[i];
            specialEnemiesData = specialEnemiesData.filter(i => (i.x !== j[0]) && (i.y !== j[1]))
        }

        for (var i = 0; i < specialEnemiesData.length; i++) {
            var specialEnemyData = specialEnemiesData[i];
            var e = new Enemy(this, specialEnemyData.x, specialEnemyData.y, 'enemy');
            e.beastId = specialEnemyData.name;

            let beastData = beastsData.filter(i => i.id == e.beastId)[0];

            e.musicTrackName = beastData.musicTrackName;
            e.intro = beastData.intro;
            e.play('idle');
            this.physics.add.collider(this.player, e, this.startBattleSpecial, null, this);
        }

        // Current number of enemies allowed to spawn
        this.maxEnemiesInArea = this.worldData.maxEnemiesInArea;

        this.enemies = [];

        // Place random enemies
        for (var i = 0; i <= this.maxEnemiesInArea; i++) {
            var enemyData = arrayTools.pickRandomFrom(openEnemyPositions);

            // Less open positions than number of allowed enemies.
            if (enemyData === undefined) {
                break;
            }

            var enemy = new Enemy(this, enemyData.x, enemyData.y, 'enemy');
            enemy.play('idle');
            this.enemies.push(enemy);

            // Prevent reuse in same loop
            openEnemyPositions = openEnemyPositions.filter(
                i => (i.x !== enemyData.x) && (i.y !== enemyData.y),
            )
        }

        // Collision checks
        this.physics.add.collider(this.player, layer);

        for (var i = 0; i < this.enemies.length; i++) {
            this.physics.add.collider(this.player, this.enemies[i], this.startBattle, null, this);
        }

        // Save Points
        var savePoints = tilemap.objects.filter(i => i.name === 'save points')[0];

        // Animation
        this.anims.create({
            key: 'savePointIdle',
            frames: this.anims.generateFrameNumbers('savePoint', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1
        });

        // Setup save points
        this.savePointSprites = this.add.group();

        // Record player position
        var recordPosition = function() {
            this.worldData.player.x = this.player.x;
            this.worldData.player.y = this.player.y;
        }

        // Message that appears when you're near a save point.
        this.saveTxtMsg = "Press [W] to save.";
        this.saveTxt = noCameraText(this, 256/2, 24, this.saveTxtMsg, menuButtonFontStyle);
        this.saveTxt.setOrigin(0.5, 0.5);
        this.saveTxt.setVisible(false);
        this.zones = [];

        this.showSaveMsg = false;

        var toggleSaveMsg = function(player, zone) {
            this.saveTxt.setVisible(true);
        }

        for (var i = 0; i < savePoints.objects.length; i++) {
            var savePoint = savePoints.objects[i];
            var savePointSprite = this.add.sprite(savePoint.x, savePoint.y - 8, 'savePoint');
            savePointSprite.anims.play('savePointIdle');
            this.physics.world.enable([savePointSprite]);
            this.savePointSprites.add(savePointSprite);
            this.physics.add.overlap(this.player, savePointSprite, recordPosition, null, this);

            var triggerW = this.add.zone(savePoint.x, savePoint.y - 8).setSize(16, 32);
            this.zones.push(triggerW);
            this.physics.world.enable([triggerW]);
            this.physics.add.overlap(this.player, triggerW, toggleSaveMsg, null, this);
        }

        // HP Upgrade capsules
        this.hpCapsulePointSprites = this.add.group();

        var hpCapsulePoints = tilemap.objects.filter(i => i.name === 'hp_upgrade')[0];

        // Animation
        this.anims.create({
            key: 'upgradeCapsuleIdle',
            frames: this.anims.generateFrameNumbers('upgradeCapsule', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        var getHPCapsule = function(player, hpCapsule) {
            hpCapsule.destroy();
            this.worldData.player.maxHp += 10;
        }

        for (var i = 0; i < hpCapsulePoints.objects.length; i++) {
            var hpCapsulePoint = hpCapsulePoints.objects[i];
            var hpCapsulePointSprite = this.add.sprite(
                hpCapsulePoint.x + 4, hpCapsulePoint.y + 4, 'upgradeCapsule',
            );
            hpCapsulePointSprite.anims.play('upgradeCapsuleIdle');
            this.physics.world.enable([hpCapsulePointSprite]);
            this.hpCapsulePointSprites.add(hpCapsulePointSprite);
            this.physics.add.overlap(this.player, hpCapsulePointSprite, getHPCapsule, null, this);
        }

        // Coins
        this.coinSprites = this.add.group();
        var coinPoints = tilemap.objects.filter(i => i.name === 'coins')[0];

        // Animation
        this.anims.create({
            key: 'coinIdle',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        var self = this;

        var getCoin = function(player, coin) {
            // Play SFX
            let sfx = self.sound.add("sfxPickupCoin");
            safePlayAudio(self, sfx);

            coin.destroy();
        }

        for (var i = 0; i < coinPoints.objects.length; i++) {
            var coinPoint = coinPoints.objects[i];
            var coinPointSprite = this.add.sprite(
                coinPoint.x + 4, coinPoint.y + 4, 'coin',
            );
            coinPointSprite.anims.play('coinIdle');
            this.physics.world.enable([coinPointSprite]);
            this.hpCapsulePointSprites.add(coinPointSprite);
            this.physics.add.overlap(this.player, coinPointSprite, getCoin, null, this);
        }

        // Camera
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player, true);

        let postFxPlugin = this.plugins.get('rexPixelationPipeline');
        this.cameraFilter = postFxPlugin.add(this.cameras.main);
        this.cameraFilter.pixelWidth = 0;
        this.cameraFilter.pixelHeight = 0;

        // Track if battle was triggered
        this.battleTriggered = false;
    }

    startBattleSpecial(player, enemy) {
        this.battleTriggered = true;

        this.worldData.player.x = this.player.x;
        this.worldData.player.y = this.player.y;

        // Add enemy position to prevent being reused after battle.
        let newPositions = [enemy.x, enemy.y];
        this.worldData.usedSpecialEnemyPositions.push(newPositions);

        var self = this;

        var doit = function() {
            self.music.stop();
            self.scene.start(
                "BattleScene",
                {
                    worldData: self.worldData,
                    beastId: enemy.beastId,
                    musicTrackName: enemy.musicTrackName,
                    enemyOverrideScript: [healBattleRule, defaultBattleRule],
                    slotNum: self.slotNum,
                    intro: enemy.intro,
                }
            );
        }

        this.tweens.add({
            targets: this.cameraFilter,
            pixelWidth: 10,
            pixelHeight: 10,
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            yoyo: false,
            onComplete: doit,
        });
    }

    startBattle(player, enemy) {
        this.battleTriggered = true;

        this.worldData.player.x = this.player.x;
        this.worldData.player.y = this.player.y;

        // Add enemy position to prevent being reused after battle.
        let newPositions = [enemy.x, enemy.y];

        this.worldData.usedEnemyPositions.push(newPositions);

        var self = this;

        var doit = function() {
            self.music.stop();
            self.scene.start(
                "BattleScene",
                {
                    worldData: self.worldData,
                    slotNum: self.slotNum,
                }
            );
        }

        this.tweens.add({
            targets: this.cameraFilter,
            pixelWidth: 10,
            pixelHeight: 10,
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            yoyo: false,
            onComplete: doit,
        });
    }

    update () {
        this.showSaveMsg = false;

        for (var i = 0; i < this.zones.length; i++) {
            var zone = this.zones[i];
            // For debugging only:
            // zone.body.debugBodyColor = zone.body.touching.none ? 0x00ffff : 0xffff00;

            // If touching save point and message not visible, show message
            var touching = !zone.body.touching.none;

            if (touching) {
                this.showSaveMsg = true;
                break;
            }
        }

        // Hide save message
        if ( (!this.showSaveMsg) ) {
            this.saveTxt.setVisible(false);
        }

        if (this.platformerPaused) {
            return;
        }

        if (this.battleTriggered) {
            return;
        }

        this.player.update();
    }

    addInputs(keyboard) {
        this.cursors = keyboard.createCursorKeys();
        this.jumpButton = keyboard.addKey("SPACE");

        this.menuButton = keyboard.addKey("W");

        // keyboard.on('keydown-R', () => createActiveBeastMenu(this), this);
        keyboard.on('keydown-E', () => createPassiveSkillsMenu(this), this);

        // Key to save game at save point
        keyboard.on('keydown-W', () => saveGame(this), this);
    }

}
