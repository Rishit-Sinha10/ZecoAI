import OpenAI from "openai";

export class OpenAIProvider {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey });
  }

  async chat(messages, { model, temperature, maxTokens } = {}) {
    const res = await this.client.chat.completions.create({
      messages,
      model: model || "gpt-4o",
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens || 4096,
    });
    return res.choices[0].message.content;
  }

  async *chatStream(messages, { model, temperature, maxTokens } = {}) {
    const stream = await this.client.chat.completions.create({
      messages,
      model: model || "gpt-4o",
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens || 4096,
      stream: true,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
