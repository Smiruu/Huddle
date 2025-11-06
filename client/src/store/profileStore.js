// store/profileStore.js
import { create } from "zustand";
import { editUsername, editProfilePic } from "../api/profileApi";
import { useAuthStore } from "./authStore";

export const useProfileStore = create((set) => ({
    //INITIAL STATES
  isProfileUpdating: false,
  profileError: null,

  updateUsername: async (newUsername) => {
    set({ isProfileUpdating: true, profileError: null });
    try {
      await editUsername(newUsername);

      await useAuthStore.getState().checkAuth();

      set({ isProfileUpdating: false });
    } catch (error) {
      set({ profileError: error.message, isProfileUpdating: false });
    }
  },

  updateProfilePicture: async (file) => {
    set({ isProfileUpdating: true, profileError: null });
    try {
        await editProfilePic(file);

      await useAuthStore.getState().checkAuth();

      set({ isProfileUpdating: false });
    } catch (error) {
      set({ profileError: error.message, isProfileUpdating: false });
    }
  },
}));
