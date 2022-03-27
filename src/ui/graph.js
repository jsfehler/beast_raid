import { addMenuBackgroundSprite } from "./menuTools.js";
import { noCameraText } from "./noCameraText.js";


var fontStyle = {fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px'};
var fontStyleSmall = {fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px'};

// Get a new edge sprite in the correct direction
var edgeSprite = function(scene, size, direction, sourceSprite) {

    let textureMapper = {
        'vertical': 'edgeV',
        'horizontal': 'edgeH',
        'diagonalDownRight': 'edgeDDR',
        'diagonalDownLeft': 'edgeDDL',
    };

    let directionMapper = {
        'vertical': [0, 1],
        'horizontal': [1, 0],
        'diagonalDownRight': [1, 1],
        'diagonalDownLeft': [-1, 1],
    }

    var d = directionMapper[direction]
    var edge = scene.add.sprite(
        sourceSprite.x + (d[0] * size), sourceSprite.y + (d[1] * size), textureMapper[direction],
    );
    sourceSprite.edges.push(edge);

    return edge;

}

class GraphNode extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);

        this.setScrollFactor(0, 0);
        this.setInteractive({ useHandCursor: true });

        // Connections to other GraphNodes
        this.edges = [];

        scene.add.existing(this);
    }
}

// Create a graph from a json spec
// beastId: unique ID for each beast
// graph: graph for the current beast being displayed
export var createGraph = function(scene, beastId, graph, size=8, startX=50, startY=50) {
    var nodeSprites = {};

    // Group helps manage destroying the graph when closing the menu.
    var group = new Phaser.GameObjects.Group();
    var currentInfoGroup = new Phaser.GameObjects.Group();

    Object.keys(graph.nodes).forEach(
        (nodeKey) => {
            // Sprite for the node
            var nodeSprite = new GraphNode(scene, startX + 24, startY + 24, 'circleIcon');
            nodeSprite.node = graph.nodes[nodeKey];

            // Data for the node

            var beastData = scene.worldData.beastGraphsData[beastId];

            // Handle old save data
            if (!beastData) {
                scene.worldData.beastGraphsData[beastId] = {'nodes': {}}
                var beastData = scene.worldData.beastGraphsData[beastId];
            }

            // Handle old save data
            var dataNode = beastData['nodes'][nodeKey];
            if (!dataNode) {
                beastData['nodes'][nodeKey] = {'active': false};
                dataNode = beastData['nodes'][nodeKey];
            }

            if (dataNode.active) {
                nodeSprite.setFrame(1);
            }

            var showNodeInfo = function() {
                // When showing node info, clear previous Node's info.
                currentInfoGroup.clear(true, true);

                var nodeInfoBg = addMenuBackgroundSprite(scene, 10, 160, 256 - 20, 70);
                group.add(nodeInfoBg);
                currentInfoGroup.add(nodeInfoBg);

                var infoColumn = new uiWidgets.Column(scene, 16, startY + 44 + 100);
                group.add(infoColumn);
                currentInfoGroup.add(infoColumn);

                // When node is clicked/activated:
                // Show menu with node label, info, if activated or not.
                let label = noCameraText(
                    scene, startX + 4, startY + 124, nodeSprite.node.label, fontStyle,
                );
                label.setOrigin(0, 0);

                group.add(label);
                currentInfoGroup.add(label);

                let description = noCameraText(
                    scene, 0, 0, nodeSprite.node.description.en, fontStyleSmall, 12
                );
                description.setOrigin(0, 0);
                infoColumn.addNode(description, 0, 0, 10);

                group.add(description);
                currentInfoGroup.add(description);

                // If not active, show purchase button
                let purchaseButtonX = 14;
                let purchaseButtonY = 205;

                if (!dataNode.active) {
                    var purchaseButton = new uiWidgets.TextButton(
                        scene, purchaseButtonX, purchaseButtonY, 'tableRow', () => {},
                    );
                    purchaseButton.setText(`Cost: ${nodeSprite.node.apCost} AP`, fontStyle);

                    var purchaseFunc = function(purchaseButton, apCost) {
                        if ((scene.worldData.currentAP >= apCost)) {
                            dataNode.active = true;

                            purchaseButton.setText('Learned', fontStyle);
                            purchaseButton.setOrigin(0, 0);
                            purchaseButton.text.setResolution(12);

                            nodeSprite.setFrame(1);

                            scene.worldData.currentAP -= apCost;
                        }
                    }

                    // TODO: Remove event listener after purchase
                    purchaseButton.sprite.on(
                        'pointerdown', () => {
                            purchaseFunc(purchaseButton, nodeSprite.node.apCost);
                        },
                    );

                } else {
                    var purchaseButton = new uiWidgets.TextButton(
                        scene, purchaseButtonX, purchaseButtonY, 'tableRow', () => {},
                    );
                    purchaseButton.setText('Learned', fontStyle);
                }

                purchaseButton.setOrigin(0, 0);
                purchaseButton.setScrollFactor(0, 0);
                purchaseButton.sprite.setScrollFactor(0, 0);
                purchaseButton.text.setResolution(12);
                purchaseButton.text.setScrollFactor(0, 0);
                // infoColumn.addNode(purchaseButton, 0, 0, 10); // 10 = BOTTOM_LEFT

                group.add(purchaseButton);
                currentInfoGroup.add(purchaseButton);

                // Always draw on top
                currentInfoGroup.setDepth(999);

            }
            nodeSprite.on('pointerdown', showNodeInfo);
            group.add(nodeSprite);

            nodeSprites[nodeKey] = nodeSprite;
        })


    for (var i = 0; i < graph.edges.length; i++) {
        var sourceKey = graph.edges[i].source;
        var targetKey = graph.edges[i].target;
        var direction = graph.edges[i].direction;

        var sourceSprite = nodeSprites[sourceKey];
        var targetSprite = nodeSprites[targetKey];

        var e = new edgeSprite(scene, size, direction, sourceSprite);
        e.setScrollFactor(0, 0);
        group.add(e);

        if (direction === 'vertical') {
            targetSprite.x = e.x;
            targetSprite.y = e.y + e.height;
        } else if (direction === 'horizontal') {
            targetSprite.x = e.x + e.width;
            targetSprite.y = e.y;
        } else if (direction === 'diagonalDownRight') {
            targetSprite.x = e.x + e.width - 2;
            targetSprite.y = e.y + size;
        } else if (direction === 'diagonalDownLeft') {
            targetSprite.x = e.x - e.width + 2;
            targetSprite.y = e.y + size;
        }
    }

    // Always draw at top
    group.setDepth(999);
    return group;

}
