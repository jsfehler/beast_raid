import { createNinePatchTexture } from "./nine_patch.js";


export class BeastViewport extends uiWidgets.Viewport {
    get realHeight() {
        return this.getBounds().height;
    }
}


// Scrollbar with Ninepatch on the bar
export class BeastScrollbar extends uiWidgets.Scrollbar {
    createBar() {
        // Create ninepatch for bar
        const height = this.track.height * this.valueRange.ratio;

        const newTextureKey = createNinePatchTexture(
            this.game,
            4,
            height,
            this.barKey,
            [1, undefined, 1],
            [2, undefined, 2],
            0,
        )

        const bar = new uiWidgets.Button(
            this.game,
            this.x,
            this.y,
            newTextureKey,
            this.moveContent,
            this,
            1,
            0,
        );

        bar.displayOriginX = 0;
        bar.displayOriginY = 0;

        this.bar = bar;

        return bar;

    }
}
