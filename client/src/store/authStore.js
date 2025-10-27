import {create} from "zustand";
import { registerUser, loginUser, refreshToken } from "../api/authApi";

export const useAuthStore = create((set) => ({
    //INITIAL STATES
    user: null,
    isAuthenticated: false,
    token: null,
    authLoading: false,
    error: null,

    //ACTIONS

    loginUser: (email, password) => {
        set({authLoading: true});
        try {
            const data = loginUser(email,password);

            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                authLoading: false,

            })
        } catch (error) {
            console.error("Login Error:", error.message);
            set({error: error.message, authLoading: false});
        }
    },
}))