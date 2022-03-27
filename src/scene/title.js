import { menuButtonFontStyle } from "../utils.js";
import { loadData } from "../saveLoad.js";


export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create (data) {
        this.defaultWorldData = data.defaultWorldData;
        this.worldData = loadData("beastRaid", 0);

        // Switch slot number if saveData detected
        this.ngSlotNum = 0;
        if (Object.keys(this.worldData).length !== 0) {
            this.ngSlotNum = 1;
        }

        var titleLogo = this.add.sprite(0, 0, "titleLogo");
        titleLogo.setOrigin(0, 0);

        this.creditsText = this.add.text(
            256 - 55, 240 - 30, "Credits:\njsfehler", menuButtonFontStyle,
        );
        this.creditsText.setResolution(12);

        this.newGameButton = new uiWidgets.TextButton(this, 256/2, 200 - 20, "tableRow", ()=>{});
        this.newGameButton.setText("New Game", menuButtonFontStyle);
        this.newGameButton.text.setResolution(12);
        this.newGameButton.sprite.on(
            'pointerdown', (pointer) => {
                this.gameStart();
            }
        );

        if (Object.keys(this.worldData).length !== 0) {
            this.continueButton = new uiWidgets.TextButton(
                this, 256/2, 200 + 14, "tableRow", ()=>{},
            );
            this.continueButton.setText("Continue Game", menuButtonFontStyle);
            this.continueButton.text.setResolution(12);
            this.continueButton.sprite.on(
                'pointerdown', (pointer) => {
                    this.continueGame();
                }
            );
        }

    }

    gameStart() {
        this.scene.start(
            "PlatformerScene", {data: this.defaultWorldData, slotNum: this.ngSlotNum},
        );
    }

    continueGame() {
        this.scene.start("PlatformerScene", {data: this.worldData, slotNum: 0});
    }

};
