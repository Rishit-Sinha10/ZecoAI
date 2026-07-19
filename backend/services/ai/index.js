import { GroqProvider } from "./groq.js";

let instance = null;

export async function getAIProvider() {
  if (instance) return instance;

  const provider = (process.env.AI_PROVIDER || "groq").toLowerCase();

  switch (provider) {
    case "openai": {
      const { OpenAIProvider } = await import("./openai.js");
      instance = new OpenAIProvider(process.env.OPENAI_API_KEY);
      break;
    }
    case "anthropic":
    case "claude": {
      const { AnthropicProvider } = await import("./anthropic.js");
      instance = new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
      break;
    }
    case "groq":
    default: {
      instance = new GroqProvider(process.env.GROQ_API_KEY);
      break;
    }
  }

  return instance;
}

export function resetAIProvider() {
  instance = null;
}
