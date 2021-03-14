import { CANCEL, command, MinecraftPacketIds, nethook } from "bdsx";
import { getCarriedItem, IMAGE_PATH } from "./index";
import { MapApi } from "../index";
import { sendMessage, TextFormat } from "./util";

const fs = require("fs");

command.hook.on((command, origin) => {
    if(command.startsWith("/map")) return 0;
});

nethook.after(MinecraftPacketIds.CommandRequest).on((ev, networkIdentifier) => {
    let command = ev.command;
    let actor = networkIdentifier.getActor();
    if(actor == null) return;

    let args = command.split(/\s+/);
    if(args[0] == "/map") {
        if (args.length <= 1) {
            sendMessage(actor, TextFormat.RED + "Usage: /map <fileName>, /map url <link>");
            return CANCEL;
        }
        let item = getCarriedItem(actor);
        if(item.getId() !== 418) {
            sendMessage(actor, `${TextFormat.RED}You must be holding a map in your hand!`);
            return CANCEL;
        }
        let arg = args[1];
        if(arg == "url") {
            let url = args[2];
            MapApi.setMapImage(item, url);
            sendMessage(actor, `${TextFormat.GREEN}Setting map image from URL...`);
            return CANCEL;
        }
        let file = IMAGE_PATH + "/" + args[1];
        if(!fs.existsSync(file)) {
            sendMessage(actor, `${TextFormat.RED}Could not find specified file`);
            return CANCEL;
        }
        MapApi.setMapImage(item, file);
        sendMessage(actor, `${TextFormat.GREEN}Setting map image...`);
        return CANCEL;
    }
});