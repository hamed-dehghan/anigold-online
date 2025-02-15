import axiosInstance from "../axiosInstance"

export const GetAllRole = async() =>{
    const config = {
        method:'POST',
        url:`administrator/role/getallrole`
    }
    return await axiosInstance(config)
}