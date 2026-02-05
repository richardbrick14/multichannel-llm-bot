/**
 * Shared interfaces for the multi-channel LLM bot
 */

export type LLMProvider = 'openai' | 'anthropic' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  maxTokens: number;
  maxInputTokens: number;
  temperature: number;
}

export interface ChannelConfig {
  enabled: boolean;
}

export interface ChannelsConfig {
  telegram: ChannelConfig;
  whatsapp: ChannelConfig;
  discord: ChannelConfig;
}

export interface SecurityConfig {
  rateLimitPerUser: number;
  rateLimitWindowMs: number;
  maxMessageLength: number;
}

export interface TriggerConfig {
  enabled: boolean;
  pattern: string;
}

export interface AppConfig {
  llm: LLMConfig;
  channels: ChannelsConfig;
  security: SecurityConfig;
  trigger: TriggerConfig;
}

export interface IncomingMessage {
  channelId: string;
  userId: string;
  chatId: string;
  text: string;
}

export interface SendResponseFn {
  (channelId: string, chatId: string, text: string): Promise<void>;
}
