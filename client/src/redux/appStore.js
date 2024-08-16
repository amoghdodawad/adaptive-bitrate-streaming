import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const combinedReducer = combineReducers({
    user: userReducer.reducer
});

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig,combinedReducer);

export const store = configureStore({
    reducer : persistedReducer,
});

export const persistor = persistStore(store);