# Privacy and data

Muse is a local desktop app. It is **not** a ChatGPT plugin and does not monitor conversations.

- Tasks and mood may be fetched from Notion via the Notion API (read-only integration recommended).
- Today task selection, focus timer history, and optional notes are stored on your device in Electron's user-data directory.
- The Notion integration token is stored using Electron `safeStorage` on Windows, which uses Windows DPAPI for OS-backed encryption. Do not share the encrypted credential file; encryption is not a substitute for protecting your Windows account.
- A local development bridge listens on `127.0.0.1:43187` and requires a bearer token, stored locally. This is not a public network endpoint.
- Muse does not automatically mark tasks complete in Notion, infer mental-health conditions, or send all your chat messages anywhere.
- Notion may retain data according to its own policies; see your Notion account and integration permissions.

For public bug reports, remove tokens, private tasks, file paths containing personal information, and any other secrets from screenshots and logs.
