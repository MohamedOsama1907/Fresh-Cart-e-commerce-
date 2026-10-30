import { authReducer, InitialState } from "@/features/auth/slices/auth.slice";
import { configureStore } from "@reduxjs/toolkit";

export type preloadedState = {
  authReducer: InitialState;
};

export function createStore(preloadedState: preloadedState) {
  const myStore = configureStore({
    reducer: {
      authReducer,
    },
    preloadedState,
  });
  return myStore;
}

// TODO :- I don't understand this 
export type appStore = ReturnType<typeof createStore>;
export type appState = ReturnType<appStore["getState"]>;
