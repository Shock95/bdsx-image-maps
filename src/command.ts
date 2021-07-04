import { IMAGE_PATH, sendMessage } from "./index";
import { MapApi } from "../index";
import { Player } from "bdsx/bds/player";
import { CommandPermissionLevel, CommandRawText } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString } from "bdsx/nativetype";

const fs = require("fs");
const path = require("path");

command.register("map", "Map command", CommandPermissionLevel.Operator).overload(async(p, origin, output) => {
    const actor = origin.getEntity();
    if(!(actor instanceof Player)) return;

    const item = actor.getMainhandSlot();
    if(item.getName() !== "minecraft:filled_map") {
        return sendMessage(actor, "§cError: You must be holding a Filled Map item in your hand!");
    }
    if(p.param1 == "url") {
        if (p.param2 == undefined) {
            return sendMessage(actor, "§cError: URL not specified");
        }
        sendMessage(actor, "§aSetting map image from URL...");

        // @ts-ignore
        const result = await MapApi.setMapImage(item, p.param2.text);
        return sendMessage(actor, result ? "§aImage has been set successfully!" : "§cError: Failed to read image from URL.");
    }
    const file = path.join(IMAGE_PATH, p.param1);
    if(!fs.existsSync(file)) {
        return sendMessage(actor, `§cError: Could not find file ${p.param1}`);
    }
    sendMessage(actor, "§aSetting map image...");

    const result = await MapApi.setMapImage(item, file);
    sendMessage(actor, result ? "§aImage has been set successfully!" : `§cError: Failed to read image ${p.param1}`);

}, { param1: CxxString, param2: [CommandRawText, true]});