# CSS Outline Toggle Extension

A simple Chrome extension to visually highlight and debug HTML elements on a webpage by applying distinctive colored outlines.

## 🚀 Features

- Popup UI to toggle outlines on the current tab with one click.
- Per-tag controls: enable/disable each tag and pick its color from a
  color picker.
- Adjustable outline width (1–5 px) and choice between `outline` and
  `border` rendering.
- Settings are saved to `chrome.storage.sync` so they follow your
  Chrome profile.
- Per-tab activation: turning outlines on in one tab does not affect
  other tabs.
- `ON` badge on the toolbar icon while outlines are active.
- State is automatically cleared when the tab navigates or is closed.
- "Reset defaults" button to restore the original color palette.

## 🎨 Default Element Colors

| Element     | Default color |
|-------------|---------------|
| `div`       | `#d94e4e` Red |
| `section`   | `#0000ff` Blue |
| `header`    | `#008000` Green |
| `footer`    | `#2b0080` Purple |
| `article`   | `#ffa500` Orange |
| `nav`       | `#a52a2a` Brown |
| `span`      | `#ffc0cb` Pink |
| `a`         | `#ffff00` Yellow |
| `p`         | `#008080` Teal |
| `img`       | `#ee82ee` Violet |
| `h1`–`h6`   | `#00ffff` Cyan |

All colors are rendered with a fixed alpha of ~0.65 so the underlying
page stays readable.

## 🛠 How it works

The popup builds a CSS rule set from your settings and injects it into
the active tab via `chrome.scripting.insertCSS`. The previously
injected CSS is removed via `chrome.scripting.removeCSS` whenever you
toggle a setting or turn outlines off. Per-tab activation state is
persisted in `chrome.storage.session` so it survives the service
worker being terminated; user settings live in `chrome.storage.sync`.

## 🖥 Installation

1. Clone or download the repository.
2. Go to `chrome://extensions` in your Chrome browser.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extension folder.

## ⚡️ Usage

- Click the extension icon to open the popup.
- Use the master switch in the header to toggle outlines on/off for
  the current tab.
- Toggle individual tags, tweak their color, change the width, or
  switch between `outline` and `border`.
- The icon shows an `ON` badge while outlines are active.

## 📂 Project Structure

```
.
├── background.js   # Service worker: per-tab state cleanup
├── popup.html      # Popup UI markup
├── popup.css       # Popup UI styling
├── popup.js        # Popup logic: settings, CSS build, inject/remove
├── manifest.json   # MV3 manifest
├── icon.png        # Toolbar icon
└── README.md
```

## 📜 License

MIT © [tnmod](https://github.com/tnmod)

