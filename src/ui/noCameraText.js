// Text that will ignore the camera.
export var noCameraText = function(scene, x, y, text, style, resolution=12) {
    let sprite = scene.add.text(x, y, text, style);

    sprite.setScrollFactor(0, 0);
    sprite.setResolution(resolution);

    return sprite;
}
