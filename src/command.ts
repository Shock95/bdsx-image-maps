import { command } from "bdsx";
import { IMAGE_PATH } from "./index";
import { MapApi } from "../index";
import { sendMessage, TextFormat } from "./util";
import { Player, PlayerPermission } from "bdsx/bds/player";
import { CommandRawText } from "bdsx/bds/command";
import { CxxString } from "bdsx/nativetype";

const fs = require("fs");

command.register("map", 'Map command').overload((p, origin, output) => {
    const actor = origin.getEntity();
    if(!(actor instanceof Player)) {
        return;
    }
    if(actor.getPermissionLevel() != PlayerPermission.OPERATOR) {
        sendMessage(actor, `${TextFormat.RED}You need operator status to run this command!`);
        return;
    }
    const item = actor.getMainhandSlot();
    if(item.getId() !== 418) {
        sendMessage(actor, `${TextFormat.RED}You must be holding a map in your hand!`);
        return;
    }
    if(p.param1 == "url") {
        if (p.param2 == undefined) {
            sendMessage(actor, `${TextFormat.GREEN}URL not specified`);
            return;
        }
        // @ts-ignore
        MapApi.setMapImage(item, p.param2.text);
        sendMessage(actor, `${TextFormat.GREEN}Setting map image from URL...`);
        return;
    }
    const file = IMAGE_PATH + "/" + p.param1;
    if(!fs.existsSync(file)) {
        sendMessage(actor, `${TextFormat.RED}Could not find specified file`);
        return;
    }
    MapApi.setMapImage(item, file);
    sendMessage(actor, `${TextFormat.GREEN}Setting map image...`);

}, { param1: CxxString, param2: [CommandRawText, true]});