import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";

const rootReducer = combineReducers({
    ui:uiSlice
})

export const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
