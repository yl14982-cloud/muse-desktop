# Privacy and data

Muse is a local-first desktop app. Local task creation, task completion, manual mood and focus sessions do not require an account. It is **not** a ChatGPT plugin and does not monitor conversations.

- With optional sync enabled, imported tasks and mood may be fetched from Notion via the Notion API (read-only integration recommended).
- Local tasks and completion state, Today task selection, manual mood, focus timer history, and optional notes are stored on your device in Electron's user-data directory.
- The Notion integration token is stored using Electron `safeStorage` on Windows, which uses Windows DPAPI for OS-backed encryption. Do not share the encrypted credential file; encryption is not a substitute for protecting your Windows account.
- A local development bridge listens on `127.0.0.1:43187` and requires a bearer token, stored locally. This is not a public network endpoint.
- Muse does not automatically mark tasks complete in Notion, infer mental-health conditions, or send all your chat messages anywhere.
- Notion may retain data according to its own policies; see your Notion account and integration permissions.

For public bug reports, remove tokens, private tasks, file paths containing personal information, and any other secrets from screenshots and logs.

Local tasks are not uploaded by the Notion reader. Imported tasks are read-only in Muse. Turning off sync preserves the local library and focus history; disconnect also removes the saved connection and imported task cache. A separate assistant writer needs its own authorization to update Notion. The legacy development bridge can update mood, but cannot replace the local task board.
