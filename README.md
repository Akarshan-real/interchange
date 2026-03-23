# Interchange 🔄

> Sync play/pause between two media tabs — YouTube, YouTube Music, and Spotify.

![Interchange Extension](https://img.shields.io/badge/Chrome-Extension-blue?style=flat-square&logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## What is Interchange?

Ever had YouTube open in one tab and Spotify in another? Interchange lets you sync their play/pause states automatically.

**Pause one tab → the other starts playing.**  
**Resume it → the other pauses.**

No more manually switching between tabs to manage your media.

---

## Features

- 🎬 Works with **YouTube**, **YouTube Music**, and **Spotify**
- 🔄 Automatic play/pause sync between two tabs
- 💾 Remembers your selected tabs across popup open/close
- 🔴 Live tab info — shows current video/song title and favicon
- 🗑️ Auto-removes tab from extension when closed
- 🧹 Clears state on browser restart
- ⚡ Toggle the extension on/off without removing tabs

---

## How it Works

1. Open two media tabs (e.g. YouTube + Spotify)
2. Click the Interchange icon in your toolbar
3. Click **"Add current tab"** for each tab
4. Turn the extension **On**
5. Pause one tab — the other plays automatically!

---

## Installation

### For Regular Users (No coding required)

1. Download or clone this repository
2. Run the following commands:
```bash
git clone https://github.com/Akarshan-real/interchange.git
cd interchange
npm install
npm run build
```
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer Mode** (top right toggle)
5. Click **Load Unpacked**
6. Select the `dist` folder inside the project
7. Done! Pin Interchange to your toolbar and enjoy.

---

### For Developers

```bash
git clone https://github.com/Akarshan-real/interchange.git
cd interchange
npm install
```

**Development (watch mode):**
```bash
npm run build -- --watch
```

Then load the `dist` folder as an unpacked extension in `chrome://extensions`. Reload the extension after each build.

**Production build:**
```bash
npm run build
```

---

## Tech Stack

- **React + Vite** — Popup UI
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Chrome Extension Manifest V3** — Extension architecture
- **Chrome APIs used:** `tabs`, `storage`, `runtime`, `scripting`

---

## Project Structure

```
interchange/
├── public/
│   ├── background.js       # Service worker — coordinates between tabs
│   ├── contentScript.js    # Injected into YouTube/Spotify pages
│   ├── manifest.json       # Extension configuration
│   └── icon/               # Extension icons
├── src/
│   ├── App.jsx             # Popup UI
│   └── main.jsx            # React entry point
├── popup.html              # Popup HTML entry
└── vite.config.js          # Vite configuration
```

---

## Supported Sites

| Site | Status |
|------|--------|
| YouTube | ✅ Supported |
| Spotify Web Player | ✅ Supported |
| YouTube Music | ✅ Supported |
| Netflix | 🔜 Coming soon |
| Amazon Prime | 🔜 Coming soon |

---

## Contributing

Pull requests are welcome! If you find a bug or want to add support for a new site, feel free to open an issue or PR.

---

## Author

**Akarshan** — [GitHub](https://github.com/Akarshan-real)

---

## License

MIT License — feel free to use, modify and distribute.