import axiosInstance from "../axiosInstance"

export const GetAllUsers = async() =>{
    const config = {
        url:`administration/user/getalluser`
    }
    return await axiosInstance(config)
}