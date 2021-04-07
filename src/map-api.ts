import { Color } from "./color";
import { MapItem } from "./map-item";
import { ItemStack } from "bdsx/bds/inventory";
import { getLevelStorage } from "./index";

import Jimp = require("jimp");

export class MapApi {

    //public static createMap() {}

    public static async getImageData(imgPath: string): Promise<Color[][]> {
        let colors: Color[][] = [];
        try {
            const image = await Jimp.read(imgPath);
            image.resize(128, Jimp.AUTO);
            for (let y = 0; y < 128; y++) {
                colors[y] = [];
                for (let x = 0; x < 128; x++) {
                    let pix = Jimp.intToRGBA(image.getPixelColor(x, y));
                    colors[y][x] = new Color(pix.r, pix.g, pix.b, pix.a);
                }
            }
        } catch (exception) {
            console.log(exception);
        }
        return colors;
    }

    public static setMapPixels(itemStack: ItemStack, colors: Color[][], save: boolean = true): void {
        let mapData = MapItem.getMapData(itemStack);
        for(let y = 0; y < colors[0].length; ++y) {
            for(let x = 0; x < colors[1].length; ++x){
                let color = colors[y][x].toABGR();
                mapData.setPixel(color, x, y);
            }
        }
        mapData.setLocked();
        if(save) mapData.save(getLevelStorage());
        mapData.destruct();
    }

    /**
     * @param itemStack - Map item
     * @param image - URL or path to image
     * @param save
     */
    public static async setMapImage(itemStack: ItemStack, image: string, save: boolean = true) {
        let imageData: Color[][] = await this.getImageData(image);
        this.setMapPixels(itemStack, imageData, save);
    }
}