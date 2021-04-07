import { NativeClass } from "bdsx/nativeclass";
import { abstract } from "bdsx/common";
import { LevelStorage } from ".";
import { ActorUniqueID } from "bdsx/bds/actor";

export class MapItemSavedData extends NativeClass {

    setPixel(color: number, x: number, y: number): void {
        return abstract();
    }

    setLocked(): void {
        return abstract();
    }

    getMapId(): ActorUniqueID {
        return abstract();
    }

    save(storage: LevelStorage): void {
        return abstract();
    }
}