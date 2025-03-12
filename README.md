# CSS Outline Toggle Extension

A simple Chrome extension to visually highlight and debug HTML elements on a webpage by applying distinctive colored outlines.

## 🚀 Features

- Quickly toggle CSS outlines for HTML elements.
- Color-coded outlines for easy distinction:
  - `div`: Green
  - `section`: Blue
  - `header`: Green
  - `footer`: Dark Purple
  - `p`: Teal
  - `a`: Yellow
  - and more!

## 🎨 Supported Elements & Colors

| Element | Color                          |
|---------|--------------------------------|
| `div`   | rgba(0,0,0, 0.65) (Black)      |
| `section`| rgba(0,0,255, 0.65) (Blue)     |
| `header`| rgba(0,128,0, 0.68) (Green)    |
| `footer`| rgba(43,0,128, 0.78) (Purple)  |
| `span`  | rgba(255,192,203, 0.66) (Pink) |
| `a`     | rgba(255,255,0, 0.62) (Yellow) |
| `p`     | rgba(0,128,128, 0.71) (Teal)   |
| `header`| rgba(0,128,0, 0.68) (Green)    |
| `footer`| rgba(43,0,128, 0.78) (Purple)  |
| `header`| rgba(0,128,0, 0.68) (Green)    |

## 🛠 How it works

The extension injects CSS styles directly into the webpage:

- Toggle the outlines ON to visually identify elements.
- Toggle the outlines OFF to remove them instantly.

## 🖥 Installation

1. Clone or download the repository.
2. Go to `chrome://extensions` in your Chrome browser.
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select the extension folder.

## ⚡️ Usage

- Activate the extension by clicking its icon.
- Toggle the CSS outlines using the provided button in the extension popup.

## 📂 Project Structure

```
.
├── content.js
├── manifest.json
├── popup.html
└── README.md
```

## 📜 License

MIT © [tnmod](https://github.com/tnmod)

