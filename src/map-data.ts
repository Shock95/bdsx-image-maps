import { NativeClass } from "bdsx/nativeclass";
import { abstract } from "bdsx/common";

import {  LevelStorage } from ".";
import {ActorUniqueID} from "bdsx/bds/actor";

export class MapItemSavedData extends NativeClass {

    setPixel(color: number, x: number, y: number): void {
        abstract();
    }

    setLocked(): void {
        abstract();
    }

    getMapId(): ActorUniqueID {
        abstract();
    }

    save(storage: LevelStorage): void {
        abstract();
    }
}