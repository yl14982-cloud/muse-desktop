# Manual integration acceptance test

## Current status: NOT YET VALIDATED END TO END

Mocked adapter tests and the Windows packaged-app test passed for v0.5.5. Those tests do not establish that a real conversation, document, Notion workspace and desktop installation work together. A mood label visible on the desktop alone is not proof of this full chain.

## What the implementation actually reads

1. An assistant may produce a conversation summary or document. **Muse does not read that document.**
2. A separately connected, explicitly authorized writer must update the correct Notion row's `Mood` and optional `Observed At` fields. No generic document-to-Notion automation is shipped in Muse.
3. Muse uses its own read-only integration to read that row's properties and its Tasks data source.
4. The user chooses Today tasks locally; Muse does not automatically choose them.

The local bearer-token bridge is a separate development route. A bridge update does not prove that the Notion route works.

## Prerequisites

- Installed Muse v0.5.5 on a tester's Windows computer.
- A dedicated test data source and State row matching [the schema](NOTION-SETUP.md).
- A read-only integration for Muse; a separately authorized writer if testing assistant updates.
- Only harmless sample tasks and neutral state text; no secrets in documents or public test evidence.

## Run these stages in order

| Stage | Action | Expected result | Status |
| --- | --- | --- | --- |
| A: Live Notion read | Add `Try Muse` manually, set State `Mood` to `Calm`, then **Sync now**. | All Tasks shows the task; the cat shows Calm. | Pending manual test |
| B: Local task flow | Select the test task; run, pause and reset its clock. | Local session time is saved; Notion is unchanged. | Automated packaged test passed; live Notion-backed case pending |
| C: Live mood refresh | Change the same row to `Focused`, set `Observed At`, then Sync now or wait about 90 seconds. | The cat changes to Focused. | Pending manual test |
| D: Authorized assistant write | In a conversation, explicitly authorize a neutral test update to the dedicated State row. Confirm the write succeeded in Notion. | Correct row and structured properties updated. | Pending manual test |
| E: Full conversation route | Confirm the assistant's agreed state is saved in Notion, then check Muse. If a document is part of the plan, independently verify the document-to-Notion writer exists and ran. | Muse matches the saved Notion mood. A document-only change must not be counted as success. | Pending manual test |
| F: Friend setup | Repeat A–C with a friend's own workspace and integration. | No creator credentials or workspace access needed. | Pending manual test |

Stop at the first failing stage and identify which connection failed. Do not mark later stages as passed on the basis of mocks or a screenshot.

## Evidence to record

Record the Muse version, Windows version, stage, local test time, expected mood and observed mood, and pass/fail. Keep tokens and full workspace IDs out of public issues. Change the statuses above only after a real observed test.
