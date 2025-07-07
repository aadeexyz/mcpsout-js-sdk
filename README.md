# 🦉 MCPScout JS/TS SDK

Catch your MCP breaking before the internet does.

**Zero-to-Logging in just 3 lines of code.**

## ⭐ Features
- Know which tool was called and when
- Measure how long each tool took to run
- Understand why the client called the tool (intent/context)
- See which client (app/user) triggered the call
- Detect failures, timeouts, and weird behavior
- Visualize all of it in a clear, real-time dashboard

## 🚀 Request Early Access

To ensure the highest quality service during our early growth, MCPScout is currently **invite-only**. Request your invite by emailing the creator, **Aadee**, at [mcp@aadee.xyz](mailto:mcp@aadee.xyz?subject=Request%20Access%20to%20MCPScout&body=Hey%20Aadee%2C%0A%0AMy%20name%20is%20[NAME]%20and%20I%27m%20building%20[WHAT%20MCP%20SERVER%20YOU%20ARE%20BUILDING].).

## 📦 Installation

Install the SDK into your existing MCP server:

### npm
```bash
npm i mcpscout
```

### yarn
```bash
yarn add mcpscout
```

### pnpm
```bash
pnpm add mcpscout
```

### bun
```bash
bun add mcpscout
```

## ⚡️ Quick Start

> [!IMPORTANT]
> Make sure you call `scout.track(server)` **after** all your MCP tools are registered, or you’ll miss data.

```typescript
import { MCPScout } from "mcpscout";

const scout = new MCPScout("your-publishable-key");

// Your existing MCP server setup
/*
const mcpServer = new McpServer({
    name: "server",
    version: "1.0.0",
    capabilities: { resources: {}, tools: {} },
});

const transport = new StdioServerTransport();
*/

scout.track(mcpServer);

// await mcpServer.connect(transport);
```

You're all set! 🎉 Events from your MCP server will show up in your [MCPScout dashboard](https://dash.mcpscout.dev).

## 📝 License

MIT © 2025 Aadee

Made with ❤️ by [Aadee](https://x.com/aadeexyz)
