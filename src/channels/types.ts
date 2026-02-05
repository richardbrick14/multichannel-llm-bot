/**
 * Channel interface for pluggable messaging channels
 */
export interface Channel {
  name: string;
  start(): Promise<void>;
  stop?(): Promise<void>;
}

export interface ChannelContext {
  channelId: string;
  userId: string;
  chatId: string;
}
