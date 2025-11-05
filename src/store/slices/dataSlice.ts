import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type RowRecord = Record<string, string | number | null> & {
  id: string;
};

export type DataState = {
  rows: RowRecord[];
};

const seedRows: RowRecord[] = [
  { id: nanoid(), name: "Alice", email: "alice@example.com", age: 28, role: "Admin" },
  { id: nanoid(), name: "Bob", email: "bob@example.com", age: 34, role: "User" },
  { id: nanoid(), name: "Carol", email: "carol@example.com", age: 25, role: "Manager" },
  { id: nanoid(), name: "Dan", email: "dan@example.com", age: 42, role: "User" },
];

const initialState: DataState = {
  rows: seedRows,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addRow: {
      reducer: (state, action: PayloadAction<RowRecord>) => {
        state.rows.unshift(action.payload);
      },
      prepare: (values: Omit<RowRecord, "id">) => ({
        payload: { ...values, id: nanoid() },
      }),
    },
    updateRow: (state, action: PayloadAction<RowRecord>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id);
      if (index >= 0) state.rows[index] = action.payload;
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((r) => r.id !== action.payload);
    },
    setRows: (state, action: PayloadAction<RowRecord[]>) => {
      state.rows = action.payload;
    },
    importRows: (
      state,
      action: PayloadAction<{ rows: Array<Record<string, string>> }>
    ) => {
      const incoming = action.payload.rows.map((r) => ({ id: nanoid(), ...r }));
      state.rows = incoming as RowRecord[];
    },
  },
});

export const { addRow, updateRow, deleteRow, setRows, importRows } = dataSlice.actions;
export default dataSlice.reducer;


