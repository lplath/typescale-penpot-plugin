/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";

// Setup theme support
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found.");
}


render(() => <App />, root!);
