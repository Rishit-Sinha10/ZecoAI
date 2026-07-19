import Anthropic from "@anthropic-ai/sdk";

export class AnthropicProvider {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
  }

  async chat(messages, { model, temperature, maxTokens } = {}) {
    const systemMsg = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const res = await this.client.messages.create({
      model: model || "claude-sonnet-4-20250514",
      max_tokens: maxTokens || 4096,
      temperature: temperature ?? 0.7,
      system: systemMsg?.content || undefined,
      messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
    });
    return res.content[0].text;
  }

  async *chatStream(messages, { model, temperature, maxTokens } = {}) {
    const systemMsg = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const stream = this.client.messages.stream({
      model: model || "claude-sonnet-4-20250514",
      max_tokens: maxTokens || 4096,
      temperature: temperature ?? 0.7,
      system: systemMsg?.content || undefined,
      messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta?.text) {
        yield event.delta.text;
      }
    }
  }
}
