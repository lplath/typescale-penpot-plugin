import { Theme, Text } from "@penpot/plugin-types";
import { GenerateMessageData, Message } from "./model";


function generateFontsizes(fontSize: number, scale: number, up: number, down: number): number[] {
  let result = [fontSize / scale ** down];
  for (let i = 1; i <= up + down; i++) {
    result[i] = result[i - 1] * scale;
  }

  return result;
}

function createScaleCopyFrom(text: Text, fontSize: number): Text {
  let copy = penpot.createText(text.characters);

  if (copy == null) {
    throw Error("Could not create text");
  }

  copy.fontSize = fontSize.toString();

  copy.growType = text.growType
  copy.fontFamily = text.fontFamily;


  return copy;
}

/**
 * Generate textfields with different font sizes
 * @param scale The amount by which the font-size is scaled each time
 * @param up Number of generated font-sizes larger than the basesize
 * @param down Number of generated font-sizes smaller than the basesize
 */
function createTypescale(scale: number, up: number, down: number) {
  if (penpot.selection.length != 1 || !penpot.utils.types.isText(penpot.selection[0])) {
    console.error("Expected to have one textshape selected. Instead, the selection was: " + penpot.selection);
    return;
  }

  const selection = penpot.selection[0] as Text;


  /*generateFontsizes(parseInt(selection.fontSize), scale, up, down)
    .map((fontSize) => {
      //FIXME: The new text should be removed from the selection
      let text = selection.clone() as Text;
      text.fontSize = fontSize.toString();
      //TODO move
    });*/
}

/**
 * Receives a message from the UI (e.g. a button was pressed)
 */
function onMessageReceived(message: string) {
  console.log("[Message]: " + message);

  if (message.startsWith("generate")) {
    const data: GenerateMessageData = JSON.parse(message.split("-")[1]);
    createTypescale(data.scale, data.numLargerFonts, data.numSmallerFonts);
  }
}

/**
 * Sends a message to the UI that the theme has changed
 */
function onThemeChanged(theme: Theme) {
  penpot.ui.sendMessage({
    type: "themechange",
    content: theme,
  } as Message);
}

/**
 * Sends a message to the UI whenever the selection on the canvas has been changed.
 * The content of the message shows whether a single text-element is selected
 */
function onSelectionChanged() {
  const selection = penpot.selection;
  penpot.ui.sendMessage({
    type: "textselected",
    content: (selection.length == 1 && penpot.utils.types.isText(selection[0]))
  } as Message)
}

penpot.ui.open("Typescale", `?theme=${penpot.theme}`, { width: 260, height: 290 });
penpot.ui.onMessage(onMessageReceived);
penpot.on("selectionchange", onSelectionChanged);
penpot.on("themechange", onThemeChanged);

onSelectionChanged();

