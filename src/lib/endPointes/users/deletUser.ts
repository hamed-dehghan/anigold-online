import axiosInstance from "../axiosInstance"

export const DeleteUser = async (body) => {
    const config = {
        method: 'POST',
        url: "administration/user/deleteuser",
        data: body
    }
    const response = await axiosInstance(config)
    return response
}