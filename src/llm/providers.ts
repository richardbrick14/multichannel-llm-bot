/**
 * Provider-specific model creation for LLM service
 */
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';

import type { LLMConfig } from '../types.js';

export function createModel(config: LLMConfig) {
  const { provider, model } = config;

  switch (provider) {
    case 'openai': {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openai(model);
    }
    case 'anthropic': {
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      return anthropic(model);
    }
    case 'ollama': {
      return ollama(model);
    }
    default: {
      const exhaustive: never = provider;
      throw new Error(`Unknown LLM provider: ${exhaustive}`);
    }
  }
}
