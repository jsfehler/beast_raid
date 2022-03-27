import { arrayTools, safePlayAudio, menuButtonFontStyle } from "../utils.js";
import { setUnitsUI, displayTurnOrderIcons, createActionMenu } from "../ui.js";
import { estimateTurnOrder } from "../battle/estimate_turn_order.js";
import { beastsData } from "../data/beasts.js";
import { playerOne } from "../data/player.js";
import { createTable } from "../ui/table.js";
import { BattleActor } from "../battle/battle_actor.js";
import { defaultBattleRule } from "../data/battleRule.js";
import { loadData } from "../saveLoad.js";

// https://codepen.io/yandeu/pen/EMBLeq
const Pause = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');

    }

    // When actionMenu is visible, add inputs
    addPlayerActionMenuInputs(scene, keyboard) {
        keyboard.on('keydown-UP', () => this.chooseTarget(scene, this.consumeBeast));
        keyboard.on('keydown-DOWN', () => this.afterTurn(this));
        keyboard.on('keydown-LEFT', () => this.selectTransform(this));
        keyboard.on('keydown-RIGHT', () => this.chooseTarget(scene, this.doAttack));
    }

    addBeastActionMenuInputs(scene, keyboard) {
        keyboard.on('keydown-LEFT', () => this.afterTurn(this));
        keyboard.on('keydown-RIGHT', () => this.chooseTarget(scene, this.doAttack));
    }

    playMusic(beastData) {
        // Start music
        var musicTrackName = beastData.musicTrackName || 'battle';

        var musicConfig = {
            loop: true,
        };

        this.music = this.sound.add(musicTrackName, musicConfig);

        safePlayAudio(this, this.music);
    }

    create(data) {
        this.worldData = data.worldData;
        var beastId = data.beastId;
        this.enemyScript = data.enemyOverrideScript || [defaultBattleRule];

        this.slotNum = data.slotNum;

        // Setup camera
        this.cameras.main.setRoundPixels(true);

        // Flag for determining which phase of battle we're in.
        this.inTickPhase = true;

        // Handle actor data
        var beastData;
        if (beastId) {
            // If a beastId was provided, pull that data for the battle.
            beastData = beastsData.filter(i => i.id == beastId)[0];
        } else {
            // Else, pick random beast to fight
            // Don't put area bosses in pool of random enemies
            var xbeastsData = beastsData.filter(i => i.id != 'm5');
            beastData = arrayTools.pickRandomFrom(xbeastsData);

        }

        this.playMusic(beastData);

        // Floor graphic
        this.add.sprite((256/2) + 4, 120, 'battleFloor');

        this.beast0 = new BattleActor({baseConfig:beastData});

        this.playerOne = new BattleActor({baseConfig: playerOne, config: this.worldData});

        // List of all units Data participating in the battle.
        this.units = [this.playerOne, this.beast0];
        this.koUnits = [];

        // List of all player units
        this.playerUnits = [this.playerOne];
        this.playerUnitsUI = setUnitsUI(this, this.playerUnits, 16, 196);

        // List of all enemy units
        this.enemyUnits = [this.beast0];
        this.enemyUnitsUI = setUnitsUI(this, this.enemyUnits, 16, 24, 16, 16);

        this.activeUnit = null;

        // Turn Order Estimator
        // Can only ever be an estimate, since unit stats could change, moves could use different amounts of CT, etc.
        // Must be refreshed immediately after each unit's turn to remain accurate.
        this.estimatedTurnsAmount = 12;
        this.estimatedTurnOrder = [];
        for (var idx = 0; idx < this.estimatedTurnsAmount; idx++) {
            estimateTurnOrder(idx, this.estimatedTurnOrder, this.units);
        }

        // Turn Order Estimation Display
        this.turnOrderDisplayIconHeight = 16;

        this.turnOrderDisplayIcons = displayTurnOrderIcons(
            this,
            this.turnOrderDisplayIconHeight,
            this.estimatedTurnOrder,
            this.estimatedTurnsAmount,
        )

        // Menu of things player can do
        this.playerMenuItems = createActionMenu(this);

        this.playerMenuItems.sprites[0].on(
            'pointerdown', (pointer) => {this.chooseTarget(this, this.doAttack)}
        )

        // Defend
        this.playerMenuItems.sprites[1].on(
            'pointerdown', (pointer) => {this.afterTurn(this)}
        )

        // Beast Transform
        this.playerMenuItems.sprites[2].on(
            'pointerdown', (pointer) => {this.selectTransform(this)}
        )

        // Consume Beast
        this.playerMenuItems.sprites[3].on(
            'pointerdown', (pointer) => {this.chooseTarget(this, this.consumeBeast)}
        )

        this.beastMenuItems = createActionMenu(this, true);

        this.beastMenuItems.sprites[0].on(
            'pointerdown', (pointer) => {this.chooseTarget(this, this.doAttack)}
        )

        // Defend
        this.beastMenuItems.sprites[1].on(
            'pointerdown', (pointer) => {this.afterTurn(this)}
        )
        this.beastMenuItems.group.setActive(false).setVisible(false);

        this.menuItems = this.playerMenuItems;

        // Keyboard handler for action menu
        this.addMenuItemsKeyboardInputs = this.addPlayerActionMenuInputs;

        this.beastSprite = this.add.sprite(256/2 - 25, 88, this.beast0.config.id);

        // Sprite for the enemy
        if (data.intro) {
            var timeline = this.tweens.createTimeline();

            timeline.add({
                targets: this.beastSprite,
                y: {from: 240, to: 120},
                ease: 'Linear',
                duration: 3000,
                repeat: 0,
                yoyo: false,
            });

            timeline.add({
                targets: this.beastSprite,
                y: {from: 120, to: 130},
                ease: 'Linear',
                duration: 2000,
                repeat: -1,
                yoyo: true,
            });

            timeline.play();
        }

        // Enemy Sprites and Enemy Units lists should have same order.
        this.enemySprites = [this.beastSprite];

        // Link sprites to unit data
        for (let i = 0; i < this.enemySprites.length; i++) {
            this.enemySprites[i].battleActor = this.enemyUnits[i];
        }

        // Info text at top of screen
        var fontStyle = {fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px'};
        this.infoText = this.add.text(8, 8, "Battle Start", fontStyle);
        this.infoText.setResolution(30);

        this.timeCheck = 0;
        this.inTurn = false;
    }

    update() {
        // If no units can act, go to tickPhase.
        if (this.units.filter(function(o) { return o.ct >= 100; }).length === 0 && !this.inTurn){
            this.inTickPhase = true;
        } else {
            this.inTickPhase = false;
        }

        if (this.inTickPhase) {
            this.tickPhase(this.units);
        }

        // If not in tickPhase, a unit gets a turn, so show the menu.
        else if (this.inTickPhase === false && !this.inTurn) {
            // Get unit who's turn it is.
            this.activeUnit = this.units.filter(function(o) { return o.ct >= 100; })[0];

            // Update info text.
            this.infoText.setText(this.activeUnit.name + "'s turn.")

            this.inTurn = true;

            if (this.playerUnits.includes(this.activeUnit)) {
                this.showActionMenu();
            } else {
                // Enemy Turn
                var pick = arrayTools.pickRandomFrom(this.playerUnits);
                this.doAttack(this, this.activeUnit, pick);

                // End battle if all players killed
                let deadPlayerUnits = this.playerUnits.filter((o) => { return o.hp <= 0; })
                if (deadPlayerUnits.length == this.playerUnits.length) {
                    this.lostBattle();
                }
            }
        }
    }

    lostBattle() {
        this.music.stop();
        this.scene.stop("BattleScene");

        let worldData = this.worldData;

        let loadedWorldData = loadData("beastRaid", this.slotNum);
        worldData = loadedWorldData;


        this.scene.start("PlatformerScene", {slotNum: this.slotNum, data: this.worldData});
    }

    showActionMenu() {
        this.menuItems = this.playerMenuItems;
        this.addMenuItemsKeyboardInputs = this.addPlayerActionMenuInputs;

        if (this.activeUnit.name !== 'Player') {
            this.menuItems = this.beastMenuItems;
            this.addMenuItemsKeyboardInputs = this.addBeastActionMenuInputs;
        }

        for (let i = 0; i < this.menuItems.group.length; i++) {
            this.menuItems.sprites[i].x = 100;
            this.menuItems.sprites[i].y = 160;
        }
        this.menuItems.group.setActive(true).setVisible(true);
        this.menuItems.activate();
        this.addMenuItemsKeyboardInputs(this, this.input.keyboard);
    }

    tickPhase() {
        // Increase every unit in battle's CT by their Speed.
        for (let i = 0; i < this.playerUnitsUI.length; i++) {
            this.playerUnits[i].ct += this.playerUnits[i].speed;
            this.playerUnitsUI[i].ct.adjustBar(this.playerUnits[i].speed);
        }

        for (let i = 0; i < this.enemyUnitsUI.length; i++) {
            this.enemyUnits[i].ct += this.enemyUnits[i].speed;
            this.enemyUnitsUI[i].ct.adjustBar(this.enemyUnits[i].speed);
        }
    }

    chooseTarget(context, actionFunc) {
        // Remove action menu keyboard listeners
        this.input.keyboard.removeAllListeners();

        // Update info text
        var oldText = this.infoText.text;
        this.infoText.setText("Confirm Target")

        // Hide action menu
        this.menuItems.group.setActive(false).setVisible(false);

        // Default target position
        var enemySprite = this.enemySprites[0];
        enemySprite.setInteractive({ useHandCursor: true });

        var targetSprite = this.add.sprite(
            enemySprite.x, // + (enemySprite.width/2),
            enemySprite.y - 40,
            'battleTargetPointer',
        );
        targetSprite.setOrigin(0, 0);

        var attacker = this.activeUnit;
        var target = this.enemySprites[0].battleActor;

        // Confirm target and proceeed to action
        var confirmTarget = function(scene) {
            scene.input.keyboard.removeAllListeners();

            // Remove mouse event on enemy sprites
            for (let i = 0; i < scene.enemySprites.length; i++) {
                let currentEnemySprite = scene.enemySprites[i];
                currentEnemySprite.removeListener('pointerdown');
                currentEnemySprite.removeListener('pointerover');
            }

            targetSprite.destroy();
            backButton.destroy();

            // Proceed to action
            actionFunc(scene, attacker, target);
        };

        // Add event to sprites, allowing them to be clicked
        for (let i = 0; i < this.enemySprites.length; i++) {
            let currentEnemySprite = this.enemySprites[i];

            // Use mouse to switch targets
            currentEnemySprite.on(
                'pointerover',
                () => {
                    // Move targetSprite over this sprite
                    targetSprite.x = currentEnemySprite.x;

                    // Target changes on mouse over
                    target = currentEnemySprite.battleActor;
                },
            );

            // Click enemy sprite to confirm target
            currentEnemySprite.once(
                'pointerdown', () => {confirmTarget(context)}
            )
        }

        // Add keyboard listener to confirm target
        this.input.keyboard.on('keydown-ENTER', () => confirmTarget(this));

        var backButtonAction = function(scene) {
            scene.input.keyboard.removeAllListeners();

            scene.showActionMenu();
            scene.infoText.setText(oldText);

            for (let i = 0; i < scene.enemySprites.length; i++) {
                let currentEnemySprite = scene.enemySprites[i];
                currentEnemySprite.removeListener('pointerdown');
                currentEnemySprite.removeListener('pointerover');

                targetSprite.destroy();
                backButton.destroy();
            }
        }

        // Add button to back out
        let backButton = this.add.sprite(10, 100, "backButton");
        backButton.setInteractive({ useHandCursor: true });
        var self = this;
        backButton.on('pointerdown', () => {backButtonAction(self)})
        this.input.keyboard.on('keydown-LEFT', () => backButtonAction(self));

    }

    // TODO: Replace beast instead of banning the menu
    selectTransform(context) {
        if (context.playerUnits.length < 2) {
            // Remove action menu keyboard listeners
            this.input.keyboard.removeAllListeners();

            var viewport, scrollbar = createTable(this);
        }
    }

    // Called when player tries to consume a beast.
    consumeBeast(context, attacker, target) {
        var beast = context.enemyUnits[0];
        context.infoText.setText(`${context.activeUnit.name} tries to consume ${beast.name}`);

        // TODO: Better formula for catch rate.
        var threeMaxHp = (3 * beast.maxHp);
        var catchRate = (threeMaxHp - (2 * beast.hp)) * 255  / threeMaxHp;
        var catchValue = catchRate / 255;
        var isCaught = Math.random() + catchValue;

        async function didNotCatch(context) {
            context.infoText.setText(`Consume failed!`);
            await Pause(1000);
            context.afterTurn(context);
        }

        async function didCatch(context) {
            context.infoText.setText(`Consume success!`);
            await Pause(1000);
            context.consumePrompt(beast);
        }

        var tryCatch = function(context) {
            if (isCaught >= 1.0) {
                // Mark beast as active and caught
                var existingBeastData = context.worldData.playerBeastsData[beast.config.id];

                // Handle old save games
                if ((!existingBeastData)) {
                    context.worldData.playerBeastsData[beast.config.id] = {};
                    existingBeastData = context.worldData.playerBeastsData[beast.config.id];
                }

                existingBeastData.active = true;
                existingBeastData.everCaught = true;
                didCatch(context);
            } else {
                didNotCatch(context);
            }
        }

        var timer = context.time.delayedCall(
            1000,
            tryCatch,
            [context],
            context,
        )
    }

    consumePrompt(beast) {
        // If enemy has ability, show "You Got: X" prompt
        async function doit(scene, beast) {
            let x = (240/2);
            let y = (256/2);

            let t = scene.add.sprite(x, y, 'promptBorderB');
            t.flipX = true;
            t.flipY = true;
            let b = scene.add.sprite(x, y, 'promptBorderB');

            scene.anims.create({
                key: 'promptBorderAnim',
                frames: scene.anims.generateFrameNumbers('promptBorderB', { start: 0, end: 2 }),
                frameRate: 9,
                repeat: -1
            });

            t.play('promptBorderAnim');
            b.play('promptBorderAnim');

            let bg = scene.add.sprite(x, y, 'promptBackground');
            bg.displayHeight = 1;

            scene.tweens.add(
                {
                    targets: bg,
                    ease: 'Cubic',
                    repeat: 0,
                    props: {
                        displayHeight: { value: 24, duration: 500, ease: 'Power2'},
                    }
                }
            )

            scene.tweens.add(
                {
                    targets: t,
                    ease: 'Bounce.Out',
                    duration: 1000,
                    repeat: 0,
                    y: y - 14,
                }
            )

            scene.tweens.add(
                {
                    targets: b,
                    ease: 'Bounce.Out',
                    duration: 1000,
                    repeat: 0,
                    y: y + 14,
                }
            )

            await Pause(1000);

            var ability = beast.config.ability;

            var tx = scene.add.text(
                x, y, `YOU GOT: ${beast.config.abilityName}`, menuButtonFontStyle,
            );
            tx.setResolution(12);
            tx.setOrigin(0.5, 0.5);

            // Find first open slot to put ability into.
            var currentAbilities = scene.worldData.player.currentAbilities;

            for (const [key, value] of Object.entries(currentAbilities)) {
                if (value === null) {
                    currentAbilities[key] = ability;
                    break;
                }
            }

            // TODO: If you have all slots filled, prompt player to remove one ability.

            await Pause(4000);

            scene.endBattle();
        }

        if (beast.config.ability) {
            doit(this, beast);
        } else {
            this.endBattle();
        }
    }

    // Victory, enemy has been defeated or consumed.
    endBattle() {
        this.music.stop();
        this.scene.stop("BattleScene");
        this.scene.start("PlatformerScene", {slotNum: this.slotNum, data: this.worldData});
    }

    // TODO: Use an actual damage formula
    doAttack(context, attacker, target) {
        // Wait 3 seconds before doing the attack
        async function doit(context) {

            for (let i = 0; i < context.enemyScript.length; i++) {
                var rule = context.enemyScript[i];

                let targets;
                if (rule.target === 'self') {
                    targets = [attacker];
                } else {
                    targets = [target]
                }

                if (rule.condition(attacker, targets)) {
                    // Update info text.
                    context.infoText.setText(rule.message(attacker, targets));
                    await Pause(1000);
                    rule.action(context, attacker, targets);
                    break;
                }
            }

            // Check if killed
            if (target.hp <= 0) {
                this.units = context.units.filter(i => i !== target);
                this.koUnits.push(target);
            }

            // Victory
            let deadEnemyUnits = context.enemyUnits.filter((o) => { return o.hp <= 0; })
            if (deadEnemyUnits.length == this.enemyUnits.length) {
                playerOne.hp = 100;

                // Reward AP when enemy killed
                // TODO: Use some sort of formula to calulate AP.
                this.worldData.currentAP += 1;

                context.endBattle();
            }

            context.afterTurn(context);
        }

        var timer = context.time.delayedCall(
            50,
            doit,
            [context],
            context,
        )
    }

    afterTurn(context) {
        // Remove action menu keyboard listeners
        this.input.keyboard.removeAllListeners();

        // Remove HUD while turn occurs
        this.menuItems.group.setActive(false).setVisible(false);

        // Turn Order Estimator Calculate (At end of turn, before next turn waiting phase)
        context.activeUnit.testCT = 0;

        for (var idx = 0; idx < context.estimatedTurnsAmount; idx++) {
            estimateTurnOrder(idx, context.estimatedTurnOrder, context.units);
        }

        // Refresh Turn Order Display
        for (var idx = 0; idx < context.estimatedTurnsAmount; idx++) {
            context.turnOrderDisplayIcons[idx].destroy();
        }

        this.turnOrderDisplayIcons = displayTurnOrderIcons(
            context,
            context.turnOrderDisplayIconHeight,
            context.estimatedTurnOrder,
            context.estimatedTurnsAmount,
        )

        // Reset unit's CT (At end of turn, after estimation)
        context.activeUnit.ct = 0;
        context.activeUnit.ui.ct.adjustBar(-context.activeUnit.ui.ct.valueRange.getCurrentValue());

        this.timeCheck = this.time.now;
        this.inTurn = false;
    }
};
