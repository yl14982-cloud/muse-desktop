# Manual integration acceptance test

## Current status: creator task route observed end to end

On 2026-11-07, an authorized assistant created the harmless task `Muse sync test — from ChatGPT` in the creator's Notion Tasks data source. An independent read confirmed its title and Ready status. The user then supplied a Windows desktop photo showing that exact task in All Tasks and selected in Today. This verifies the conversation → Notion → Muse task route in the creator's configured installation, with manual Today selection.

A separate assistant update set the state to `Focused`; the desktop photos show the matching label. This is supporting evidence for mood sync; the photo alone cannot exclude a manual mood selection. Automatic refresh timing, a friend's independent setup, and document-to-Notion automation were not verified. The installed version and Windows build were not independently captured during this live test.

After confirmation, the temporary task was marked Done and the pre-test state properties were restored. The restored historical mood is not a new assessment of the user's current state.

## What the implementation actually reads

1. An assistant may produce a conversation summary or document. **Muse does not read that document.**
2. A separately connected, explicitly authorized writer must update the correct Notion row's `Mood` and optional `Observed At` fields. No generic document-to-Notion automation is shipped in Muse.
3. Muse uses its own read-only integration to read that row's properties and its Tasks data source.
4. The user chooses Today tasks locally; Muse does not automatically choose them.

The local bearer-token bridge is a separate development route. A bridge update does not prove that the Notion route works.

## Prerequisites

- Installed Muse v0.6.0 with optional sync enabled on a tester's Windows computer.
- A dedicated test data source and State row matching [the schema](NOTION-SETUP.md).
- A read-only integration for Muse; a separately authorized writer if testing assistant updates.
- Only harmless sample tasks and neutral state text; no secrets in documents or public test evidence.

## Run these stages in order

| Stage | Action | Expected result | Status |
| --- | --- | --- | --- |
| A: Live Notion read | Add `Try Muse` manually, set State `Mood` to `Calm`, then **Sync now**. | All Tasks shows the task; the cat shows Calm. | Equivalent assistant-created task observed in All Tasks and Today; exact Calm/manual-entry scenario not run |
| B: Local task flow | Select the test task; run, pause and reset its clock. | Local session time is saved; Notion is unchanged. | Automated packaged test passed; live Notion-backed case pending |
| C: Live mood refresh | Change the same row to `Focused`, set `Observed At`, then Sync now or wait about 90 seconds. | The cat changes to Focused. | Matching Focused label observed; manual-source exclusion and timed refresh not verified |
| D: Authorized assistant write | In a conversation, explicitly authorize a neutral test update to the dedicated State row. Confirm the write succeeded in Notion. | Correct row and structured properties updated. | Assistant task/state writes and readback passed; exact task observed on desktop |
| E: Full conversation route | Confirm the assistant's agreed state is saved in Notion, then check Muse. If a document is part of the plan, independently verify the document-to-Notion writer exists and ran. | Muse matches the saved Notion mood. A document-only change must not be counted as success. | Direct task route passed in creator installation; mood match observed; document route not tested |
| F: Friend setup | Repeat A–C with a friend's own workspace and integration. | No creator credentials or workspace access needed. | Pending manual test |

Stop at the first failing stage and identify which connection failed. Do not mark later stages as passed on the basis of mocks or a screenshot.

## Evidence to record

Record the Muse version, Windows version, stage, local test time, expected mood and observed mood, and pass/fail. Keep tokens and full workspace IDs out of public issues. Change the statuses above only after a real observed test.
