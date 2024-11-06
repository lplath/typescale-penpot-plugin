import { Theme, Text } from "@penpot/plugin-types";
import { GenerateMessageData, Message } from "./model";


function createScaleCopyFrom(text: Text, fontSize: number): Text {
  let copy = penpot.createText(text.characters);

  if (copy == null) {
    throw Error("Could not create text");
  }

  copy.fontSize = fontSize.toString();

  copy.growType = text.growType
  copy.fontFamily = text.fontFamily;
  copy.fontWeight = text.fontWeight;
  copy.fontStyle = text.fontStyle;
  copy.lineHeight = text.lineHeight;
  copy.letterSpacing = text.letterSpacing;
  copy.textTransform = text.textTransform;
  copy.textDecoration = text.textDecoration;
  copy.direction = text.direction;
  copy.align = text.align;

  return copy;
}

/**
 * Generate textfields with different font sizes
 * @param scale The amount by which the font-size is scaled each time
 * @param numLarger Number of generated font-sizes larger than the basesize
 * @param numSmaller Number of generated font-sizes smaller than the basesize
 */
function createTypescale(scale: number, numLarger: number, numSmaller: number) {
  if (penpot.selection.length != 1 || !penpot.utils.types.isText(penpot.selection[0])) {
    console.error("Expected to have one textshape selected. Instead, the selection was: " + penpot.selection);
    return;
  }

  const selection = penpot.selection[0] as Text;
  const baseFontSize = parseInt(selection.fontSize);

  // TODO: Adjust
  const gap = selection.height * 1.5;


  for (let i = 1, y = selection.y; i <= numSmaller; i++) {
    const text = createScaleCopyFrom(selection, baseFontSize / (scale ** i));
    text.x = selection.x;
    text.y = y + text.height + gap;
    y = text.y;
  }


  for (let i = 1, y = selection.y; i <= numLarger; i++) {
    const text = createScaleCopyFrom(selection, baseFontSize * (scale ** i));
    text.x = selection.x;
    text.y = y - text.height - gap;
    y = text.y;
  }

}

/**
 * Receives a message from the UI (e.g. a button was pressed)
 */
function onMessageReceived(message: string) {

  if (message.startsWith("generate")) {
    const data: GenerateMessageData = JSON.parse(message.split("-")[1]);
    createTypescale(data.scale, data.numLargerFonts, data.numSmallerFonts);
  }

  // Manually trigger a 'selectionchange' event
  else if (message == "checkSelection") {
    onSelectionChanged();
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

penpot.ui.open("Typescale", `?theme=${penpot.theme}`, { width: 280, height: 270 });
penpot.ui.onMessage(onMessageReceived);
penpot.on("selectionchange", onSelectionChanged);
penpot.on("themechange", onThemeChanged);

