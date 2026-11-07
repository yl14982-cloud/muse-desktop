<div align="center">

# Muse Desktop 🐱
### A little company. One task at a time.

A Windows desktop cat, personal task board and 50-minute focus timer.

**Add a task. Choose your next step. Start focusing. No account needed.**

[**Download for Windows**](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.6.0/Muse-Desktop-Setup-0.6.0-x64.exe) · [**Release notes**](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.6.0) · [**First-time guide**](docs/TRY-MUSE.md)

![Windows build](https://github.com/yl14982-cloud/muse-desktop/actions/workflows/windows-build.yml/badge.svg)

![Muse's compact pastel cat and task widget](assets/screenshots/widget-preview.png)

</div>

## Meet Muse

Muse keeps a small, quiet companion on your desktop while you organize your next steps. Add your own tasks, choose up to two for Today, mark them complete, and use a 50-minute focus timer. Your tasks, mood choice and session records stay on your computer.

**v0.6.0 makes local tasks the default.** You can use the same app on its own, or optionally connect Notion for a conversation-driven workflow. You do not need separate basic and connected installers. This is an unsigned friend-testing preview, not a stable release.

The preview image above shows the compact widget with sample tasks. New local-task and optional-sync controls are available in the expanded panel.

## Two ways to use the same app

| | Local mode — ready after installation | Optional connected mode |
| --- | --- | --- |
| Tasks | Type tasks directly in Muse, select Today tasks, complete and reopen them. | Keep your local tasks and also read tasks from your own Notion data source. |
| Mood | Choose one of five cat moods yourself. | Optionally read the mood saved in your Notion State row; manual mood is still available. |
| Focus | Start, pause, resume and reset a 50-minute timer for a selected unfinished task. | The same timer works with local or selected Notion tasks. |
| Setup | No account, token, Notion or chatbot required. | Configure your own read-only Notion integration in Settings when you want sync. |
| Completion | Local tasks can be completed or reopened in Muse. | Imported tasks stay read-only; update their completion in Notion. |
| Chat updates | Not required. | An explicitly authorized assistant can write tasks or mood into Notion; Muse refreshes those fields. The full live desktop chain is still under validation. |

You choose which tasks appear in Today; sync never automatically replaces that choice with an arbitrary deadline. A Notion refresh does not overwrite the local task library. Turning off sync keeps local tasks and focus history.

## Install and try it

| Download | Use |
| --- | --- |
| [**Windows x64 installer — v0.6.0**](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.6.0/Muse-Desktop-Setup-0.6.0-x64.exe) | Recommended. Installs Muse and creates Desktop / Start Menu shortcuts. |
| [Portable edition — v0.6.0](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.6.0/Muse-Desktop-Portable-0.6.0-x64.exe) | Try the app without an installation wizard. |
| [Release notes and checksums](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.6.0) | Changes, test scope, limitations and file checksums. |

Public release downloads do not require a GitHub account, Node.js, PowerShell or Git. The **Source code** ZIP is for developers.

1. Download the installer, read the unsigned-build notice below and decide whether to run the preview.
2. Install, then open the installed **Muse Desktop** shortcut. Do not launch the `Setup` file again for daily use.
3. Click **+ Add your first task**, enter a task name and choose **Add task**.
4. Check the task in **All Tasks** to select it for Today. Up to two tasks can be selected.
5. Click its clock to focus. In the expanded panel, click a local task's circle to complete or reopen it.
6. Choose your cat's mood in the expanded panel. Notion setup can wait until you want it.

**Unsigned preview:** Microsoft Defender SmartScreen may show an unknown-publisher warning. Confirm the repository and exact filename before deciding whether to run it. **More info → Run anyway** may be offered if you choose to trust the build. Do not disable Windows protection. Stop if the source is unexpected or your organization's policy blocks it. Automated tests and dependency audits do not guarantee complete security.

[Detailed Windows guide](docs/INSTALL-WINDOWS.md) · [Friend-testing checklist](docs/TRY-MUSE.md)

## Optional: connect Notion and chat updates

Open **Settings → Set up optional Notion connection** when you want it. [Follow the exact schema and setup guide](docs/NOTION-SETUP.md). Use your own integration and workspace; no creator credentials or personal workspace are bundled.

The same All Tasks panel then includes a **From Notion · read only** section. Your local tasks remain available. After saving a connection, Muse reads mood from Notion; choosing a mood yourself switches back to manual. You can also choose the mood source explicitly in Settings. Turn off sync to return to local mode.

### What “chat-driven” means

An assistant with your explicit authorization and a working Notion connection can write task or state fields in Notion. Muse then reads them on **Sync now** or its roughly 90-second refresh. A task written in chat appears in the imported task list; you still choose whether to put it in Today.

Muse does not continuously watch ChatGPT, infer your mood, or read an arbitrary document. Updating a document alone does not update the app. There is no generic document-to-Notion writer bundled in Muse.

**Live integration status:** assistant → Notion test write and readback have been demonstrated in the creator's workspace. Desktop readback was blocked by incomplete Notion configuration, so the full live chain and a friend's separate workspace are **not yet validated**. Automated adapter tests use simulated responses. [Integration test procedure](docs/INTEGRATION-TEST.md).

## What gets tested

CI audits the complete npm dependency tree, checks JavaScript, tests local task storage and migration, exercises source merging / offline failures / sync cancellation, builds both Windows executables, and launches the packaged Windows app.

The packaged test exercises the local UI: adding, selecting, completing and reopening tasks; two-task limits; literal task text; focus actions; manual mood; restart persistence; and optional connection controls. Tests use an isolated profile and no personal Notion credentials. They launch the unpacked app; real installer and upgrade behavior still need manual feedback.

[Build and test runs](https://github.com/yl14982-cloud/muse-desktop/actions/workflows/windows-build.yml)

## Feedback and next steps

[Report a bug](https://github.com/yl14982-cloud/muse-desktop/issues/new?template=bug-report.yml) or [suggest an improvement](https://github.com/yl14982-cloud/muse-desktop/issues/new). Include your Muse / Windows versions and steps to reproduce. Remove tokens, private Notion IDs, task text and private paths from public screenshots.

Next priorities: finish live Notion and conversation testing, verify upgrades on real Windows profiles, and investigate code signing and automatic updates. Mood drawings are static; auto-start and automatic app updates are not implemented.

## Privacy and upgrades

Local tasks, choices, mood and focus notes are stored in the app's user-data directory. Notion tokens use Windows-backed encrypted storage. Local tasks are never uploaded by the Notion reader. Notion tasks remain read-only; the optional writer in your chat tool has separate authorization.

The token-protected loopback bridge remains available for development mood updates; it cannot replace your local task board. [Privacy and data](docs/PRIVACY.md).

v0.6.0 retains existing focus files and encrypted connection settings and migrates cached selected Notion tasks when available. Pure migration tests and isolated restart tests pass in CI; back up your existing user-data folder before an upgrade, as real-profile migration is still under manual validation. Installed copies do not auto-update: download and install the new version.

## For developers

Use Windows and Node.js **22.12 or newer**:

```powershell
npm.cmd ci --foreground-scripts --ignore-scripts=false
npx.cmd install-electron
npm.cmd run check
npm.cmd test
npm.cmd start
```

Build and validate:

```powershell
npm.cmd audit --audit-level=low
npm.cmd run dist:win -- --publish never
npm.cmd run test:packaged
```

Electron 45.2.3 and electron-builder 26.18.0 are pinned. A targeted minimatch override supplies patched 11.0.1 to the build tools. [Publishing procedure](docs/PUBLISHING.md).

## License

Source code is public, but an open-source license has not yet been selected. Public visibility alone does not grant general reuse or redistribution rights. Published Windows previews are offered for personal testing and feedback.
