import {Actor} from "bdsx";
import {TextPacket} from "bdsx/bds/packets";

export function sendMessage(actor: Actor, message: string, type: number = 1) {
    let pk: TextPacket = TextPacket.create();
    pk.type = type;
    pk.message = message;
    pk.sendTo(actor.getNetworkIdentifier());
    pk.dispose();
}

export enum TextFormat {
    BLACK = "§0",
    DARK_BLUE = "§1",
    DARK_GREEN = "§2",
    DARK_AQUA = "§3",
    DARK_RED = "§4",
    DARK_PURPLE = "§5",
    GOLD = "§6",
    GRAY = "§7",
    DARK_GRAY = "§8",
    BLUE = "§9",
    GREEN = "§a",
    AQUA = "§b",
    RED = "§c",
    LIGHT_PURPLE = "§d",
    YELLOW = "§e",
    WHITE = "§f",
    MC_GOLD = "§g",
    OBFUSCATED = "§k",
    BOLD = "§l",
    ITALIC = "§o",
    RESET= "§r",
}