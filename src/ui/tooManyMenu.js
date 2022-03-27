import { createNinePatchTexture } from "./nine_patch.js";


// Active Skills
export var createPassiveSkillsMenu = function(scene) {
    var group = new Phaser.GameObjects.Group();

    // Create background
    var tableBgKey = createNinePatchTexture(
        scene, 136, 240, "tableBg", [6, undefined, 6], [6, undefined, 6],
    );
    var tableBg = scene.add.sprite(0, 0, tableBgKey);
    tableBg.setOrigin(0, 0);
    tableBg.setScrollFactor(0, 0);

    var titleText = scene.add.text(4, 0, "Discard Beast:")

    // Discard beast
    var cbx(beast) {
    }

    for (var i = 0; i < 4; i++) {
        // List current beasts
        var textButton = new uiWidgets.TextButton(
            scene, 0, 0, 'tableRow', cbx, scene, 0, 0, 0, 0,
        );
        textButton.setText("Beast Name");
    }

    var textButton = new uiWidgets.TextButton(
        scene, 0, 0, 'tableRow', cbx, scene, 0, 0, 0, 0,
    );
    textButton.setText("New Beast");

    group.add(tableBg);
    group.add(titleText);

    var cb = function() {
        group.clear(true, true);
        closeButton.destroy();
    }

    let closeButton = new uiWidgets.Button(scene, 136, 4, "closeButton", cb);
    closeButton.setScrollFactor(0, 0);

}
