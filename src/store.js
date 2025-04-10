'use client'

import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'; // Changed import
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage"
import {composeWithDevTools} from "redux-devtools-extension"

const initialState = {};
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const middlewareArray = [thunkMiddleware]; // Using thunkMiddleware
const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewareArray))
);
let persistor = persistStore(store)
export {store, persistor};
