/** Get a random item from an array. */
var pickRandomFrom = function(list) {
    var pickedValue = Math.floor(Math.random() * list.length);
    var pick = list[pickedValue];
    return pick;
}

export var safePlayAudio = function(scene, audio) {
    if (!scene.sound.locked) {
        audio.play();
    } else {
        scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {audio.play()});
    }
}

export var arrayTools = {
    pickRandomFrom,
};


// Font Styles
export var menuButtonFontStyle = {
    fontFamily: "eightbitdragon", fill: "#FFF", fontSize:'10px',
};
