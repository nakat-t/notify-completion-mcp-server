#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { appendFile } from "fs";

const mcpName = "notify-completion";
const mcpVersion = "1.0.0";

function debugLog(message?: any, ...optionalParams: any[]) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${optionalParams.join(" ")}`;

  if (process.env.DEBUG) {
    console.error(logMessage);

    if (process.env.DEBUG_OUTPUT_FILE) {
      appendFile(process.env.DEBUG_OUTPUT_FILE, `${logMessage}\n`, (err: any) => {
        if (err) {
          console.error(`error: failed to write debug output in ${process.env.DEBUG_OUTPUT_FILE}: `, err);
        }
      });
    }
  }
}

// MCP server instance
const server = new McpServer({
  name: mcpName,
  version: mcpVersion
});

server.tool(
  "start-timer",
  "Start a timer to measure task execution time",
  async () => {
    const toolName = "start-timer";
    debugLog(`${toolName}: tool called`);

    const startTime = new Date().toISOString();
    const response = `{"startTime": "${startTime}"}`;
    debugLog(`${toolName}: response: ${response}`);

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  },
);

const defaultThreshold = 0; // Default threshold in seconds
const defaultOverdueCommand = 'echo -e "\\a"'; // Default command to execute when overdue

server.tool(
  "check-overdue",
  "Check if the task is overdue based on the given threshold",
  {
    startTime: z.string().datetime({ offset: true }).describe("Start time returned by start-timer")
  },
  async ({ startTime }) => {
    const toolName = "start-timer";
    debugLog(`${toolName}: tool called: startTime=${startTime}`);

    const startDate = new Date(startTime);
    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const elapsedSeconds = Math.floor(elapsedTime / 1000);
  
    const threshold = parseInt(process.env.THRESHOLD || `${defaultThreshold}`, 10);
    const isOverdue = elapsedSeconds >= threshold;
    debugLog(`${toolName}: elapsed=${elapsedSeconds}, threshold=${threshold}`);

    var response = `{"elapsed": "${elapsedSeconds}", "units": "seconds"`;
    if (isOverdue) {
      debugLog(`${toolName}: task is overdue`);
      const overdueCommand = JSON.stringify(process.env.OVERDUE_COMMAND || defaultOverdueCommand);
      response += `, "overdue": true, "command": ${overdueCommand}`;
    }
    else {
      debugLog(`${toolName}: task is not overdue`);
      response += `, "overdue": false`;
    }
    response += "}";
    debugLog(`${toolName}: response: ${response}`);
    return {
      content: [
        {
          type: "text",
          text: response,
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
