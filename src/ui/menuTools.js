import { NinePatchSprite } from "./nine_patch.js";

// Create menu background
export var addMenuBackgroundSprite = function(scene, x=0, y=0, width=256, height=240) {

    let config = {
        width,
        height,
        columns: [6, undefined, 6],
        rows: [6, undefined, 6],
    }

    let tableBg = new NinePatchSprite(scene, x, y, "tableBg", config);
    tableBg.setOrigin(0, 0);
    tableBg.setScrollFactor(0, 0);
    return tableBg;
}


export var addCloseButton = function(scene, x, y, callback) {
    let closeButton = new uiWidgets.Button(scene, x, y, "closeButton", callback);
    closeButton.setScrollFactor(0, 0);
    return closeButton;
}
