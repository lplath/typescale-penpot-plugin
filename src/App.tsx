import { createSignal, For, onCleanup, onMount, Show, type Component } from 'solid-js';
import { GenerateMessageData, Message, SelectionChangedMessage, ThemeChangedMessage } from './model';

import "./App.css"


const App: Component = () => {

  /**
   * @see https://www.howmusicreallyworks.com/chapter-four-scales-intervals/interval-ratios-chart.html
   */
  const scales = [
    { value: 16 / 15, name: "Minor Second" },
    { value: 9 / 8, name: "Major Second" },
    { value: 6 / 5, name: "Minor Third" },
    { value: 5 / 4, name: "Major Third" },
    { value: 4 / 3, name: "Perfect Fourth" },
    { value: 45 / 32, name: "Augmented Fourth" },
    { value: 3 / 2, name: "Perfect Fifth" },
    { value: 5 / 3, name: "Minor Sixth" },
    { value: (1 + Math.sqrt(5)) / 2, name: "Golden Ratio" },
    { value: 9 / 5, name: "Major Sixth" },
    { value: 15 / 8, name: "inor Seventh" },
    { value: 2, name: "Octave" },
    { value: Math.E, name: "Euler's number" },
  ]

  const [isUiVisible, setIsUiVisible] = createSignal(false);
  const [selectedScaleIndex, setSelectedScaleIndex] = createSignal(0);
  const [numSmallerFonts, setNumSmallerFonts] = createSignal(2);
  const [numLargerFonts, setNumLargerFonts] = createSignal(4);

  function onGenerateScales() {
    const data: GenerateMessageData = {
      scale: scales[selectedScaleIndex()].value,
      numLargerFonts: numLargerFonts(),
      numSmallerFonts: numSmallerFonts()
    }

    parent.postMessage(`generate-${JSON.stringify(data)}`, '*')
  }

  /**
   * Listen to messages from the core-plugin
   */
  function onPluginMessage(event: MessageEvent<Message>) {
    if (event.data.type == "themechange") {
      const message = event.data as ThemeChangedMessage;

      document.body.dataset.theme = message.content
    }
    else if (event.data.type == "textselected") {
      const message = event.data as SelectionChangedMessage
      // Only show the UI when one text-object is selected
      setIsUiVisible(message.content)
    }
  }

  onMount(() => {
    window.addEventListener("message", onPluginMessage);
  });

  onCleanup(() => {
    window.removeEventListener("message", onPluginMessage);
  })


  return (
    <Show when={isUiVisible()} fallback={<p class="body-m">Select a textbox with a base font</p>}>
      <div class="ui">
        <div class="scale-options">
          <label class="select-label-hidden" for="ratio">Scale</label>
          <select class="select"
            onInput={(event) => setSelectedScaleIndex(parseInt(event.target.value))}
          >
            <For each={scales}>
              {(scale, index) => <option value={index()}>{scale.value.toFixed(3)}  -  {scale.name}</option>}
            </For>
          </select>
        </div>

        <div class="range-options">
          <div>
            <label class="caption" for="up">Up</label>
            <input class="input" type="number" placeholder="Up" min="0"
              value={numSmallerFonts()}
              onInput={(event) => setNumSmallerFonts(parseInt(event.target.value))}>
            </input>
          </div>
          <div>
            <label class="caption" for="down">Down</label>
            <input class="input" type="number" placeholder="Down" min="0"
              value={numLargerFonts()}
              onInput={(event) => setNumLargerFonts(parseInt(event.target.value))}>
            </input>
          </div>
        </div>

        <button type="button" data-appearance="primary" onClick={onGenerateScales}>
          Generate
        </button>
      </div>
    </Show>
  );
};

export default App;
