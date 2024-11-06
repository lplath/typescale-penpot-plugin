import { Theme } from "@penpot/plugin-types";

export type ThemeChangedMessage = {
    type: string,
    content: Theme
};

export type SelectionChangedMessage = {
    type: string,
    content: boolean
}

export type Message = ThemeChangedMessage | SelectionChangedMessage;

export type GenerateMessageData = {
    scale: number,
    numSmallerFonts: number,
    numLargerFonts: number,
}