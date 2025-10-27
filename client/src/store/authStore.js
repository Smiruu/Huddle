import {create} from "zustand";
import { registerUser, loginUser, refreshToken } from "../api/authApi";

export const useAuthStore = create((set) => ({
    //INITIAL STATES
    user: null,
    isAuthenticated: false,
    token: null,
    authLoading: false,
    authError: null,
    isCheckingSession: true,

    //ACTIONS

    checkAuth: async() => {
        
        try {
            const data = await refreshToken();
            set({
                user: data.user,
                token: data.access_token,
                isAuthenticated: true,
                isCheckingSession: false,
            }) 
        } catch (error) {
            console.error("Auth check error:", error.message);
            set({isCheckingSession: false});
        }
    },

    registerUser: async (email, password, username) => {
        set({authLoading: true});
        try{
            await registerUser(email, password, username);
            set({authLoading: false});
            return true;
        } catch (error){
            console.error("Login Error:", error.message);
            set({authError: error.message, authLoading: false});
        }
    },

    loginUser: async (email, password) => {
        set({authLoading: true});
        try {
            const data = await loginUser(email,password);

            set({
                user: data.user,
                token: data.access_token,
                isAuthenticated: true,
                authLoading: false,

            })
        } catch (error) {
            console.error("Login Error:", error.message);
            set({authError: error.message, authLoading: false});
        }
    },

    logoutUser: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },
}))