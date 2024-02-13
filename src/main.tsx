import { render } from "preact";
import App from "./app/App";
import "./shared/styles/styles.css";
import Llamafile from "./llamafile";

// Start the llamafile server
new Llamafile().spawn();

render(<App />, document.getElementById("root")!);
