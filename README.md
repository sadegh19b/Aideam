# AI IDE Accounts Manager

A Vue 3 + Vite single-page application for managing AI tool accounts (Cursor & Windsurf) with Tailwind CSS styling and optional Electron desktop packaging.

## Screenshot

<img width="1495" height="911" alt="image" src="https://github.com/user-attachments/assets/1ef41f0b-eea8-4d4d-a16a-0579a7ed6577" />

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
- SweetAlert2 success toasts on add and update operations.
- State persisted in `localStorage`, so data survives reloads (per device).

## Project Structure

```
src/
├── components/
│   ├── AccountCard.vue      # Table row, actions, detail modal trigger
│   ├── AccountDetail.vue    # Detail modal
│   ├── AccountForm.vue      # Create/update form
│   └── AccountList.vue      # Table wrapper per tool
├── composables/
│   └── useAccounts.js
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
- [Tailwind CSS](https://tailwindcss.com/)
- [SweetAlert2](https://sweetalert2.github.io/) for notifications
- [Electron](https://www.electronjs.org/) + [electron-builder](https://www.electron.build/) for desktop builds
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font for RTL typography
- Browser `localStorage` for persistence

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by [Sadegh](https://github.com/sadegh19b)**
