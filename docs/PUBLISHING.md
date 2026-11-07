# Publish the friend-testing preview

The public download route is **GitHub Releases**, not the expiring Actions artifacts. The repository README links directly to the installer, portable EXE and pre-release notes. Friends do not need to run a workflow or download the source code.

## v0.5.5 publication

Run **Actions → Publish friend-testing preview → Run workflow** on `main` once. This workflow deliberately publishes only the already tested v0.5.5 binaries:

- Windows build run: `42337004089`.
- Source commit: `b9ed47a2f18f61b96cbcf02d2feb5998ef4f8491`.
- Artifact: `Muse-Desktop-Windows-unsigned`.

It verifies the successful source build, downloads the two executables, creates SHA256 checksums, and publishes a GitHub **pre-release** tagged `v0.5.5`. It does not rebuild, sign or modify the executables. It uses only a temporary repository-scoped Actions token; no personal token or signing secret is needed.

If automatic creation is rejected by GitHub permissions, a maintainer can create the pre-release in the GitHub UI with target commit `b9ed47a2f18f61b96cbcf02d2feb5998ef4f8491`, the notes in `docs/releases/v0.5.5.md`, and no assets, then run the workflow again. The workflow can attach the verified files only to a published pre-release with the exact matching tag commit and zero existing assets. It refuses to replace any previously published assets. Future releases should update the pinned build run, source commit, version, filenames and release notes after their own successful checks.

## Before promoting a stable release

- Complete fresh-install and upgrade checks on real Windows computers.
- Complete the live Notion and conversation-route checks in [INTEGRATION-TEST.md](INTEGRATION-TEST.md).
- Confirm the first-run experience works for someone else's workspace.
- Choose an open-source license if offering open-source reuse rights.
- Establish a code-signing and update strategy; publishing on GitHub alone does not sign an EXE or remove reputation warnings.
