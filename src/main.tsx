import { render } from "preact";
import App from "./App";
import "./styles.css";
import Llamafile from "./llamafile";

// Start the llamafile server
new Llamafile().spawn();

render(<App />, document.getElementById("root")!);
