# Obsidian Vault Statistics Plugin

Status bar item with vault statistics including the number of notes, files, attachments, and links.

## Usage

After the plugin is installed and enabled you will see a new item appear in the status bar showing you the number of notes in your vault.

- Click on the status bar item to cycle through the available statistics.
- Hover over the status bar item to see all of the available statistics.

## Advanced Usage

### Showing All Statistics

All statistics can be shown by creating and enabling a CSS snippet with the following content.

```css
/* Show all vault statistics. */
.obsidian-vault-statistics--item {
    display: initial !important;
}
```

### Showing Selected Statistics

Similarly to the above, one can show certain statistics using a similar method to the above.  Below is a snippet that hides all by the notes and attachments statistics.  The snippet can be modified to include more or different statistics.

``` css
/* Hide all statistics. */
.obsidian-vault-statistics--item {
    display: none !important;
}

/* Always show the notes and attachments statistics. */
.obsidian-vault-statistics--item-notes,
.obsidian-vault-statistics--item-attachments {
    display: initial !important;
}
```

## Development

Requires Node.js 18 or newer.

```bash
npm install      # install dependencies
npm run dev      # rebuild main.js on every change
npm test         # run the unit tests
npm run deploy   # build and copy the plugin into a vault
```

`npm run deploy` copies `main.js`, `manifest.json` and `styles.css` into `.sandbox/.obsidian/plugins/obsidian-vault-statistics-plugin` by default. To deploy into a real vault, create an untracked `deploy.local.json` with the plugin folder of that vault (see `deploy.local.example.json`) or set the `PLUGIN_DIR` environment variable.

## Releasing

`main.js` is a build artifact and is never committed: releases are built and published by GitHub Actions.

1. `npm version patch` (or `minor` / `major`) — bumps `package.json`, then `manifest.json` and `versions.json` through the `version` script, and creates the commit and tag.
2. `git push --follow-tags` — pushes the commit and the tag.

The tag starts `.github/workflows/release.yml`, which runs the tests, builds the plugin, verifies that the tag matches `manifest.json`, and attaches `main.js`, `manifest.json` and `styles.css` to the release. BRAT and Obsidian read the plugin from those assets.

Tags must be plain `x.y.z` (no `v` prefix) so that they match the manifest version.

## Version History

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [Unreleased]

- Added
- Changed
- Deprecated
- Removed
- Fixed
  - Comment sections are explicitly processed and do not count toward statistics (#22)

### [0.1.3] - 2022-10-25

- Fixed
  - Fixed issue with deleted and renamed files not correctly updating file statistics (#17)
  - Removed errant `debugger` statement (#14)

### [0.1.2] - 2022-08-05

- Added
  - Added Settings pane
- Changed
  - Users can now optionally show all or a subset of metrics instead of the default click-to-cycle behaviour (#6)

### [0.1.1] - 2022-08-05

- Fixed
  - Fixed issue when processing files with admonitions (#12)

### [0.1.0] - 2021-12-30

- Added
  - Added word count metric (#8)

### [0.0.8] - 2021-12-18

- Added
  - Initial support for displaying multiple statistics at the same time. (#6)

### [0.0.6] - 2021-12-14

- Fixed
  - FIXED: Reported values only contain 2 significant digits (#7)

### [0.0.5] - 2021-12-12

- Changed
  - Displayed statistics are formatted with grouping for increase readability.
  - Added Vault Size statistic which calculates the total size of all files in the vault that are understood by Obsidian  The display value is scaled to the appropriate unit.  (#5)

### [0.0.4] - 2021-02-25

- Fixed
  - Statistics will be calculated automatically as soon as the plugin loads.
