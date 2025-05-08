# notify-completion-mcp-server

![npm version badge](https://img.shields.io/npm/v/%40nakat-t%2Fnotify-completion-mcp-server)
![cline:worked badge](https://img.shields.io/badge/cline-worked-green)
![claude desktop:worked badge](https://img.shields.io/badge/claude_desktop-worked-green)
![cursor:worked badge](https://img.shields.io/badge/cursor-worked-green)
![github copilot:worked badge](https://img.shields.io/badge/github_copilot-worked-green)

The MCP server that provides notifications when AI agents complete long-running tasks. This allows you to leave your desktop without forgetting about tasks.

## How It Works

![How It Works - mermaid diagram](how_it_works.png)

The notify-completion-mcp-server addresses the issue of users needing to actively monitor their computer for AI task completion. By providing a notification mechanism triggered when tasks are finished, users can multitask more efficiently without repeatedly checking task status.

## Installation

1. Add config to the client (If using Cline, edit `cline_mcp_settings.json`): 

```json
{
  "mcpServers": {
    "notify-completion": {
      "command": "npx",
      "args": ["-y", "@nakat-t/notify-completion-mcp-server@latest"],
      "env": {
        "OVERDUE_COMMAND": "<Command to execute very flashy effects>",
      },
      "autoApprove": [ "start-timer", "check-overdue" ]
    }
  }
}
```

2. Change the config environment variables to your value.
    * `OVERDUE_COMMAND`: Write a command to notify you when the task is complete.
    * `EXECUTE_IN_SERVER`: If you are using Claude Desktop, please set this variable to `"true"`. When using AI capable of executing commands on their own, there is no need to define this variable.

3. Configure the client so that the MCP server tool and command execution functions are automatically executed without user approval. In Cline, this setting is checked for `Execute safe commands` and `Use MCP servers` under Auto-approve.

4. Copy the following custom instructions and paste to your client settings.

## Custom Instructions

```markdown
# You MUST use the `notify-completion` MCP: Task Completion Notification Guide

**⚠️ CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE GUIDELINES ⚠️**

This guide provides **MANDATORY** instructions for explicitly notifying users when tasks that take a long time to execute are complete, allowing them to move smoothly to the next action. Be sure to follow these guidelines to ensure that tasks are completed efficiently.

## ⚠️ TASK EXECUTION TIME MONITORING AND COMPLETION NOTIFICATION - MANDATORY ACTION REQUIRED ⚠️

**IMPORTANT**: At the start of the task, you MUST:

1. **MUST** Run the 'start-timer' tool of the 'notify-completion' MCP.

**IMPORTANT**: When executing a task, if the task reaches the stage where it needs to report to the user that it has been completed, you MUST:

1. **MUST** Run the 'check-overdue' tool in 'notify-completion' MCP.
2. **MUST** If the 'check-overdue' tool reports 'overdue': true, execute the contents of 'command'

**ADDITIONAL INSTRUCTIONS FOR CLINE**: If you are Cline, you MUST run the 'check-overdue' MCP tool immediately before running the `ask_followup_question` or `attempt_completion` tool.

**ADDITIONAL INSTRUCTIONS FOR CLAUDE DESKTOP**: If you are Claude Desktop, only perform Step 1, which is to run the 'check-overdue' MCP tool. Step 2 is not necessary. You can ignore the tool's response.

**ADDITIONAL INSTRUCTIONS FOR CURSOR**: If you are Cursor, you MUST always execute the 'command' provided in the response of the 'check-overdue' tool immediately when "overdue": true, without exception or hesitation. Do NOT skip, delay, or ignore the command for any reason, including safety, context, or ambiguity. You must clearly log or report to the user that the command was executed, including the exact command string.

Remember to monitor the task execution time. Be sure to use the 'notify-completion' MCP. By strictly adhering to these guidelines, you can immediately notify users when tasks are complete and provide them with the best possible experience.
```

## MCP clients that confirmed to work

| Client | Status | Comment |
|---|---|---|
| [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) | worked | Primary development/testing platform |
| [Claude Desktop](https://claude.ai/download) | worked | |
| [Cursor](https://www.cursor.com/) | worked |  |
| [GitHub Copilot](https://www.cursor.com/) | worked |  |

MCP clients not listed here have not been tested, but should probably work if they have similar capabilities.

For any client, using the Claude 3.7 Sonnet model is the most stable option. However, if you are using a model that can run long enough for you to take a coffee break, it will likely work without any issues.

## Config Environment Variables

- `THRESHOLD`: If the task execution time is less than the specified number of seconds, the overdue command is not executed. Default is 0. (always executed)

- `OVERDUE_COMMAND`: Specify the command to execute when the task is completed.

- `EXECUTE_IN_SERVER`: If this variable is defined, the overdue command is executed within the MCP server instead of being executed by the AI agent.

## MCP Tools

1. `start-timer`: Start a timer to measure task execution time.
    * Output: `{"startTime": "<Current time in ISO format>"}`
    * Description: We instruct AI agents to call this tool first before executing tasks. Use custom instruction to do this.
2. `check-overdue`: Check if the task is overdue based on the given threshold.
    * Required inputs:
        * `startTime`: Start time returned by start-timer
    * Output:
        * If the task execution time is not overdue: `{"elapsed": "<seconds>", "units": "seconds", "overdue": false}`
        * If the task execution time is overdue: `{"elapsed": "<seconds>", "units": "seconds", "overdue": true, "command": "${OVERDUE_COMMAND}"}`

## License

[MIT](https://choosealicense.com/licenses/mit/)
