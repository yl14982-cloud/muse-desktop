# Install Muse Desktop on Windows

## Download and install v0.6.0

1. Open the [v0.6.0 release](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.6.0).
2. Under **Assets**, download **Muse-Desktop-Setup-0.6.0-x64.exe**. No GitHub account or developer tools are needed. Source code archives are for developers.
3. Read the unsigned-build notice below, decide whether to trust the preview, and complete the installation wizard.
4. Open the installed **Muse Desktop** shortcut for daily use. The shortcut should target `Muse Desktop.exe`, not a `Setup` file.
5. Click **+ Add your first task → Add task**, then check the task for Today and click its clock.

You can use the local task board and choose your cat's mood without ChatGPT, Notion or an account. Notion sync is optional in Settings.

The portable EXE is also available if you do not want an installation wizard.

## Security prompts

The builds are **unsigned**. SmartScreen can show an unknown publisher or “Windows protected your PC.” Check the repository and filename. If you trust the preview and choose to continue testing, **More info → Run anyway** may be offered. Keep Windows protection enabled and stop if your organization's policy blocks the app or the source differs.

Dependency audits and automated packaged-app tests do not guarantee complete security or every installer configuration.

## Upgrading from v0.5.5

Quit Muse from its tray menu before installing the new version. Back up the app's user-data folder first; it contains personal task and session data and may contain an encrypted connection file, so do not share it.

Existing focus history and encrypted settings use the same app identity. v0.6.0 migrates cached selected Notion tasks into the new board when possible. These paths are covered by pure migration and isolated restart tests, but existing real-world profiles still need manual verification.

The app does not auto-update. Updating the GitHub source alone does not update an installed copy.

## Optional Notion connection

See [NOTION-SETUP.md](NOTION-SETUP.md). Local tasks remain usable with sync enabled or disabled. Save & sync enables Notion and reads its mood; choosing a manual mood switches back to manual. Imported task completion is managed in Notion.

## Build from source

Use Windows and Node.js 22.12 or newer:

```powershell
npm.cmd ci --foreground-scripts --ignore-scripts=false
npx.cmd install-electron
npm.cmd run check
npm.cmd test
npm.cmd run dist:win -- --publish never
npm.cmd run test:packaged
```

`Build-Windows.cmd` remains an alternative for packaging. The produced installer and portable EXE are under `dist/`.

## Troubleshooting

- Empty Today: open **All Tasks**, add a local task and check it for Today.
- Timer disabled: select an unfinished task; reopen a completed local task if needed.
- Task removal: × returns it to All Tasks. It does not delete the task.
- Local completion: use the circle in Today or Complete / Reopen in All Tasks.
- No Notion connection: use local mode while checking the optional setup and read permissions.
- Mood not changing from Notion: set **Mood source → Read from Notion** while sync is enabled.
- Repeated installer prompts: use the installed Muse shortcut, not the Setup file.
- Hidden in tray: use **Show Muse**.
- macOS / Linux: no supported packaged builds are provided.
