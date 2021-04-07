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

export class LevelStorage extends NativeClass {}

export const IMAGE_PATH = path.join(process.cwd(), '../images');
if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);

pdb.setOptions(SYMOPT_UNDNAME);
const procHacker = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "Level::getLevelStorage",
    "MapItemSavedData::setPixel",
    "MapItemSavedData::setLocked",
    "MapItemSavedData::getParentMapId",
    "MapItemSavedData::save"
]);
pdb.setOptions(0);
const procHackerDec = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z"
]);
pdb.close();

MapItemSavedData.prototype.save = procHacker.js("MapItemSavedData::save", RawTypeId.Void, {this: MapItemSavedData}, LevelStorage);
MapItemSavedData.prototype.setPixel = procHacker.js("MapItemSavedData::setPixel", RawTypeId.Void, {this: MapItemSavedData}, RawTypeId.Int32, RawTypeId.Int32, RawTypeId.Int32);
MapItemSavedData.prototype.setLocked = procHacker.js("MapItemSavedData::setLocked", RawTypeId.Void, {this: MapItemSavedData});
MapItemSavedData.prototype.getMapId = procHacker.js("MapItemSavedData::getParentMapId", RawTypeId.Bin64, {this: MapItemSavedData});

export const _getLevelStorage = procHacker.js("Level::getLevelStorage", LevelStorage, null, Level);
export const getMapData = procHackerDec.js("?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z", MapItemSavedData, null, Level, CompoundTag);


export function getLevel(): Level {
    return serverInstance.minecraft.getLevel();
}

export function getLevelStorage(): LevelStorage {
    return _getLevelStorage(getLevel());
}

bedrockServer.open.on(() => {
    require('./command');
});