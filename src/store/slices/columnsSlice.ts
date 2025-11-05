import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TableColumn = {
  key: string; // col id
  label: string; // display name
  visible: boolean;
};

export type ColumnsState = {
  columns: TableColumn[];
};

export const DEFAULT_COLUMNS: TableColumn[] = [
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "age", label: "Age", visible: true },
  { key: "role", label: "Role", visible: true },
];

const initialState: ColumnsState = {
  columns: DEFAULT_COLUMNS,
};

type AddColumnPayload = { key: string; label: string };

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    toggleVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find((c) => c.key === action.payload);
      if (column) column.visible = !column.visible;
    },
    setVisibility: (
      state,
      action: PayloadAction<{ key: string; visible: boolean }>
    ) => {
      const column = state.columns.find((c) => c.key === action.payload.key);
      if (column) column.visible = action.payload.visible;
    },
    addColumn: (state, action: PayloadAction<AddColumnPayload>) => {
      const exists = state.columns.some((c) => c.key === action.payload.key);
      if (!exists) {
        state.columns.push({
          key: action.payload.key,
          label: action.payload.label,
          visible: true,
        });
      }
    },
    resetToDefaults: (state) => {
      state.columns = DEFAULT_COLUMNS;
    },
  },
});

export const { toggleVisibility, setVisibility, addColumn, resetToDefaults } = columnsSlice.actions;
export default columnsSlice.reducer;


