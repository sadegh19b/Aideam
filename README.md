# Aideam - AI IDE Account Manager

<img width="256" height="256" alt="logo" src="./public/logo.png" />

Aideam is an Electron desktop application for managing AI tool accounts (Cursor & Windsurf).

## Screenshot

<img width="1266" height="813" alt="image" src="https://github.com/user-attachments/assets/57be8ac1-3c2d-4139-a285-c25772f1c01c" />

## Getting Started

```bash
npm install
npm run dev          # Vite hot reload in the browser
npm run dev:electron # Electron app (requires npm run dev running in another terminal)
```

### Build Targets

| Target            | Command                 | Output                               |
| ----------------- | ----------------------- | ------------------------------------ |
| Static Web Bundle | `npm run build`         | Production assets inside `dist/`     |
| Desktop App       | `npm run build:desktop` | Electron installer inside `release/` |

## Features

- Separate boards for Cursor and Windsurf accounts.
- Account tiers: **Free**, **Trial**, and **Limited**.
- Expiration date tracking for non-free tiers with automatic downgrade to Free when the limit passes.
- Inline editing with cancel/reset support.
- SweetAlert2 success toasts on add, update, and delete operations.
- Bilingual UI (Persian/English) powered by `vue-i18n`, including automatic RTL/LTR direction and locale-aware typography.
- State persisted in desktop `accounts.json`/`settings.json` via Electron IPC, with browser fallback to `localStorage` for both accounts and preferences (e.g., language).

## Project Structure

```
src/
├── components/
│   ├── AccountCard.vue          # Table row, actions, detail modal trigger
│   ├── AccountDetailsModal.vue
│   ├── AccountForm.vue          # Create/update form
│   ├── AccountList.vue          # Table wrapper per tool
│   └── BaseModal.vue
├── composables/
│   ├── useAccounts.js           # desktop/local storage bridge for accounts
│   ├── useSettings.js           # desktop/local storage bridge for preferences
│   └── useDirection.js          # computed RTL/LTR helpers bound to locale
├── locales/
│   ├── en.json
│   └── fa.json
├── plugins/
│   └── i18n.js                  # vue-i18n setup
├── App.vue
├── main.js
└── style.css

electron/
├── main.js        # Electron main process (BrowserWindow lifecycle)
└── preload.js     # Safe bridge exposed to the renderer
```

## Tech Stack

- [Vue 3](https://vuejs.org/) with `<script setup>`
- [Vite](https://vitejs.dev/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [vue-i18n](https://vue-i18n.intlify.dev/) for localization
- [SweetAlert2](https://sweetalert2.github.io/) for notifications
- [Electron](https://www.electronjs.org/) + [electron-builder](https://www.electron.build/) for desktop builds
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font for persian Language (RTL typography)
- Electron file storage (`data/accounts.json`, `data/settings.json`) with browser `localStorage` fallback

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by [Sadegh](https://github.com/sadegh19b)**
