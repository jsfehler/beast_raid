export class BattleActor {
    constructor(config) {
        this.config = config.baseConfig;
        this.newConfig = config.config;

        this.name = this.config.name;

        this.hp = this.config.hp;

        if (config["config"]) {
            this.hp = this.newConfig.player.maxHp;
        }

        this.baseMaxHp = this.hp;

        // Current Clock Time. Unit with CT over 100 gets a turn.
        this.ct = 0;

        // Current Test Clock Time (For turn order estimation).
        this.testCT = 0;

        // Used during testCT calculations.
        this.amountOfTicksTo100 = 0;

        this.hpMod = 1;
        this.speedMod = 1;

    }

    get maxHp() {
        return this.baseMaxHp * this.hpMod;
    }

    // Current speed.
    get speed() {
        return this.config.speed * this.speedMod;
    }

}
