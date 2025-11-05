import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";
import columnsSlice from "./slices/columnsSlice";
import dataSlice from "./slices/dataSlice";
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key:"columns",
    storage,
    whitelist:["columns"]
}

const rootReducer = combineReducers({
    ui:uiSlice,
    columns: persistReducer(persistConfig,columnsSlice),
    data: dataSlice
})


export const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
