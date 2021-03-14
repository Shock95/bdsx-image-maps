import {RawTypeId} from "bdsx";
import {NativeClass} from "bdsx/nativeclass";
import {ProcHacker} from "bdsx/prochacker";
import {pdb} from "bdsx/core";
import {MapItemSavedData} from "./map-data";
import {SYMOPT_UNDNAME} from "bdsx/common";
import {Level} from "bdsx/bds/level";
import {ItemStack} from "bdsx/bds/inventory";
import {Player} from "bdsx/bds/player";
import "./command";

const path = require("path");
const fs = require("fs");

export const IMAGE_PATH = path.join(process.cwd(), '../images');
if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);

export class CompoundTag extends NativeClass {}
export class LevelStorage extends NativeClass {}

pdb.setOptions(SYMOPT_UNDNAME);
const hacker = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "Player::getCarriedItem",
    "ItemStackBase::getUserData",
    "Level::getLevelStorage",
    "MapItemSavedData::setPixel",
    "MapItemSavedData::setLocked",
    "MapItemSavedData::getParentMapId",
    "MapItemSavedData::save",
    "?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z"
]);
pdb.setOptions(0);
pdb.close();

export const getCarriedItem = hacker.js("Player::getCarriedItem", ItemStack, null, Player);
export const _getItemTag = hacker.js("ItemStackBase::getUserData", CompoundTag, null, ItemStack);

MapItemSavedData.prototype.setPixel = hacker.js("MapItemSavedData::setPixel", RawTypeId.Void, {this: MapItemSavedData}, RawTypeId.Int32, RawTypeId.Int32, RawTypeId.Int32);
MapItemSavedData.prototype.setLocked = hacker.js("MapItemSavedData::setLocked", RawTypeId.Void, {this: MapItemSavedData});
MapItemSavedData.prototype.save = hacker.js("MapItemSavedData::save", RawTypeId.Void, {this: MapItemSavedData}, LevelStorage);
MapItemSavedData.prototype.getMapId = hacker.js("MapItemSavedData::getParentMapId", RawTypeId.Bin64, {this: MapItemSavedData});

// Level functions
export const _getMapData = hacker.js("?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z", MapItemSavedData, null, Level, CompoundTag);
export const _getLevelStorage = hacker.js("Level::getLevelStorage", LevelStorage, null, Level);

