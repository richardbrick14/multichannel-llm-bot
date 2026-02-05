# Multi-Channel LLM Bot

A configurable, secure multi-channel LLM chatbot. Supports Telegram (with WhatsApp and Discord planned), and multiple LLM providers: OpenAI, Anthropic, and Ollama (local).

## Features

- **Multi-LLM**: OpenAI (ChatGPT), Anthropic (Claude), Ollama (local models)
- **Configurable**: JSON config for provider, model, token limits, security
- **Token limits**: Set `maxTokens` and `maxInputTokens` per request
- **Security**: Rate limiting, input validation, message length limits
- **Channels**: Telegram (first), WhatsApp and Discord (architecture ready)

## Requirements

- Node.js 20+
- API key for your chosen LLM provider
- Telegram Bot Token (when using Telegram)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure

Copy the example config and customize:

```bash
cp config.example.json config.json
```

Edit `config.json` to set your LLM provider and model. Example for OpenAI:

```json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "maxTokens": 2048,
    "maxInputTokens": 4096,
    "temperature": 0.7
  },
  "channels": {
    "telegram": { "enabled": true },
    "whatsapp": { "enabled": false },
    "discord": { "enabled": false }
  },
  "security": {
    "rateLimitPerUser": 10,
    "rateLimitWindowMs": 60000,
    "maxMessageLength": 4096
  },
  "trigger": {
    "enabled": true,
    "pattern": "/ask"
  }
}
```

### 3. Set environment variables

```bash
cp .env.example .env
```

Edit `.env` and set:

- **OpenAI**: `OPENAI_API_KEY=sk-...`
- **Anthropic**: `ANTHROPIC_API_KEY=sk-ant-...`
- **Ollama**: No key needed; ensure Ollama is running at `http://localhost:11434`
- **Telegram**: `TELEGRAM_BOT_TOKEN=...` (from [@BotFather](https://t.me/BotFather))

### 4. Create a Telegram bot

1. Open [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the prompts
3. Copy the token and set `TELEGRAM_BOT_TOKEN` in `.env`

### 5. Run

```bash
npm run dev
```

Or build and run:

```bash
npm run build
npm start
```

## Usage

With the default trigger `/ask`, send a message to your bot:

```
/ask What is the capital of France?
```

Or with trigger disabled, every message is processed.

## Configuration Reference

| Field | Description |
|-------|-------------|
| `llm.provider` | `openai`, `anthropic`, or `ollama` |
| `llm.model` | Provider-specific model ID (e.g. `gpt-4o-mini`, `claude-3-5-sonnet-20241022`, `llama3.2`) |
| `llm.maxTokens` | Max output tokens per response |
| `llm.maxInputTokens` | Max input tokens (context window) |
| `llm.temperature` | 0–2, controls randomness |
| `channels.telegram.enabled` | Enable/disable Telegram |
| `security.rateLimitPerUser` | Max requests per user per window |
| `security.rateLimitWindowMs` | Rate limit window in milliseconds |
| `security.maxMessageLength` | Max characters per message |
| `trigger.enabled` | Require trigger prefix |
| `trigger.pattern` | Trigger pattern (e.g. `/ask` or `@botname`) |

## Project Structure

```
src/
├── index.ts           # Entry point
├── config.ts          # Config loader
├── types.ts           # Shared interfaces
├── router.ts          # Message routing, LLM calls
├── llm/               # LLM service
├── channels/          # Channel implementations
└── security/          # Rate limiting, validation
```

## License

MIT
