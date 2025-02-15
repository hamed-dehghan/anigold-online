import axiosInstance from "../axiosInstance"

export const UpdateUsers = async (body) => {
    const config = {
        method: 'POST',
        url: 'administration/user/updateuser',
        data: body,
    }
    const response = await axiosInstance(config)
    return response
}