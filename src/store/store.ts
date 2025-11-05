import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";
import columnsSlice from "./slices/columnsSlice";
import dataSlice from "./slices/dataSlice";

const rootReducer = combineReducers({
    ui:uiSlice,
    columns: columnsSlice,
    data: dataSlice
})

export const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
