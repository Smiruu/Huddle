import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { createHuddle as createHuddleApi } from "../api/lobbyApi";

export const useHuddle = () => {
    const [huddleLoading, setHuddleLoading] = useState(false)
    const [huddleError, setHuddleError] = useState(null);

    const navigate = useNavigate();
    const token =  useAuthStore((state) => state.token);
    const userId = useAuthStore((state) => state.user.id)


     /**
   * Creates a new huddle, handles loading/error states,
   * and navigates to the new lobby on success.
   * @param {object} huddleDetails - Details for the new huddle.
   * @param {string} huddleDetails.name - The name for the new huddle.
   * @param {string} [huddleDetails.description] - Optional description.
   * @param {function} onSuccess - Optional callback to run on success (e.g., close modal).
   */
    const createHuddle = async ({name, description, game, skillLevel }, onSuccess = () => {}) => {
        
        
        if(!token || !userId) {
            setHuddleError('You are not logged in')
            return;
        }

        setHuddleLoading(true)
        try {
            const response = await createHuddleApi(name, description, userId, game, skillLevel);

            const newHuddle = response.data;
            
            onSuccess();

            navigate(`/lobby/${newHuddle.lobby.id}`);

        } catch (err) {
            console.error(err);
            setHuddleError("Failed to create huddle. Please try again")
        } finally {
            setHuddleLoading(false)
        }
    }

    const clearHuddleError = () => setHuddleError(null);

    return { huddleLoading, huddleError, createHuddle, clearHuddleError };

}