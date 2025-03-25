import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserData {
    userId: number;
    roleId: number;
}

interface AuthState {
    status: boolean;
    userData: UserData | null;
}

const initialState: AuthState = {
    status: false,
    userData: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserData>) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;