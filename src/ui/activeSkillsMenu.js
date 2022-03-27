import { beastsData } from "../data/beasts.js";
import { addMenuBackgroundSprite, addCloseButton } from "./menuTools.js";
import { createGraphMenu } from "../ui/graphMenu.js";
import { beasts } from "../data/beastsGraph.js";
import { safePlayAudio, menuButtonFontStyle } from "../utils.js";
import { BeastViewport, BeastScrollbar } from "./viewport.js";
import { noCameraText } from "./noCameraText.js";


// Beast Grids Menu
export var createPassiveSkillsMenu = function(scene) {
    if (scene.menuOpen) {
        return;
    }

    // Play SFX
    let sfx = scene.sound.add("sfxMenuOpen");
    safePlayAudio(scene, sfx);

    scene.menuOpen = true;
    scene.platformerPaused = true;

    let playerBeastsData = scene.worldData.playerBeastsData;

    var group = new Phaser.GameObjects.Group();

    var tableBg = addMenuBackgroundSprite(scene, 0, 0);
    group.add(tableBg);

    // AP DIsplay
    var currentAPText = noCameraText(
        scene, 142, 8, `Current AP: ${scene.worldData.currentAP}`, menuButtonFontStyle,
    );
    group.add(currentAPText);

    // Title
    var titleText = noCameraText(
        scene, 34, 12, "Beasts Grids:", menuButtonFontStyle,
    );
    group.add(titleText);

    // Beasts List
    var viewport = new BeastViewport(scene, 6, 24, 136, 220);
    viewport.setScrollFactor(0, 0);
    viewport.mask.geometryMask.setScrollFactor(0, 0);
    group.add(viewport);

    var column = new uiWidgets.Column(scene, 0, 0);
    column.setScrollFactor(0, 0);

    var destroyCallback = null;

    // List of all consumed beasts
    Object.keys(playerBeastsData).forEach(
        (key) => {
            var b = playerBeastsData[key];

            if (b.everCaught) {
                var cb = function () {
                    if (destroyCallback) {
                        destroyCallback();
                    }
                    destroyCallback = createGraphMenu(
                        scene, key, beasts[key + "_graph"], 146, 22, 100, 120,
                    );
                }

                var button = new uiWidgets.TextButton(scene, 0, 0, 'tableRow', cb);
                button.setScrollFactor(0, 0);
                button.sprite.setScrollFactor(0, 0);

                let beastData = beastsData.filter(i => i.id == key)[0];
                button.setText(beastData.name, menuButtonFontStyle);
                button.text.setResolution(12);

                column.addNode(button);
            }
        })

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
    scrollbar.setScrollFactor(0, 0);
    group.add(scrollbar);

    // Place scrollbar next to viewport.
    Phaser.Display.Align.To.RightCenter(scrollbar, viewport, 120 + 8, 24);

    var cb = function() {
        group.clear(true, true);

        if (destroyCallback) {
            destroyCallback();
        }

        scene.menuOpen = false;
        scene.platformerPaused = false;
    }

    let closeButton = addCloseButton(scene, 246, 6, cb);
    group.add(closeButton);

    // Menu must always appear at top of draw order.
    group.setDepth(998);

}
