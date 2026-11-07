# Try Muse Desktop v0.6.0

One app, two ways to use it. Start with the local board; connect Notion only if you want sync later.

## Install

Download **Muse-Desktop-Setup-0.6.0-x64.exe** from the [release](https://github.com/yl14982-cloud/muse-desktop/releases/tag/v0.6.0). It is an unsigned preview; read the [Windows guide](INSTALL-WINDOWS.md) before deciding whether to run it. After installation, launch the installed **Muse Desktop** shortcut, not the Setup file again. No account or developer tools are needed.

## A five-minute local trial

- [ ] Click **+ Add your first task** to expand Muse and open All Tasks.
- [ ] Enter a task and click **Add task**. Check it to select it for Today.
- [ ] Add another task and choose it; Today can hold up to two.
- [ ] Click a selected task's clock to start a 50-minute focus cycle; pause and resume.
- [ ] In **Session notes**, optionally add a goal, check-in or review.
- [ ] Reset saves elapsed time into local history. Finishing a focus cycle does not automatically complete a task.
- [ ] Click a local task's circle to complete it. Click again to reopen. Completing an active local task saves and resets its current focus session.
- [ ] Use **All Tasks → Complete / Reopen** to manage tasks that are not in Today.
- [ ] Remove a task from Today with its × button; the task stays in All Tasks.
- [ ] Choose a mood in the expanded panel. It is a manual choice, not an inferred emotion.
- [ ] Restart Muse; tasks, completion state, selected tasks, mood and saved focus records are retained.
- [ ] Hide to the system tray and restore with **Show Muse**.

No tasks selected? Add one in All Tasks, then check it for Today. If all selected tasks are complete, reopen one or choose an unfinished task before starting a new timer.

## Optional connected trial

Follow [Notion setup](NOTION-SETUP.md) using your own workspace and read-only integration. Save & sync enables the connection and reads mood from Notion. Your local tasks stay in the same app, alongside imported tasks. Selecting a mood yourself switches back to manual; Settings also offers an explicit mood-source choice.

- [ ] Imported tasks appear in **From Notion · read only**.
- [ ] Local tasks remain available after syncing.
- [ ] Select a local and a Notion task together, subject to the same two-task limit.
- [ ] Update an imported task in Notion; refresh Muse and verify the title / status is reflected.
- [ ] Complete imported tasks in Notion. Muse does not write their completion back.
- [ ] Turn off sync; your local tasks, mood and focus history still work.

Do not share the creator's integration token or workspace. Chat-driven writes use separate authorization. The full conversation → Notion → desktop route still needs live validation; changing a document alone is not enough. [Integration checklist](INTEGRATION-TEST.md).

## Report feedback

[Open a bug report](https://github.com/yl14982-cloud/muse-desktop/issues/new?template=bug-report.yml). Include Muse / Windows versions, installer or portable edition, fresh install or upgrade, steps, expected behavior and actual behavior. Remove tokens, private task content, Notion IDs and private paths before posting publicly.
