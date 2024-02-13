import { useState } from "preact/hooks";
import preactLogo from "@/shared/assets/preact.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import OpenAI from "openai";

function App() {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  async function send() {
    // Reset output
    setOutput("");

    const openai = new OpenAI({
      baseURL: "http://127.0.0.1:52514/v1",
      apiKey: "none",
      dangerouslyAllowBrowser: true,
    });

    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are Pulsar, a friendly chatbot. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.",
        },
        { role: "user", content: input },
      ],
      model: "LLaMA_CPP",
      stream: true,
    });

    for await (const chunk of stream) {
      setOutput(
        (prevOutput) => prevOutput + (chunk.choices[0]?.delta?.content || "")
      );
    }
  }

  return (
    <div class="container">
      <h1>Welcome to Pulsar!</h1>

      <p>Look at these cool technology logos. We're using these things.</p>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>

      <p>This is a Tauri app with llamafile running as a sidecar.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          id="greet-input"
          onInput={(e) => setInput(e.currentTarget.value)}
          placeholder="Say something..."
          autoCorrect={"off"}
        />
        <button type="submit">Send</button>
      </form>

      <p>{output}</p>
    </div>
  );
}

export default App;
