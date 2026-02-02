# Aideam - AI IDE Account Manager

<div style="text-align:center"><img width="256" height="256" alt="logo" src="./public/logo.png" /></div>

<p style="text-align:center">Aideam is an Electron desktop application for managing AI tool accounts (Cursor & Windsurf).</p>

## Screenshot

<img width="1266" height="943" alt="image" src="https://github.com/user-attachments/assets/bc15de56-dd2b-4cda-9ea7-a90c033af0b7" />

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

- Unified table for managing both Cursor and Windsurf accounts.
- Account tiers: **Free**, **Trial**, and **Limited**.
- Expiration date tracking for non-free tiers with automatic downgrade to Free when the limit passes.
- **Used** field to track trial usage and prevent re-conversion to trial status.
- **Provider** field (optional) to account source.
- Modal-based form for creating and editing accounts.
- Advanced filtering by tool, status, and used status.
- Configurable pagination (5, 10, 20, 25, 50, 100 items per page).
- Copy-to-clipboard functionality for email, password, and provider fields.
- Responsive design with scrollable modals for mobile devices.
- SweetAlert2 success toasts on add, update, and delete operations.
- Bilingual UI (Persian/English) powered by `vue-i18n`, including automatic RTL/LTR direction and locale-aware typography.
- State persisted in desktop `accounts.json`/`settings.json` via Electron IPC, with browser fallback to `localStorage` for both accounts and preferences (e.g., language).

## Project Structure

```
src/
├── components/
│   ├── AccountCard.vue          # Table row, actions, detail modal trigger
│   ├── AccountDetailsModal.vue  # Account details with copy-to-clipboard
│   ├── AccountForm.vue          # Create/update form
│   ├── AccountFormModal.vue     # Modal wrapper for account form
│   ├── AccountList.vue          # Unified table with filters and pagination
│   ├── BaseModal.vue            # Reusable modal component
│   └── Pagination.vue           # Standalone pagination component
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

**Made by vibe coding with ❤️ by [Sadegh](https://github.com/sadegh19b)**
