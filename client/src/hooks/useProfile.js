// hooks/useProfile.js
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";

const { updateUsername, updateProfilePicture } = useProfileStore.getState();

export const useProfile = () => {
  // 3. Get the profile data
  const profile = useAuthStore((state) => state.profile);

  // 4. Select ONLY the changing state and use shallow
  const { isProfileUpdating, profileError } = useProfileStore()

  // --- 5. All the display logic from before ---
  let displayPictureUrl;
  const placeholderBase = "https://placehold.co/100x100/111827/FF7A59?text=";

  if (profile) {
    if (profile.avatar_url) {
      displayPictureUrl = profile.avatar_url;
    } else {
      const initial = profile.username?.charAt(0)?.toUpperCase() || "?";
      displayPictureUrl = `${placeholderBase}${initial}`;
    }
  } else {
    displayPictureUrl = `${placeholderBase}?`;
  }
  // --- End of display logic ---

  // 6. Return the stable actions and the reactive state
  return {
    profile,
    isProfileUpdating,
    error: profileError,
    displayPictureUrl,
    updateUsername, // The stable action
    updateProfilePicture, // The stable action
  };
};