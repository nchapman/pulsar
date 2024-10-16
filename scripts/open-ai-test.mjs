import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:8083',
  apiKey: 'dummy',
});

const chatCompletion = await openai.chat.completions.create({
  messages: [{ role: 'user', content: 'Say this is a test' }],
  model: 'gpt-4o-mini',
});

console.log(chatCompletion);

