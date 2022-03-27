import { beastsData } from "../data/beasts.js";
import { addMenuBackgroundSprite, addCloseButton } from "./menuTools.js";
import { createGraphMenu } from "../ui/graphMenu.js";
import { beasts } from "../data/beastsGraph.js";
import { menuButtonFontStyle } from "../utils.js";

export var createActiveBeastMenu = function(scene) {
    if (scene.menuOpen) {
        return;
    }

    scene.menuOpen = true;
    scene.platformerPaused = true;

    let playerBeastsData = scene.worldData.playerBeastsData;

    let group = new Phaser.GameObjects.Group();

    // Create background
    var tableBg = addMenuBackgroundSprite(scene, 0, 0, 136, 240);
    group.add(tableBg);

    var beastColumn = new uiWidgets.Column(scene, 4, 6);
    beastColumn.setScrollFactor(0, 0);
    group.add(beastColumn);

    // List of active beasts
    Object.keys(playerBeastsData).forEach(
        (key) => {
            var b = playerBeastsData[key];

            if (b.active) {
                var cb = function () {
                    // createGraphMenu(scene, key, beasts[key + "_graph"]);
                }

                let button = new uiWidgets.TextButton(scene, 0, 0, 'tableRow', cb);
                button.setScrollFactor(0, 0);
                button.sprite.setScrollFactor(0, 0);

                let beastData = beastsData.filter(i => i.id == key)[0];
                button.setText(beastData.name, menuButtonFontStyle);
                button.text.setResolution(12);
                beastColumn.addNode(button);
            }
        })

    var callback = function() {
        group.clear(true, true)

        scene.menuOpen = false;
        scene.platformerPaused = false;
    }

    let closeButton = addCloseButton(scene, 136, 4, callback);
    group.add(closeButton);

    // Menu must always appear at top of draw order.
    group.setDepth(998);
}
