<div align="center">

# Muse Desktop 🐱
### Talk it through. Choose two. Begin.

A desktop study companion that brings your ChatGPT planning conversations closer to the work in front of you.

**Talk through your goals. Keep your next two steps beside you.**

A small task board, a focus clock and a cat for company. Use it on its own, or connect your ChatGPT–Notion workflow after one-time setup. Connected desktop sync is still under validation.

[**Download for Windows**](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.6.0/Muse-Desktop-Setup-0.6.0-x64.exe) · [**Release notes**](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.6.0) · [**First-time guide**](docs/TRY-MUSE.md)

![Windows build](https://github.com/yl14982-cloud/muse-desktop/actions/workflows/windows-build.yml/badge.svg)

![Muse's compact pastel cat and task widget](assets/screenshots/widget-preview.png)

</div>

## Make room for a manageable day

You may know what you want to achieve and still struggle to decide where to begin. A course to catch up on, a project to move forward, a long list of unfinished work: each can feel larger when everything asks for your attention at once.

Muse starts with a conversation. In ChatGPT, you can talk through the goal, what is getting in the way, how much time you have and how you feel today. Together, you can turn a broad intention into a specific action, then decide which two steps deserve your attention now.

**Muse gives those next steps a small, visible place on your desktop.** The rest of your task list stays in All Tasks. The two-task view is designed to make the day feel more approachable and give you a clear place to return when your attention drifts.

A little cat stays nearby. A clock helps you make time for the task. Your saved sessions and notes give you something concrete to reflect on afterward.

## From “I need to do everything” to a next step

### Talk through the goal before filling the board

A useful plan often begins with questions: What would finishing look like? What do I already understand? What can I realistically do in the time available?

Use ChatGPT to explore those questions, break the goal into concrete actions and identify a stopping point. For example, “prepare for the exam” might become “solve three practice problems and explain one mistake in my own words.” A task like that gives you a clear way to start and check what you accomplished.

In the optional connected workflow, an explicitly authorized ChatGPT–Notion writer can save the agreed tasks to your own Notion workspace. Muse then reads them into All Tasks, where you select up to two for Today. This carries the plan from conversation to a desktop view with less repeated task entry.

### Choose today's priorities with today's capacity in mind

Your best next step can change with the day. In a check-in with ChatGPT, you can consider deadlines, importance, available time, energy and the work already done. Use that conversation to choose what matters most now, rather than trying to fit the entire backlog into Today.

Muse keeps **up to two chosen tasks** in the compact widget. You make the final selection; the app does not automatically rank or replace your tasks. The aim is a smaller field of attention and less repeated deciding about what to do next.

### Let your state help you choose a way to study

Muse can show **Focused**, **Calm**, **A bit tired**, **Low energy** or **Stressed**. Choose the state yourself, or read an explicitly saved state from Notion when connected. The cat and short caption make that check-in visible.

You can use the state as a prompt for a further conversation with ChatGPT:

| How today feels | A study approach you might discuss |
| --- | --- |
| Focused | Protect a block for a demanding problem or active recall. |
| Calm | Continue at a steady pace with one clear stopping point. |
| A bit tired | Try a smaller exercise, a short review, or studying alongside someone. |
| Low energy | Consider a pause, then choose one modest action if you feel ready. |
| Stressed | Talk through what feels urgent, narrow the next step and decide what can wait. |

These are conversation prompts and possible approaches, not automatic app interventions. ChatGPT can help you reflect on what supports you, including when to persist with a manageable step and when to adjust the plan. Muse currently displays the chosen mood and its built-in caption; it does not detect your feelings or select a study strategy for you.

### Give effort a time and a record

Start a **50-minute focus cycle** for a selected unfinished task. Pause when you need to, resume when ready, and optionally write a session goal, a check-in or a review. Paused time is excluded. Reset saves elapsed focus time into your local history.

The Progress view shows today's recorded focus time and recent sessions. It can help you look back at the work you made time for and what you learned. The timer records elapsed focus-session time; it does not verify attention or automatically mark a task complete.

### Keep a little company while you work

Muse's pastel cat sits alongside your chosen tasks and reflects the mood you share. It is a small, gentle presence while you study, with a compact widget, an expanded panel and a system-tray option. You can keep it close without keeping a full planning window in front of you.

## The idea that connects it all

**A conversation helps you understand the work. Two visible tasks help you begin. A clock and a companion stay with you while you do it.**

The distinctive workflow Muse is exploring brings together goal clarification, task breakdown, daily reflection and a desktop view of the next steps you chose. ChatGPT supplies the conversation; your authorized Notion connection carries the agreed tasks and state; Muse provides the board, cat and focus-session record.

Once that connection is configured, you can ask your ChatGPT–Notion writer to create or update connected tasks in conversation. You still choose Today tasks in Muse, and imported tasks remain read-only there. You can also skip the connection entirely and manage local tasks inside Muse.

**Current integration status:** assistant-to-Notion writing and readback have been demonstrated in the creator's workspace. The complete live desktop chain and setup in another person's workspace are still under validation. This preview needs one-time Notion setup and separate writer authorization; it does not monitor all conversations or turn an arbitrary document into an app update. [Setup guide](docs/NOTION-SETUP.md) · [Integration test status](docs/INTEGRATION-TEST.md).

## Project & Progress: the longer view

The wider product direction is to connect a larger goal, its concrete tasks, today's priorities and a record of progress. Here is the boundary of the current release:

| Area | Available in v0.6.0 | Product direction |
| --- | --- | --- |
| Daily tasks | Add local tasks; select up to two; complete and reopen local tasks; optionally read Notion tasks. | A clearer link between the tasks and the larger goal they serve. |
| Progress | Today's recorded focus time, recent local sessions and optional goal / check-in / review notes. | Longer-term summaries across days and projects. |
| Projects | The menu entry is a placeholder; project grouping and project-level tracking are not implemented. | Group related tasks under a goal, break it into milestones and review progress over time. |

**Muse v0.6.0 is an unsigned friend-testing preview.** The focus is to make the local board useful now while testing the connected workflow carefully. The image above shows the compact widget with sample tasks; local-task and optional-sync controls are in the expanded panel.

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
