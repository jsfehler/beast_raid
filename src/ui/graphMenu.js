import { addMenuBackgroundSprite, addCloseButton } from "./menuTools.js";
import { createGraph } from "./graph.js";


// Create menu for showing a monster's graph
export var createGraphMenu = function(scene, beastId, graphData, x=0, y=0, w=136, h=240) {
    var group = new Phaser.GameObjects.Group();

    // Create background
    var tableBg = addMenuBackgroundSprite(scene, x, y, w, h);
    group.add(tableBg);

    var nodes = createGraph(scene, beastId, graphData, 8, x, y);

    var callback = function() {
        group.clear(true, true);
        nodes.clear(true, true);
    }

    let closeButton = addCloseButton(scene, (x + w) - 10, y + 8, callback);
    group.add(closeButton);

    // Ensure draws at top
    group.setDepth(999);

    return callback;
}
