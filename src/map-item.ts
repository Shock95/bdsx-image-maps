import { ItemStack } from "bdsx/bds/inventory";
import { MapItemSavedData } from "./map-data";
import { getLevel, getMapData } from "./index";

export class MapItem {

    static getMapData(itemStack: ItemStack): MapItemSavedData {
        return getMapData(getLevel(), itemStack.getUserData());
    }
}