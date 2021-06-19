import { Color } from "./color";
import { MapItem } from "./map-item";
import { ItemStack } from "bdsx/bds/inventory";
import { getLevelStorage } from "./index";

import Jimp = require("jimp");

export class MapApi {

    public static setMapPixels(itemStack: ItemStack, colors: Color[][], save: boolean = true): void {
        const mapData = MapItem.getMapData(itemStack);
        for(let y = 0; y < colors[0].length; ++y) {
            for(let x = 0; x < colors[1].length; ++x){
                let color = colors[y][x].toABGR();
                mapData.setPixel(color, x, y);
            }
        }
        mapData.setLocked();
        if(save) mapData.save(getLevelStorage());
    }

    /**
     * @param itemStack - Map item
     * @param path - URL or path to image
     * @param save
     *
     * @return Promise<boolean>
     */
    public static async setMapImage(itemStack: ItemStack, path: string, save: boolean = true): Promise<boolean> {
        let result = true;
        const image = await Jimp.read(path).catch(e => { result = false; });
        if(image) {
            let colors: Color[][] = [];
            image.resize(128, Jimp.AUTO);

            for (let y = 0; y < 128; y++) {
                colors[y] = [];
                for (let x = 0; x < 128; x++) {
                    let pix = Jimp.intToRGBA(image.getPixelColor(x, y));
                    colors[y][x] = new Color(pix.r, pix.g, pix.b, pix.a);
                }
            }
            this.setMapPixels(itemStack, colors, save);
        }
        return result;
    }
}