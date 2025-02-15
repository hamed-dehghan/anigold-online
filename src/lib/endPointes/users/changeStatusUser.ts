import axiosInstance from "../axiosInstance";

export const ChangeStatusUser = async(body) => {
    const config = {
        method:'POST',
        url: '/administration/user/updateuserstatus',
        data:body,
    }
    const response = await axiosInstance(config)
    return response
}