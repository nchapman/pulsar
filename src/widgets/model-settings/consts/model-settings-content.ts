export const modelSettingsContent = {
  maxLength: {
    label: 'Max Tokens',
    description:
      "This sets the upper limit for the number of tokens the model can generate in response. It won't produce more than this limit. The maximum value is the context length minus the prompt length.",
  },
  temp: {
    label: 'Temperature',
    description:
      "This setting influences the variety in the model's responses. Lower values lead to more predictable and typical responses, while higher values encourage more diverse and less common responses. At 0, the model always gives the same response for a given input.",
  },
  topP: {
    label: 'Top P',
    description:
      "This setting limits the model's choices to a percentage of likely tokens: only the top tokens whose probabilities add up to P. A lower value makes the model's responses more predictable, while the default setting allows for a full range of token choices. Think of it like a dynamic Top-K.",
  },
  stopTokens: {
    title: 'Stop sequences',
    description:
      "This setting influences the variety in the model's responses. Lower values lead to more predictable and typical responses, while higher values encourage more diverse and less common responses. At 0, the model always gives the same response for a given input.",
  },
};
