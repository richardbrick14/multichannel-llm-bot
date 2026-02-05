/**
 * Token limit enforcement - passed to AI SDK generateText
 */
import type { LLMConfig } from '../types.js';

export interface GenerateOptions {
  maxTokens: number;
  maxInputTokens?: number;
  temperature: number;
}

export function getGenerateOptions(config: LLMConfig): GenerateOptions {
  return {
    maxTokens: config.maxTokens,
    maxInputTokens: config.maxInputTokens,
    temperature: config.temperature,
  };
}
