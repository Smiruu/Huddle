import axios from "axios";
import { REGISTER, REFRESH, LOGIN} from "../constants/authPaths";

export const registerUser = async (email, password, username) =>{
    
    const response = await axios.post(REGISTER,
        {email, password, username}
    );

    return response.data;
}

export const loginUser = async (email, password) => {
    const response =  await axios.post(LOGIN,
        {email, password}, {withCredentials: true}
    );

    return response.data;
}

export const refreshToken = async() => {
    const response = await axios.get(REFRESH, {
        withCredentials: true,
    })

    return response.data;
}