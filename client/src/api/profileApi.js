import apiClient from "./apiClient";
import { EDITPROFILEPICTURE, EDITUSERNAME } from "../constants/profilePaths";


export const editUsername = async (username) => {

    const response = await apiClient.put(EDITUSERNAME, {username} )

    return response
}

export const editProfilePic = async (file) => {

    const formData = new FormData()

    formData.append("picture", file)
    const response = await apiClient.post(EDITPROFILEPICTURE, formData)
    return response
}