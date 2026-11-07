# Try Muse with a friend

Thanks for trying this early Windows preview. The goal is to find confusing steps and broken behavior, not to measure your productivity.

## Start here

1. Use the [v0.5.5 release](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.5.5) and download **Muse-Desktop-Setup-0.5.5-x64.exe**. You do not need a GitHub account, developer tools or the Source code ZIP.
2. Read the unsigned-build notice in the [installation guide](INSTALL-WINDOWS.md) before deciding whether to run it.
3. Install, then launch the installed **Muse Desktop** shortcut. Do not launch `Setup` again for daily use.
4. Try expanding, collapsing, dragging the widget by its handle, hiding to the tray, and restoring it with **Show Muse**.

## Test tasks and focus

To use your own tasks, first [set up your own Notion connection](NOTION-SETUP.md). Do not ask the creator for their token or workspace access. Without a task selected, the timer does not start; manual local task entry and task-free focus are not implemented.

- [ ] **Settings → Save & sync** shows a connection result.
- [ ] **All Tasks** shows the tasks from your shared data source.
- [ ] Select one or two tasks; Today shows the same titles.
- [ ] Click a task clock; the timer starts. Pause and resume it.
- [ ] Add a goal or check-in in **Session notes**, if desired.
- [ ] Reset saves elapsed time into the local history.
- [ ] Restart Muse; a saved paused session / history is still available.
- [ ] Remove a Today task with the cat button; the original Notion task remains.

## What is still experimental?

The complete **conversation → document → Notion → Muse** chain has not been validated. There is no bundled generic document-to-Notion writer. This release does not listen to ChatGPT automatically, detect emotions, or complete Notion tasks for you. [Integration test details](INTEGRATION-TEST.md).

The automated Windows test exercises the unpacked application. It does not prove that every Windows installation, display setup or existing profile behaves correctly.

## Send useful feedback

[Open a bug report](https://github.com/yl14982-cloud/muse-desktop/issues/new?template=bug-report.yml) with:

- Muse version and Windows version.
- Installer or portable edition; fresh install or upgrade.
- What you clicked, what you expected, and what happened.
- Whether it still happens after restarting.
- A redacted screenshot, if helpful.

Please remove integration tokens, private page IDs, personal task names and private file paths before posting. If you do not want to report publicly, describe the issue directly to the friend who sent you Muse.
