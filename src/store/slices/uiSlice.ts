import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export type SortOrder = "asc" | "desc" | null;

export type UiState = {
  searchQuery: string;
  sortBy: string | null;
  sortOrder: SortOrder;
  page: number;
  rowsPerPage: number;
  themeMode: "light" | "dark";
};

const initialState:UiState ={
    searchQuery:"",
    sortBy:null,
    sortOrder: null,
    page:0,
    rowsPerPage:10,
    themeMode:"light"
}

const uiSlice = createSlice({
    name:"ui",
    initialState,
    reducers:{
        setSearchQuery : (state,action:PayloadAction<string>) =>{
            state.searchQuery = action.payload;
            state.page = 0
        },
        setSort: (state,action:PayloadAction<{sortBy:string;sortOrder:SortOrder}>)=>{
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder
        },
        toggleSort:(state,action:PayloadAction<string>)=>{
            if (state.sortBy !== action.payload){
                state.sortBy = action.payload
                state.sortOrder = "asc"
            }else{
                state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc" 
            }
        },
        setPage: (state, action: PayloadAction<number>) => {
          state.page = action.payload;
    },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
        state.rowsPerPage = action.payload;
        state.page = 0;
        },
        toggleThemeMode: (state) => {
        state.themeMode = state.themeMode === "light" ? "dark" : "light";
        },
    }
})

export const { setSearchQuery, setSort, toggleSort, setPage, setRowsPerPage, toggleThemeMode } = uiSlice.actions;
export default uiSlice.reducer