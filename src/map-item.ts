import { ItemStack } from "bdsx/bds/inventory";
import { MapItemSavedData } from "./map-data";
import {_getItemTag, CompoundTag} from ".";
import { abstract } from "bdsx/common";
import {LevelFunc} from "./level-func";
import {nativeClass} from "bdsx/nativeclass";

export class MapItem  {

    static getItemTag(itemStack: ItemStack): CompoundTag {
        return _getItemTag(itemStack);
    }

    static getMapData(itemStack: ItemStack): MapItemSavedData {
        return LevelFunc.getMapData(this.getItemTag(itemStack));
    }
}