import { NativeClass } from "bdsx/nativeclass";
import { ProcHacker } from "bdsx/prochacker";
import { pdb } from "bdsx/core";
import { MapItemSavedData } from "./map-data";
import { Level } from "bdsx/bds/level";
import { CompoundTag } from "bdsx/bds/nbt";
import { events } from "bdsx/event";
import { UNDNAME_NAME_ONLY } from "bdsx/dbghelp";
import { int32_t, void_t } from "bdsx/nativetype";
import { ActorUniqueID } from "bdsx/bds/actor";
import { Player } from "bdsx/bds/player";
import { TextPacket } from "bdsx/bds/packets";
import { serverInstance } from "bdsx/bds/server";

const path = require("path");
const fs = require("fs");

export const IMAGE_PATH = path.join(process.cwd(), '../images');

export class LevelStorage extends NativeClass {}

if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(IMAGE_PATH);

const procHacker = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "Level::getLevelStorage",
    "MapItemSavedData::setPixel",
    "MapItemSavedData::setLocked",
    "MapItemSavedData::getParentMapId",
    "MapItemSavedData::save"
], UNDNAME_NAME_ONLY);

pdb.setOptions(0);
const procHackerDec = ProcHacker.load(path.join(__dirname, '../pdb.ini'), [
    "?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z"
]);
pdb.close();

MapItemSavedData.prototype.save = procHacker.js("MapItemSavedData::save", void_t, {this: MapItemSavedData}, LevelStorage);
MapItemSavedData.prototype.setPixel = procHacker.js("MapItemSavedData::setPixel", void_t, {this: MapItemSavedData}, int32_t, int32_t, int32_t);
MapItemSavedData.prototype.setLocked = procHacker.js("MapItemSavedData::setLocked", void_t, {this: MapItemSavedData});
MapItemSavedData.prototype.getMapId = procHacker.js("MapItemSavedData::getParentMapId", ActorUniqueID, {this: MapItemSavedData});

export const _getLevelStorage = procHacker.js("Level::getLevelStorage", LevelStorage, null, Level);
export const getMapData = procHackerDec.js("?getMapSavedData@Level@@UEAAPEAVMapItemSavedData@@AEBVCompoundTag@@@Z", MapItemSavedData, null, Level, CompoundTag);


export function getLevel(): Level {
    return serverInstance.minecraft.getLevel();
}

export function getLevelStorage(): LevelStorage {
    return _getLevelStorage(getLevel());
}

export function sendMessage(player: Player, message: string, type: TextPacket.Types = 1): void {
    const pk = TextPacket.create();
    pk.type = type;
    pk.message = message;
    player.sendPacket(pk);
    pk.dispose();
}

events.serverOpen.on(() => {
    require('./command');
});