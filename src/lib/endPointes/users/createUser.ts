import axiosInstance from "../axiosInstance";

export const CreateUser = async(body) => {
    const config = {
        method:'POST',
        url: 'administration/user/adduser',
        data:body,
    }
    const response = await axiosInstance(config)
    return response
}