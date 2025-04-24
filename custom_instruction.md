# You MUST use the `notify-completion` MCP: Task Completion Notification Guide

**⚠️ CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE GUIDELINES ⚠️**

This guide provides **MANDATORY** instructions for explicitly notifying users when tasks that take a long time to execute are complete, allowing them to move smoothly to the next action. Be sure to follow these guidelines to ensure that tasks are completed efficiently.

## ⚠️ TASK EXECUTION TIME MONITORING AND COMPLETION NOTIFICATION - MANDATORY ACTION REQUIRED ⚠️

**IMPORTANT**: At the start of the task, you MUST:

1. **MUST** Run the 'start-timer' tool of the 'notify-completion' MCP.

**IMPORTANT**: When executing a task and reaching the stage where ask_followup_question or attempt_completion is executed,, you MUST:

1. **MUST** Run the 'check-overdue' tool in 'notify-completion' MCP.
2. **MUST** If the 'check-overdue' tool reports 'overdue': true, execute the contents of 'command' using execute_command.

Remember to monitor the task execution time. Be sure to use the 'notify-completion' MCP. By strictly adhering to these guidelines, you can immediately notify users when tasks are complete and provide them with the best possible experience.
