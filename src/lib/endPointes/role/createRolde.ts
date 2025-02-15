import axiosInstance from "../axiosInstance"

export const  CreateRole= async(body) =>{
    const config = {
        method:'POST',
        url:`administrator/role/addrole`,
        data:body
    }
    return await axiosInstance(config)
}