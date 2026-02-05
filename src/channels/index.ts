/**
 * Channel registry and factory
 */
import { createTelegramChannel } from './telegram.js';
import type { Channel } from './types.js';
import type { AppConfig } from '../types.js';
import type { createRouter } from '../router.js';

export function createChannels(
  config: AppConfig,
  router: ReturnType<typeof createRouter>,
): Channel[] {
  const channels: Channel[] = [];

  if (config.channels.telegram.enabled) {
    channels.push(
      createTelegramChannel({
        config,
        router,
      }),
    );
  }

  return channels;
}
