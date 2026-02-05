/**
 * Input sanitization and validation
 */
import type { SecurityConfig } from '../types.js';

export function createValidator(config: SecurityConfig) {
  const { maxMessageLength } = config;

  return {
    validate(text: string): { valid: boolean; sanitized?: string; reason?: string } {
      const trimmed = text.trim();
      if (!trimmed) {
        return { valid: false, reason: 'Message cannot be empty.' };
      }
      if (trimmed.length > maxMessageLength) {
        return {
          valid: true,
          sanitized: trimmed.slice(0, maxMessageLength),
          reason: `Message truncated to ${maxMessageLength} characters.`,
        };
      }
      return { valid: true, sanitized: trimmed };
    },
  };
}
