/**
 * Multi-Channel LLM Bot - Entry point
 */
import { loadConfig } from './config.js';
import { createRouter } from './router.js';
import { createChannels } from './channels/index.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const router = createRouter({ config });
  const channels = createChannels(config, router);

  if (channels.length === 0) {
    console.error('No channels enabled. Enable at least one channel in config.json.');
    process.exit(1);
  }

  for (const channel of channels) {
    await channel.start();
  }

  const shutdown = async (): Promise<void> => {
    for (const channel of channels) {
      if (channel.stop) {
        await channel.stop();
      }
    }
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
