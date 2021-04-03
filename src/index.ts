import { bedrockServer, RawTypeId, serverInstance } from "bdsx";
import { NativeClass } from "bdsx/nativeclass";
import { ProcHacker } from "bdsx/prochacker";
import { pdb } from "bdsx/core";
import { MapItemSavedData } from "./map-data";
import { SYMOPT_UNDNAME } from "bdsx/common";
import { Level } from "bdsx/bds/level";
import { CompoundTag } from "bdsx/bds/nbt";

const path = require("path");
const fs = require("fs");

export const IMAGE_PATH = path.join(process.cwd(), '../images');
if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);

export class LevelStorage extends NativeClass {}

pdb.setOptions(SYMOPT_UNDNAME);
const hacker = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "Level::getLevelStorage",
    "MapItemSavedData::setPixel",
    "MapItemSavedData::setLocked",
    "MapItemSavedData::getParentMapId",
    "MapItemSavedData::save",
    "?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z"
]);
pdb.setOptions(0);
pdb.close();

MapItemSavedData.prototype.save = hacker.js("MapItemSavedData::save", RawTypeId.Void, {this: MapItemSavedData}, LevelStorage);
MapItemSavedData.prototype.setPixel = hacker.js("MapItemSavedData::setPixel", RawTypeId.Void, {this: MapItemSavedData}, RawTypeId.Int32, RawTypeId.Int32, RawTypeId.Int32);
MapItemSavedData.prototype.setLocked = hacker.js("MapItemSavedData::setLocked", RawTypeId.Void, {this: MapItemSavedData});
MapItemSavedData.prototype.getMapId = hacker.js("MapItemSavedData::getParentMapId", RawTypeId.Bin64, {this: MapItemSavedData});

export const getMapData = hacker.js("?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z", MapItemSavedData, null, Level, CompoundTag);
export const _getLevelStorage = hacker.js("Level::getLevelStorage", LevelStorage, null, Level);

export function getLevel(): Level {
    return serverInstance.minecraft.getLevel();
}

export function getLevelStorage(): LevelStorage {
    return _getLevelStorage(getLevel());
}

bedrockServer.open.on(() => {
    require('./command');
});