# Install Muse Desktop on Windows

## Option A: Install the public friend-testing preview

1. Open the [v0.5.5 release](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.5.5).
2. Under **Assets**, download **Muse-Desktop-Setup-0.5.5-x64.exe**. No GitHub account or developer tools are required. Do not choose the Source code ZIP unless you want to develop the app.
3. Read the unsigned-build notice below and decide whether to run this test build. Complete the installation wizard.
4. For daily use, open the installed **Muse Desktop** Desktop / Start Menu shortcut. `Setup` is the installer, not the daily launcher. The shortcut should point to `Muse Desktop.exe`.
5. Connect your own Notion in **Settings**, choose up to two tasks in **All Tasks**, then start a task's clock. [Exact Notion setup](NOTION-SETUP.md).

For a trial without an installation wizard, choose **Muse-Desktop-Portable-0.5.5-x64.exe** instead.

### Windows security prompts

These builds are **unsigned**. Windows SmartScreen may show an unknown publisher or “Windows protected your PC.” Check the exact filename and that it came from this repository's release. If you trust the file and choose to continue testing, **More info → Run anyway** may be offered. Do not disable Windows security protections; stop if the source differs or your organization's policy blocks the app. Any final decision to run an unsigned application is yours.

v0.5.5 passed dependency audit and automated unpacked-Windows application tests. Those checks do not replace manual installer testing or guarantee complete security. The full conversation-to-Notion-to-Muse route is still unvalidated.

## Option B: Build locally on Windows

1. Install Node.js LTS.
2. **Easiest:** double-click `Build-Windows.cmd` inside the project folder. It installs dependencies, runs tests and creates the unsigned EXEs in `dist/`.
3. Or, in PowerShell, from the project directory:

   ```powershell
   npm.cmd ci --foreground-scripts --ignore-scripts=false
   npm.cmd run check
   npm.cmd test
   npm.cmd run dist:win
   ```

4. Open `dist/` and run your installer or portable EXE. For daily launches, you **do not need** PowerShell.

## Connecting Notion without PowerShell

1. Open Muse; click its widget to expand, then choose **Settings**.
2. Paste a *read-only* Notion integration token in **Integration token**.
3. Enter the Tasks data source ID and Muse State page ID from **your own** Notion workspace.
4. Click **Save & sync**. The token is stored using Electron's OS-backed encryption on this Windows user account; the password field is not populated when you revisit the Settings page.
5. Grant the Notion integration **read** access to both databases from Notion's page connections menu.

The app will read the Notion tasks and state on startup and approximately every 90 seconds. Select up to two tasks in **All Tasks**; this selection is local and can be changed or removed using the cat button. ChatGPT must explicitly write state to Notion; Muse does not continuously read chats.

**Never** post a token in GitHub issues, commits, public screenshots, or chat messages. If it is exposed, revoke/rotate it in Notion.

## Existing developer users

The installed version uses its own Electron user-data path. Your previous V5.4 developer data *may* reside in that path, but first back up session records and settings before uninstalling anything. Do not copy your Notion token into the source code.

## Troubleshooting

- Blank task list: check Notion Integration permissions, credentials, and task statuses; use **Sync now**.
- No connection: confirm you entered the **data source ID**, not the database's page ID, and the specific Muse State page ID.
- App stays in tray: open its system tray menu and select **Show Muse**.
- macOS/Linux: no builds provided; this repository is currently Windows-focused.
