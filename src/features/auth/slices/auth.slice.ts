import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InitialState = {
  isAuthenticated: boolean;
  user: null | {
    name?: string;
    email?: string;
    role?: string;
    id?: string;
  };
};

const initialState: InitialState = {
  isAuthenticated: false,
  user: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthStates: function (state, action: PayloadAction<InitialState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    logout: function (state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
