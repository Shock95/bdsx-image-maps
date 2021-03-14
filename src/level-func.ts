import {serverInstance} from "bdsx";
import {MapItemSavedData} from "./map-data";
import {_getLevelStorage, _getMapData, CompoundTag, LevelStorage} from "./index";

export class LevelFunc {

    static getMapData(tag: CompoundTag): MapItemSavedData {
        return _getMapData(serverInstance.minecraft.getLevel(), tag);
    }

    static getLevelStorage(): LevelStorage {
        return _getLevelStorage(serverInstance.minecraft.getLevel());
    }
}