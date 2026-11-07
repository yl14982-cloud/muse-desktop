# Connect your own Notion workspace

Muse v0.5.5 reads the exact property names below. It does not create a Notion template for you, and it does not parse an arbitrary document body. This setup is an early integration path awaiting live cross-account testing.

## 1. Prepare a Tasks data source

Create a Notion database with these case-sensitive properties:

| Property | Notion type | Required for |
| --- | --- | --- |
| `Task` | Title | Required for each task to appear. Rename the default title column to `Task`. |
| `Status` | Status | Task status; tasks whose status is exactly `Done` are hidden. |
| `Area` | Select | Optional category displayed in All Tasks. |
| `Deadline` | Date | Optional due date. |

Add one harmless test task such as `Try Muse`. Set its status to an unfinished value such as `Ready`. The current app queries only the first 100 recently edited pages; pagination is not implemented.

## 2. Prepare a Muse State database row

Create a separate database with the following properties, then create one row in it:

| Property | Notion type | Values / purpose |
| --- | --- | --- |
| `Name` | Title | Any descriptive name for this row; the adapter does not read this field. |
| `Mood` | Select | Exactly one of `Focused`, `Calm`, `A bit tired`, `Low energy`, `Stressed`. |
| `Context` | Rich text (Text in the Notion UI) | Optional explanation; the adapter reads it, but the current widget uses its built-in mood caption. |
| `Observed At` | Date | Optional date/time of the explicit update. |

Use the **page ID of this row**, not the database ID, as the Muse State page ID.

## 3. Give Muse read access

Create your own Notion integration with read access, and connect it to the Tasks database and the State database / row. Access is granted in Notion as well as entered in Muse; merely copying a page ID does not grant access.

Keep the integration token private. Do not share the creator's integration, workspace, connection file or session history with friends. Each tester configures their own connection.

## 4. Connect in Muse

Expand the widget and open **Settings**. Enter:

- **Integration token:** your integration credential.
- **Tasks data source ID:** the ID used by Notion's `/v1/data_sources/{id}/query` API, not the database container ID or an arbitrary page ID.
- **Muse State page ID:** the page ID of the single database row you prepared above.

A data source ID is available through Notion's data source controls / API. Do not assume the ID in an ordinary database URL is the correct data source ID.

Choose **Save & sync**, then **All Tasks** and select up to two tasks. Click a task clock to start focusing. Muse reads only; it will not mark your Notion task complete.

## If it does not work

- Empty All Tasks: confirm read access, the data source ID, a nonempty `Task` title, and a status other than `Done`.
- Mood does not change: confirm a database row page ID and the exact `Mood` select value.
- Unauthorized / object not found: check the integration token and that the integration is connected to both resources.
- `No tasks selected`: the app is running, but no task has been chosen for Today.
- A document changed but Muse did not: update the structured Notion fields; this release has no automatic document parser or document-to-Notion writer.

No real tokens or workspace IDs are included in the repository. [Manual integration test](INTEGRATION-TEST.md).
