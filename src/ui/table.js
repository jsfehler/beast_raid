import { NinePatchSprite } from "./nine_patch.js";
import { BeastViewport, BeastScrollbar } from "./viewport.js";
import { beastsData } from "../data/beasts.js";
import { BattleActor } from "../battle/battle_actor.js";
import { setUnitsUI } from "../ui.js";

var fontStyle = {fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px'};


// Add a player aligned beast to battle
var addBeast = function (scene, beastData) {
    let playerTwo = new BattleActor({baseConfig: beastData});
    scene.units.push(playerTwo);
    scene.playerUnits.push(playerTwo);
    var unitsUI = setUnitsUI(scene, [playerTwo], 74, 196);
    scene.playerUnitsUI = [...scene.playerUnitsUI, ...unitsUI];

}

export var createTable = function(scene) {

    var playerBeastsData = scene.activeUnit.newConfig.playerBeastsData;

    // TODO: Patch lib to handle depth problems with background.
    // TODO: Or document it, at least.
    var viewport = new BeastViewport(scene, 6, 256 - 100 - 10, 128, 80);
    viewport.setDepth(2);

    var column = new uiWidgets.Column(scene, 0, 0);

    //viewport.addNode(column);

    column.setDepth(2);
    // TODO: Background is always at column (0, 0), even if added to another Frame

    // Create background
    let config = {
        width: 136,
        height: 100,
        columns: [6, undefined, 6],
        rows: [6, undefined, 6],
    }

    var tableBg = new NinePatchSprite(scene, 2, 138, "tableBg", config);
    tableBg.setOrigin(0, 0);
    tableBg.setDepth(999);

    var selectRow = function (scene, beastData) {
        tableBg.destroy();
        column.dismiss();
        viewport.destroy();
        scrollbar.destroy();

        //scene.infoText.setText(`${scene.activeUnit.name} uses the power of a beast`)
        scene.infoText.setText(`${scene.activeUnit.name} summons a beast`)

        // Wait .5 seconds
        var doit = function() {
            addBeast(scene, beastData);
            scene.afterTurn(scene);
        }

        var timer = scene.time.delayedCall(
            500,
            doit,
            [scene],
            scene,
        )
    };


    let bb = [];

    Object.keys(playerBeastsData).forEach(
        (key) => {
            var x = playerBeastsData[key];

            if (x.active) {
                var beastData = beastsData.filter(i => i.id == key)[0];


                var textButton = new uiWidgets.TextButton(
                    scene, 0, 0, 'tableRow', ()=>{}, scene, 0, 0, 0, 0,
                );
                textButton.sprite.on(
                    'pointerdown',
                    (pointer)=>{
                        selectRow(scene, beastData);

                    },
                )
                textButton.setText(beastData.name, fontStyle);
                textButton.text.setResolution(30);
                bb.push(textButton);
            }

        }
    )

    for (var i = 0; i < bb.length; i++) {
        column.addNode(bb[i]);
    }
    column.setDepth(1000);

    viewport.addNode(column);

    // Create a scrollbar for the viewport.
    var scrollbar = new BeastScrollbar(
        scene,
        viewport,
        true,
        true,
        "menuTrack",
        "menuBar",
        {'duration': 300, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    // Place scrollbar next to viewport.
    Phaser.Display.Align.To.RightCenter(scrollbar, viewport, 120 + 16, 0);

    // Close button
    var cb = function() {
        tableBg.destroy();
        viewport.destroy();
        scrollbar.destroy();
        closeButton.destroy();

        // Restore action menu keyboard when backing out
        scene.addMenuItemsKeyboardInputs(scene, scene.input.keyboard);
    }
    let closeButton = new uiWidgets.Button(scene, 140, 120 + 16, "closeButton", cb);
    closeButton.setScrollFactor(0, 0);

    for (var i = 0; i < bb.length; i++) {
        bb[i].sprite.on('pointerdown', () => { closeButton.destroy() });
    }

    viewport.setDepth(1000);

    return (viewport, scrollbar);
}
