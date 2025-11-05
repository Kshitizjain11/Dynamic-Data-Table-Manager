Dynamic Data Table Manager
==========================

An interactive, client-side data table built with Next.js, Material UI, Redux Toolkit, and dnd-kit. It supports CSV import/export, inline editing with validation, visibility toggling, sorting, pagination, and smooth drag-and-drop column reordering.

### Features
- Search across all visible fields
- Column sorting (click headers)
- Pagination (client-side)
- Inline row editing with basic validation (e.g., Age numeric check)
- Add new columns dynamically
- Toggle column visibility and reset to defaults
- CSV import (auto-normalizes headers to keys) and export
- Drag-and-drop column reordering with animations (dnd-kit)
- Light/Dark theme toggle (MUI)

### Tech Stack
- Next.js App Router (React 18)
- Material UI (MUI 5)
- Redux Toolkit + React-Redux
- dnd-kit (sortable, core, utilities)
- Papa Parse (CSV parsing) & file-saver (CSV export)

Getting Started
---------------

Requirements: Node.js 18+

Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Project Structure
-----------------
```text
data_table_manager/
├── public/                          # Static assets
│   └── favicon.ico                  # App icon
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout: Redux + MUI providers, global CSS
│   │   └── page.tsx                 # Renders TableManager
│   ├── components/
│   │   └── TableManager.tsx         # Table UI: search/sort/pagination, edit, CSV, DnD
│   ├── providers/
│   │   ├── MuiProvider.tsx          # MUI theme + toggle
│   │   └── ReduxProvider.tsx        # Redux store provider
│   ├── store/
│   │   ├── slices/
│   │   │   ├── columnsSlice.ts      # DEFAULT_COLUMNS, visibility, reorderColumns
│   │   │   ├── dataSlice.ts         # importRows, updateRow, deleteRow
│   │   │   └── uiSlice.ts           # search, sort, pagination, theme
│   │   └── store.ts                 # Root store + RootState
│   └── styles/
│       └── globals.css              # Global styles
├── README.md                        # Documentation
├── package.json                     # Scripts and dependencies
├── tsconfig.json                    # TypeScript config
└── next.config.js                   # Next.js config (if present)
```

Usage Guide
-----------

### Search
Use the input at the top-left to filter rows by any visible field.

### Sorting
Click a column header to toggle sort. Sort indicator (▲/▼) appears on the active column.

### Pagination
The footer shows the current page and total rows. Page size defaults to 10.

### Edit Rows
- Double-click a row to enter edit mode, or click the edit icon in the Actions column.
- Fields become editable TextFields; validation messages appear inline.
- Click the Save icon in Actions to commit or Cancel to discard.

### Manage Columns
- Click the gear icon to open the Manage Columns dialog.
- Toggle column visibility via checkboxes.
- Add a column: enter a Field Key (e.g., "department") and optional Label; key will be normalized to `snake_case`.
- Reset Columns restores defaults.

### Column Reordering (Drag-and-Drop)
- Drag a column header horizontally to a new position.
- Animated preview appears while dragging.
- The new order persists in the Redux `columns` slice and updates immediately.

### CSV Import
- Click "Import CSV" and select a `.csv` file with headers.
- Headers are normalized to keys: lowercased, spaces -> underscores, `id` is ignored as an input field.
- Any new header fields are added as columns automatically and marked visible.

### CSV Export
- Click "Export CSV" to download the current dataset.
- Uses only visible column keys as fields.

Configuration & Customization
-----------------------------

Edit default columns in `src/store/slices/columnsSlice.ts` (`DEFAULT_COLUMNS`). Add or remove as needed.

Validation examples live in `TableManager.tsx` (`getCellError`). Extend this to enforce domain rules (e.g., email format).

Theming & UI
------------

The theme toggle button sits in the top-right corner. The current mode is stored in the Redux `ui` slice and injected via `MuiProvider`.

Development Scripts
-------------------
```bash
npm run dev       # start dev server
npm run build     # production build
npm run start     # run production server
```

Troubleshooting
---------------
- If drag-and-drop doesn’t work, ensure `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` are installed and that headers render inside `DndContext`/`SortableContext`.
- If CSV import fails, verify the first row contains headers and that the file is valid UTF-8.
- If styling looks off, confirm MUI is properly wrapped in `MuiProvider` and that `globals.css` is loaded in `app/layout.tsx`.

FAQ
---
**Can I persist user changes across reloads?**
Yes—wire the Redux store to localStorage or a backend. Columns order/visibility and data rows are already in Redux slices.

**How do I add server data?**
Fetch rows in a server route or client effect and dispatch to `dataSlice` (e.g., `importRows`).

License
-------
MIT
