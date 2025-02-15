import axiosInstance from "../axiosInstance";

export const LoginApi = async(body) => {
    const config = {
        method:'POST',
        url: 'client/auth/login',
        data:body,
    }
    const response = await axiosInstance(config)
    return response
}