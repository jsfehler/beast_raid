export var createNinePatchTexture = function(
    scene, width, height, textureKey, columns, rows, baseFrame,
) {
    const r = scene.add.rexNinePatch(
        0,
        0,
        width,
        height,
        textureKey,
        baseFrame,
        columns,
        rows,
    );

    const newTextureKey = `9_${textureKey}`;
    r.saveTexture(newTextureKey);
    r.destroy();

    return newTextureKey;
}


export class NinePatchSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureKey, config) {
        let width = config.width;
        let height = config.height;
        let columns = config.columns;
        let rows = config.rows;

        let nineTextureKey = createNinePatchTexture(
            scene, width, height, textureKey, columns, rows,
        );

        super(scene, x, y, nineTextureKey);
        scene.add.existing(this);
    }
}
