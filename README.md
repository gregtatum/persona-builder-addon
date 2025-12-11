# Persona Builder

Build a Firefox Persona with browser history, and snapshots of HTML.

## Using the addon

[Install the latest addon from the releases page](https://github.com/gregtatum/persona-builder-webext/releases) by clicking the .xpi file. A default persona will be created, and you can add pages to the persona by opening the addon, and clicking "Capture Page". This adds it to the persona's history and saves an HTML snapshot of the page. Alternately you can hit F2 while browsing.

You can view all of the personas you have saved from the addon's dedicated personas page. Click the "View Personas" button. From there you can manually edit the history, insights, and export a zip file of the persona. Zip files can also be loaded in by dragging it onto the options page, or importing it.

## Developing this addon

To get started run the following:

```sh
npm install
# Point to your Firefox
export FIREFOX_BIN="/Applications/Firefox.app/Contents/MacOS/firefox"
npm run start
```

Note that because the addon is installed as a temporary addon, your data will be lost when you make changes and the addon does live reloading.

## Dev commands

| Command | Description |
| --- | --- |
| `npm run start` | Launch the extension with `web-ext run`; set `FIREFOX_BIN` to a specific Firefox binary if needed |
| `npm run lint` | Lint the extension with `web-ext lint` |
| `npm run test` | Run Jest tests |
| `npm run ts` | Type-check with TypeScript |
| `npm run release` | Bump version, sync manifest, sign, tag, and publish release (needs AMO credentials) |

## Releasing

The addon is signed [as an unlisted addon](https://addons.mozilla.org/en-US/developers/addon/5cf4894eb64a4d3c9e26/edit). Run `npm run release` to perform an automated release.
