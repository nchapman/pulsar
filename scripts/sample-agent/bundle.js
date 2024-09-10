(() => {
  // agent.js
  async function agent(request, response) {
    console.log("Message history:", request.messageHistory);
    const inputText = request.params.input;
    try {
      const llmResponse = await request.llm.call({
        prompt: inputText,
        temperature: 0.7
      });
      response.emit("text", `The LLM has said: ${llmResponse.text}, this agent doesn't know what to do with it`);
    } catch (error) {
      response.emit("error", `Failed to generate LLM response: ${error.message}`);
    }
  }

  // index.js
  var EventEmitter = class {
    constructor() {
      this.events = {};
    }
    on(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach((listener) => listener(data));
      }
    }
    once(event) {
      return new Promise((resolve) => {
        const listener = (data) => {
          resolve(data);
          this.off(event, listener);
        };
        this.on(event, listener);
      });
    }
    off(event, listenerToRemove) {
      if (!this.events[event])
        return;
      this.events[event] = this.events[event].filter((listener) => listener !== listenerToRemove);
    }
  };
  var eventEmitter = new EventEmitter();
  async function handleMessage(event) {
    await agent({
      messageHistory: event.messageHistory,
      params: {
        input: event.input
      },
      llm: {
        call: async ({ prompt, temperature }) => {
          postMessage({ type: "callLLM", prompt, temperature });
          const llmResponse = await eventEmitter.once("LLMResponse");
          return llmResponse;
        }
      }
    }, {
      emit: (messageType, message) => {
        postMessage({ type: "agentResponse", messageType, agentResponse: message });
      }
    });
  }
  onmessage = async (e) => {
    const event = e.data;
    if (event.type === "message") {
      handleMessage(event);
    }
    if (event.type === "LLMResponse") {
      eventEmitter.emit("LLMResponse", event);
    }
  };
})();
