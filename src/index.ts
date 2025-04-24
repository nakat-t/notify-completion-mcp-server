import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const mcpName = "notify-completion";
const mcpVersion = "1.0.0";

// MCP server instance
const server = new McpServer({
  name: mcpName,
  version: mcpVersion
});

server.tool(
  "hello-world",
  "Hello World",
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "hello world!",
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${mcpName}: MCP server running on stdio`);
}

main().catch((error) => {
  console.error(`${mcpName}: fatal error in main():`, error);
  process.exit(1);
});
