import { createSlice } from "@reduxjs/toolkit";
import { User, Entry } from "../types";

type initialState = {
    user: User | null,
    token: string | null,
    entries: Entry[]
}

const initialState: initialState = {
    user: null,
    token: "",
    entries: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setEntries: (state, action) => {
            state.entries = action.payload.entries;
        },
    },
});

export type RootState = ReturnType<typeof authSlice.reducer>

export const { setEntries, setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;