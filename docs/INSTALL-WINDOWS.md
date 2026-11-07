# Install Muse Desktop on Windows

## Option A: Download a build from GitHub Actions

1. Open the repository's **Actions** tab.
2. Select **Build Windows installers** and choose **Run workflow**.
3. After the workflow succeeds, open its run, then download **Muse-Desktop-Windows-unsigned** under **Artifacts**.
4. Extract the workflow artifact ZIP. It contains an installer (`Muse-Desktop-Setup-…exe`) and a portable EXE (`Muse-Desktop-Portable-…exe`).
5. Run the installer. The installer is configured to create Desktop and Start Menu shortcuts. Alternatively, run the portable EXE without an installer.

These builds are **unsigned**. Windows SmartScreen may warn you. Only run software you've built yourself or trust; inspect the source first. Do not disable security protections globally.

## Option B: Build locally on Windows

1. Install Node.js LTS.
2. **Easiest:** double-click `Build-Windows.cmd` inside the project folder. It installs dependencies, runs tests and creates the unsigned EXEs in `dist/`.
3. Or, in PowerShell, from the project directory:

   ```powershell
   npm.cmd install --foreground-scripts --ignore-scripts=false
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
