import OpenAI from 'openai';
import { useState } from 'preact/hooks';
import { createEvent, createStore, combine } from 'effector';
import { useUnit } from 'effector-react';
import PreactLogo from '@/shared/assets/preact.svg';
import s from './App.module.scss';

const plus = createEvent();

const $counter = createStore(1);

const $counterText = $counter.map((count) => `current value = ${count}`);
const $counterCombined = combine({ counter: $counter, text: $counterText });

$counter.on(plus, (count) => count + 1);

function App() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');

  const counter = useUnit($counter);
  const counterText = useUnit($counterText);
  const counterCombined = useUnit($counterCombined);

  async function send() {
    // Reset output
    setOutput('');

    const openai = new OpenAI({
      baseURL: 'http://127.0.0.1:52514/v1',
      apiKey: 'none',
      dangerouslyAllowBrowser: true,
    });

    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are Pulsar, a friendly chatbot. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.',
        },
        { role: 'user', content: input },
      ],
      model: 'LLaMA_CPP',
      stream: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      setOutput((prevOutput) => prevOutput + (chunk.choices[0]?.delta?.content || ''));
    }
  }

  const text = "Look at these cool technology logos. We're using these things.";

  return (
    <div className="container">
      <div>
        <button type="button" onClick={() => plus()}>
          Plus
        </button>
        <div>counter: {counter}</div>
        <div>counterText: ${counterText}</div>
        <div>
          counterCombined: {counterCombined.counter}, {counterCombined.text}
        </div>
      </div>
      <h1>Welcome to Pulsar!</h1>

      <p className={s.broDc}>{text}</p>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noreferrer">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <img src={PreactLogo} alt="de" />
      </div>

      <p>This is a Tauri app with llamafile running as a sidecar.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          id="greet-input"
          onInput={(e) => setInput(e.currentTarget.value)}
          placeholder="Say something..."
          autoCorrect="off"
        />
        <button type="submit">Send</button>
      </form>

      <p>{output}</p>
    </div>
  );
}

export default App;
