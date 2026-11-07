# Publish a tested Muse preview

Public release files are hosted in **GitHub Releases**. Friends do not need Actions access, a GitHub account or developer tools.

1. Commit the new version, source, tests, documentation and release notes at `docs/releases/v<version>.md`.
2. Wait for the corresponding **Build Windows installers** run to pass, including the packaged Windows UI tests.
3. Run **Publish friend-testing preview** on `main`. Enter that successful build's numeric run ID and exact 40-character commit SHA.
4. The workflow checks the build status, workflow path, exact commit and package version, downloads the tested executable artifact, validates the two filenames, generates checksums and publishes a pre-release. It does not rebuild, sign or alter the binaries.

If GitHub rejects automatic tag / release creation, a maintainer can create a **pre-release** in the UI with the exact tested commit as the tag target and the prepared release notes, leaving the assets empty. Run the publisher again. It only attaches files if the existing release is a published pre-release with the exact matching commit and no existing assets. It never overwrites previously published binaries.

The workflow uses a temporary repository-scoped token. No personal token or signing credential is bundled. New version links in README must match the release filenames.

Before promoting a stable release, complete real installer / upgrade checks, live Notion desktop and conversation tests, cross-account setup, and the code-signing / update strategy. Choose an open-source license before promising open-source reuse rights.
