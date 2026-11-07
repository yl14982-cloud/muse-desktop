<div align="center">

# Muse Desktop 🐱
### A little company. One task at a time.

A quiet desktop cat for your daily tasks and 50-minute focus sessions.

**Windows x64 · English interface · Early friend-testing preview**

[**Download the Windows installer**](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.5.5/Muse-Desktop-Setup-0.5.5-x64.exe) · [**View the release**](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.5.5) · [**First-time guide**](docs/TRY-MUSE.md)

![Windows build](https://github.com/yl14982-cloud/muse-desktop/actions/workflows/windows-build.yml/badge.svg)

![Muse's pastel cat and compact daily task widget](assets/screenshots/widget-preview.png)

</div>

## Meet Muse

Keep a small companion on your desktop, choose what matters today, and give one task your attention. Muse brings together a pastel cat, up to two daily tasks, and a focus timer in a compact widget. Click the widget to open the full panel; hide it to the system tray when you want more space.

Muse is an early personal project shared for feedback. It is ready for a small, informed trial, with the limitations below. The images in this README are interface previews with sample tasks.

## What you can do

| Feature | How it works today |
| --- | --- |
| Choose today's tasks | Read tasks from your own Notion data source and select up to two in **All Tasks**. |
| Focus for 50 minutes | Start, pause, resume or reset a timer attached to a selected task. Reset preserves elapsed time in your local session history. |
| Keep a small record | Add an optional session goal, check-in and review. Records stay on this device. |
| Share a mood explicitly | Muse reads a saved Notion mood: **Focused**, **Calm**, **A bit tired**, **Low energy** or **Stressed**. |
| Change your mind | Remove a task from Today using the cat button. The original Notion task is kept. |
| Stay unobtrusive | Use the compact widget, expanded panel or system-tray menu. |

<details>
<summary><strong>See the expanded panel</strong></summary>

![Muse's expanded task and focus panel](assets/screenshots/dashboard-preview.png)

</details>

## Download and install

**You do not need Node.js, PowerShell, Git or a GitHub account to download the public release files.**

| Download | Choose this if… |
| --- | --- |
| [**Muse Desktop 0.5.5 — Windows installer (.exe)**](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.5.5/Muse-Desktop-Setup-0.5.5-x64.exe) | You want to install Muse and launch it from a Desktop or Start Menu shortcut. Recommended for friend testing. |
| [Portable edition (.exe)](https://github.com/yl14982-cloud/muse-desktop/releases/download/v0.5.5/Muse-Desktop-Portable-0.5.5-x64.exe) | You want to try it without an installation wizard. |
| [Release notes and checksums](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.5.5) | You want to inspect the build, changes and current limitations first. |

1. Download the **installer** above; the **Source code** ZIP on the release page is for developers.
2. Run it if you trust this unsigned preview, then complete the installation wizard.
3. For daily use, open **Muse Desktop** from the installed shortcut. Keep the installer for installation only; opening `Setup` again starts the installer again.
4. Click an empty area of the widget to expand it. Open **Settings** to connect your own Notion, then **All Tasks** to choose up to two tasks.
5. Click a task's clock to start a focus block.

**Before installing:** this preview is unsigned, so Microsoft Defender SmartScreen may show “Windows protected your PC” or an unknown publisher. This is not a safety certification. Check that you downloaded `Muse-Desktop-Setup-0.5.5-x64.exe` from this repository's release. If you trust it and choose to continue, use **More info → Run anyway** when offered. Do not disable Windows protection. Stop if the filename or source is unexpected, or your organization blocks the app.

[Detailed Windows guide](docs/INSTALL-WINDOWS.md) · [Five-minute trial checklist](docs/TRY-MUSE.md)

## Before your first focus session

**Real personal tasks currently require Notion.** Each tester uses their own workspace and read-only integration. No account, credentials or personal workspace belonging to the creator is bundled with Muse.

- Connect a Tasks data source and a Muse State page in **Settings**. [Follow the exact setup and field names](docs/NOTION-SETUP.md).
- Select a task in **All Tasks** before starting a timer.
- `No tasks selected` means Muse is running but Today is empty. The timer will not start until a task is selected.
- A fresh profile may show sample tasks so you can preview the interface; this is not a local task editor.

**Not available yet:** typing a new task directly into Muse, starting a timer without a task, automatically selecting today's work, or writing task completion back to Notion.

## What has actually been tested?

| Area | Evidence / status |
| --- | --- |
| Windows packaging | Installer and portable executables built successfully in GitHub Actions. |
| Packaged application | Automated Windows test passed for startup, expanded panel, task selection, timer start/pause/reset, restart persistence, Settings and authenticated bridge rejection. This test launches the unpacked app, not the installer wizard. |
| Dependency audit | The v0.5.5 build reported **0 npm audit advisories**, including development dependencies, at build time. This is not a complete security audit or a permanent guarantee. |
| Notion adapter | Parsing and requests tested with mocked API responses. Live, cross-account Notion setup still needs manual validation. |
| Your own computer | The creator has opened the widget on Windows; installer behavior and the full user journey still need friend feedback. |
| **Chat → document → Notion → Muse** | **Not yet validated end to end.** There is no general document-to-Notion automation bundled with this app. |

[Inspect the successful v0.5.5 build and test logs](https://github.com/yl14982-cloud/muse-desktop/actions/runs/42337004089) · [Manual integration test procedure](docs/INTEGRATION-TEST.md)

### About conversation-driven updates

Muse reads specific Notion properties; it does **not** read a generic document, listen to every ChatGPT message, or infer your mood continuously. A connected assistant would need explicit authorization and working access to write the agreed state into the correct Notion page. Muse can then read that saved state on **Sync now** or its roughly 90-second refresh. Updating a document alone does not update Muse.

Please treat this chain as an integration under evaluation, rather than a finished automatic feature.

## Help shape the next version

Friends are especially welcome to test installing, launching from the shortcut, selecting tasks and using the timer. [Start with the trial checklist](docs/TRY-MUSE.md), then [report a bug](https://github.com/yl14982-cloud/muse-desktop/issues/new?template=bug-report.yml) or [suggest an improvement](https://github.com/yl14982-cloud/muse-desktop/issues/new).

Never include tokens, private task text or unredacted personal screenshots in public issues.

Next priorities: finish live Notion and conversation-chain testing, add local tasks / task-free focus, improve first-run guidance, and investigate code signing. Mood drawings are currently static; auto-start and automatic app updates are not implemented.

## Privacy

Task selections, focus history and notes are stored locally. The Notion token is encrypted with Windows-backed Electron `safeStorage`; it is not returned in the Settings password field. Notion content is fetched read-only. A token-protected local bridge listens on `127.0.0.1:43187`.

[Privacy and data](docs/PRIVACY.md)

## For developers

Node.js **22.12 or newer** and Windows are required for the supported development workflow.

```powershell
npm.cmd ci --foreground-scripts --ignore-scripts=false
npx.cmd install-electron
npm.cmd run check
npm.cmd test
npm.cmd start
```

If the Electron binary is missing, run `npx.cmd install-electron` once before starting the app.

Build and test:

```powershell
npm.cmd audit --audit-level=low
npm.cmd run dist:win -- --publish never
npm.cmd run test:packaged
```

v0.5.5 pins Electron 45.2.3 and electron-builder 26.18.0. A targeted `minimatch@>=7 <11.0.1` override supplies the patched 11.0.1 release; remove it once upstream dependencies include the fix. CI rejects dependency audit findings before publishing build artifacts.

[Release publishing procedure](docs/PUBLISHING.md)

## License

Source code is public, but an open-source license has not yet been selected. Public visibility alone does not grant general reuse or redistribution rights. The published Windows pre-release is offered for personal testing and feedback.
