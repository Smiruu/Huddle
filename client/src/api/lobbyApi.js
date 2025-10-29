import apiClient from "./apiClient";
import { CREATELOBBY } from "../constants/lobbyPaths";

export const createHuddle = async (name, description, userId, game, skillLevel) => {
    
    const response = await apiClient.post(CREATELOBBY, {
        name, description, userId, game, skillLevel
    })

    return response;
}