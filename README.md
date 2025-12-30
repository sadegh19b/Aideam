# AI IDE Accounts Manager

Single-page app for managing AI tool accounts (Cursor & Windsurf).

## Getting Started

```bash
npm install
npm run dev
```

Visit the Vite dev server URL printed in the terminal.

## Features

- Manage separate lists for Cursor and Windsurf accounts.
- Three account tiers: **Free**, **Trial**, **Limited**.
- Optional expiry date for non-free tiers with automatic downgrade to Free after the due date.
- Inline editing with highlighted rows and cancel/reset behavior.
- Detail modal for each account and contextual success alerts (SweetAlert2) on add/update.
- State persisted in `localStorage`, so data survives page reloads.

## Project Structure

```
src/
├── components/
│   ├── AccountCard.vue      # Table row, actions, detail modal trigger
│   ├── AccountDetail.vue    # Detail modal
│   ├── AccountForm.vue      # Create/update form
│   └── AccountList.vue      # Table wrapper per tool
├── composables/
│   └── useAccounts.js       # Centralized state & CRUD helpers
├── App.vue                  # Layout + orchestration
├── main.js                  # Entry point
└── style.css                # Tailwind base styles
```

## Tech Stack

- [Vue 3](https://vuejs.org/) with `<script setup>`
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SweetAlert2](https://sweetalert2.github.io/) for notifications
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font for RTL typography
- Browser `localStorage` for persistence

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by [Sadegh](https://github.com/sadegh19b)**
