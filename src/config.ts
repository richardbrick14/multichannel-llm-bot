/**
 * Config loader with Zod validation
 */
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

import type { AppConfig } from './types.js';

const LLMProviderSchema = z.enum(['openai', 'anthropic', 'ollama']);

const LLMConfigSchema = z.object({
  provider: LLMProviderSchema,
  model: z.string().min(1),
  maxTokens: z.number().int().min(1).max(128000),
  maxInputTokens: z.number().int().min(1).max(200000),
  temperature: z.number().min(0).max(2),
});

const ChannelConfigSchema = z.object({
  enabled: z.boolean(),
});

const ChannelsConfigSchema = z.object({
  telegram: ChannelConfigSchema,
  whatsapp: ChannelConfigSchema,
  discord: ChannelConfigSchema,
});

const SecurityConfigSchema = z.object({
  rateLimitPerUser: z.number().int().min(1),
  rateLimitWindowMs: z.number().int().min(1000),
  maxMessageLength: z.number().int().min(100).max(100000),
});

const TriggerConfigSchema = z.object({
  enabled: z.boolean(),
  pattern: z.string().min(1),
});

const ConfigSchema = z.object({
  llm: LLMConfigSchema,
  channels: ChannelsConfigSchema,
  security: SecurityConfigSchema,
  trigger: TriggerConfigSchema,
});

export type ConfigSchemaType = z.infer<typeof ConfigSchema>;

function loadConfigFile(): unknown {
  const configPath =
    process.env.CONFIG_PATH || path.resolve(process.cwd(), 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Config file not found at ${configPath}. Copy config.example.json to config.json and customize.`,
    );
  }
  const content = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(content) as unknown;
}

export function loadConfig(): AppConfig {
  const raw = loadConfigFile();
  const result = ConfigSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Invalid config:\n${errors}`);
  }
  return result.data as AppConfig;
}
