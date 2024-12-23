import { Theme, Text } from "@penpot/plugin-types";
import type { GenerateMessage, PluginMessage } from "./model";

function isTextSelected() {
    return penpot.selection.length == 1 && penpot.utils.types.isText(penpot.selection[0])
}

function createCopy(text: Text, fontSize: number): Text {
    const copy = text.clone() as Text;
    copy.fontSize = fontSize.toString();
    copy.growType = "auto-width";
    return copy;
}

function createTypescale(scale: number, numLarger: number, numSmaller: number) {
    if (penpot.selection.length != 1 || !penpot.utils.types.isText(penpot.selection[0])) {
        throw new Error("Expected to have one textshape selected. Instead, the selection was: " + penpot.selection)
    }

    const selection = penpot.selection[0] as Text;
    const baseFontSize = parseInt(selection.fontSize);
    const baseFontHeight = selection.height;

    const gap = baseFontHeight * 0.25;

    // Smaller
    for (let i = 1; i <= numSmaller; i++) {
        const text = createCopy(selection, baseFontSize / (scale ** i));
        text.x = selection.x;
        // Sum of the heights is h + h / s + h / s ^ 2 + ... + h / s ^ n (Geometric Series with r = 1 / s)
        // => S_n = h * ((1 - 1 / s ^ (n + 1)) / (1 - 1 / s)) and S_(n - 1) = h * ((1 - 1 / s ^ n) / (1 - 1/s))
        text.y = selection.y + i * gap + baseFontHeight * (1 - 1 / scale ** i) / (1 - 1 / scale);
    }

    // Larger
    for (let i = 1; i <= numLarger; i++) {
        const text = createCopy(selection, baseFontSize * (scale ** i));
        text.x = selection.x;
        // Sum of heights S_n = h * ((1 - s ^ (n + 1))/(1 - s)) - h
        text.y = selection.y - i * gap - (baseFontHeight * ((1 - scale ** (i + 1)) / (1 - scale)) - baseFontHeight);
    }

}

function onMessageReceived(data: GenerateMessage) {
    createTypescale(data.scale, data.numLargerFonts, data.numSmallerFonts);
}

function onThemeChanged(theme: Theme) {
    penpot.ui.sendMessage({
        type: "themechanged",
        content: theme,
    } as PluginMessage);
}

function onSelectionChanged() {
    penpot.ui.sendMessage({
        type: "selectionchanged",
        content: isTextSelected()
    } as PluginMessage)
}

penpot.ui.open("Fontscale", `?theme=${penpot.theme}&initialState=${isTextSelected() ? "visible" : "hidden"}`, { width: 280, height: 320 });
penpot.ui.onMessage(onMessageReceived);
penpot.on("selectionchange", onSelectionChanged);
penpot.on("themechange", onThemeChanged);