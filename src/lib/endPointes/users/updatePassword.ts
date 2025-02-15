import axiosInstance from "../axiosInstance"

export const UpdatePassword = async (body) => {
    const config = {
        method: 'POST',
        url: 'administration/user/updateuserpassword',
        data: body,
    }
    const response = await axiosInstance(config)
    return response
}