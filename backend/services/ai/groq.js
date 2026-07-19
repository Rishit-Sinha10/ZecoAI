import Groq from "groq-sdk";

export class GroqProvider {
  constructor(apiKey) {
    this.client = new Groq({ apiKey });
  }

  async chat(messages, { model, temperature, maxTokens } = {}) {
    const res = await this.client.chat.completions.create({
      messages,
      model: model || "llama-3.3-70b-versatile",
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens || 4096,
    });
    return res.choices[0].message.content;
  }

  async *chatStream(messages, { model, temperature, maxTokens } = {}) {
    const stream = await this.client.chat.completions.create({
      messages,
      model: model || "llama-3.3-70b-versatile",
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
