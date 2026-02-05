/**
 * LLM Service - provider factory and text generation
 */
import { generateText } from 'ai';

import { createModel } from './providers.js';
import { getGenerateOptions } from './limits.js';
import type { LLMConfig } from '../types.js';

export interface GenerateResult {
  text: string;
  error?: string;
}

export function createLLMService(config: LLMConfig) {
  const model = createModel(config);
  const options = getGenerateOptions(config);

  return {
    async generate(prompt: string): Promise<GenerateResult> {
      try {
        const result = await generateText({
          model,
          prompt,
          maxTokens: options.maxTokens,
          temperature: options.temperature,
        });
        return { text: result.text };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          text: '',
          error: `LLM error: ${message}`,
        };
      }
    },
  };
}
