import { safePlayAudio } from "../utils.js";


export var conditionTargetHPLowerThan = function (user, targets) {
    let percentage = 0.20;

    for (const [key, value] of Object.entries(targets)) {
        let target = targets[key];

        if ((target.hp <= (target.maxHp * percentage)) && target.hp >= 0) {
            return true;
        }
    }

    return false;

}


// Heal to 50%
export var healBattleRule = {
    targets: 'self',
    condition: conditionTargetHPLowerThan,
    action: (scene, user, targets) => {
        var target = targets[0];

        // Play SFX
        let sfx = scene.sound.add("sfxHeal");
        safePlayAudio(scene, sfx);

        target.ui.hp.adjustBar((target.maxHp/2) - target.hp);
        target.hp = target.maxHp / 2;
    },
    message: (user, targets) => {
        return `You can't win this battle with combat!`;
    },
}


export var defaultBattleRule = {
    targets: 'enemy',
    condition: (user, targets) => {return true},
    action: (scene, user, targets) => {
        var target = targets[0];

        // Play SFX
        let sfx = scene.sound.add("sfxSlash");
        safePlayAudio(scene, sfx);

        target.hp -= 10;
        target.ui.hp.adjustBar(-10);
    },
    message: (user, targets) => {
        return `${user.name} attacks ${targets[0].name}`;
    }
}
