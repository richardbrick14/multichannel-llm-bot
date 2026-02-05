/**
 * Message router - validates, rate-limits, calls LLM, returns response
 */
import { createLLMService } from './llm/index.js';
import { createRateLimiter } from './security/rate-limit.js';
import { createValidator } from './security/validation.js';
import type { AppConfig } from './types.js';

export interface RouterDependencies {
  config: AppConfig;
}

export function createRouter(deps: RouterDependencies) {
  const { config } = deps;
  const llm = createLLMService(config.llm);
  const rateLimiter = createRateLimiter(config.security);
  const validator = createValidator(config.security);

  return {
    async handleIncoming(
      channelId: string,
      userId: string,
      chatId: string,
      text: string,
    ): Promise<string> {
      const rateCheck = rateLimiter.check(userId);
      if (!rateCheck.allowed) {
        return rateCheck.reason ?? 'Rate limit exceeded.';
      }

      const validation = validator.validate(text);
      if (!validation.valid) {
        return validation.reason ?? 'Invalid message.';
      }

      const prompt = validation.sanitized ?? text;
      const result = await llm.generate(prompt);

      if (result.error) {
        return `Sorry, I encountered an error: ${result.error}`;
      }

      return result.text || 'I have no response for that.';
    },
  };
}
