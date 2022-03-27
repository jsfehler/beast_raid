// Text style
var fontStyle = {fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px'};


/** An object for displaying a player unit's GUI. */
var UnitGUI = function (scene, data, x=0, y=0, ctpos=0) {
    this.name = scene.add.text(
        ctpos.x, ctpos.y, data.name.toUpperCase(), fontStyle,
    );
    this.name.setResolution(30)

    var hpRow = new uiWidgets.Row(scene, ctpos.x, ctpos.y + 16);

    var hpLabel = scene.add.sprite(0, 0, "hpLabel");
    this.hp = new uiWidgets.QuantityBar(
        scene,
        {"x": 0, "y": 0},
        {startValue: data.hp, maxValue: data.maxHp},
        false,
        false,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    hpRow.addNode(hpLabel);
    hpRow.addNode(this.hp);

    var ctRow = new uiWidgets.Row(scene, ctpos.x, ctpos.y + 24);

    var ctLabel = scene.add.sprite(0, 0, "ctLabel");
    this.ct = new uiWidgets.QuantityBar(
        scene,
        {"x": 0, "y": 0},
        {startValue: data.ct, maxValue: 100},
        false,
        false,
        "track",
        "bar",
        {'duration': 400, 'ease': Phaser.Math.Easing.Quadratic.Out}
    );

    ctRow.addNode(ctLabel);
    ctRow.addNode(this.ct);

    // Always draw over other sprites
    hpRow.setDepth(999);
    ctRow.setDepth(999);


};

/** Display every player unit's data in a row of columns */
export var setUnitsUI = function(scene, unitsData, rowX=0, rowY=0, x=0, y=0) {
    var unitsUI = [];

    var currentX = 0;
    var currentY = 0;
    for (let i = 0; i < unitsData.length; i++) {
        // Hack. Mask breaks in container.
        var ctpos = {x: rowX + currentX, y: rowY};
        currentX += 96;

        var gui = new UnitGUI(scene, unitsData[i], x, y, ctpos);
        unitsUI.push(gui);

        unitsData[i].ui = gui;
    }

    return unitsUI;
};


export var displayTurnOrderIcons = function (
    scene, iconHeight, turnOrder, amount, startPos=-40
) {
    var iconList = [];

    // Header
    var icon0 = scene.add.sprite(
        scene.cameras.main.width + startPos,
        32,
        'turnOrderHeader'
    ).setOrigin(0, 0.5);

    var column = new uiWidgets.Column(
        scene, scene.cameras.main.width + startPos, 40,
    );

    for (var i = 0; i < amount; i++) {
        var icon = scene.add.sprite(
            0,
            0,
            turnOrder[i].config.icon
        );

        column.addNode(icon);

        iconList.push(icon);
    }

    return iconList;
}

export function createActionMenu(scene, beastMenu) {
    var xpos = 100;
    var ypos = 160;
    var menuItems = []

    var atkIcon = new uiWidgets.Button(
        scene, xpos, ypos, "actMenu", ()=>{}, this, 0, 0, 0, 0);
    menuItems.push(atkIcon);

    var defIcon = new uiWidgets.Button(
        scene, xpos, ypos, "actMenu", ()=>{}, this, 1, 1, 1, 1);
    defIcon.setFrame(1);
    menuItems.push(defIcon);

    if (!beastMenu) {
        var specIcon = new uiWidgets.Button(
            scene, xpos, ypos, "actMenu", ()=>{}, this, 2, 2, 2, 2);
        specIcon.setFrame(2);
        menuItems.push(specIcon);

        var eatIcon = new uiWidgets.Button(
            scene, xpos, ypos, "actMenu", ()=>{}, this, 3, 3, 3, 3);
        eatIcon.setFrame(3);
        menuItems.push(eatIcon);
    }

    var actionMenu = new uiWidgets.Wheel3D(
        scene,
        {"x": xpos, "y": ypos},
        menuItems,
        0,
        16,
        "y",
        {"x":90, "y": 0, "z": 0},
        { duration: 800, ease: Phaser.Math.Easing.Quadratic.Out }
    );

    actionMenu.activate();

    actionMenu.group.setDepth(999);

    return actionMenu;
}
