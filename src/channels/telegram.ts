/**
 * Telegram channel implementation using Telegraf
 */
import { Telegraf } from 'telegraf';

import type { Channel } from './types.js';
import type { AppConfig } from '../types.js';
import type { RouterDependencies } from '../router.js';

export interface TelegramChannelDeps {
  config: AppConfig;
  router: ReturnType<typeof import('../router.js').createRouter>;
}

function matchesTrigger(text: string, pattern: string): boolean {
  const trimmed = text.trim();
  if (pattern.startsWith('/')) {
    return trimmed.startsWith(pattern) || trimmed === pattern;
  }
  return trimmed.toLowerCase().startsWith(pattern.toLowerCase());
}

function extractMessage(text: string, pattern: string): string {
  const trimmed = text.trim();
  if (pattern.startsWith('/')) {
    const afterCommand = trimmed.slice(pattern.length).trim();
    return afterCommand || trimmed;
  }
  return trimmed.slice(pattern.length).trim() || trimmed;
}

export function createTelegramChannel(deps: TelegramChannelDeps): Channel {
  const { config, router } = deps;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is required when Telegram channel is enabled.');
  }

  const bot = new Telegraf(token);
  const triggerConfig = config.trigger;
  const pattern = triggerConfig.pattern;

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (!text) return;

    const shouldProcess = triggerConfig.enabled
      ? matchesTrigger(text, pattern)
      : true;

    if (!shouldProcess) return;

    const messageToSend = triggerConfig.enabled
      ? extractMessage(text, pattern)
      : text;

    if (!messageToSend) {
      await ctx.reply('Please provide a message after the trigger.');
      return;
    }

    const userId = String(ctx.from?.id ?? 'unknown');
    const chatId = String(ctx.chat?.id ?? '');

    try {
      const response = await router.handleIncoming(
        'telegram',
        userId,
        chatId,
        messageToSend,
      );
      await ctx.reply(response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await ctx.reply(`Error: ${msg}`);
    }
  });

  return {
    name: 'telegram',
    async start() {
      await bot.launch();
      console.log('Telegram channel started');
    },
    async stop() {
      bot.stop('SIGTERM');
    },
  };
}
