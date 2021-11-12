import axios from "axios";
export const apiLogin = async (config) => {
    return await axios.post("/api/users/login", config)
}
export const apiRegister = async (userData) => {
    return await axios.post('/api/users', userData)
}
export const apiDeleteUser = async (_id, config) => {
    return await axios.delete(`/api/users/${_id}`, config)
}
export const apiGetAllUser = async (config) => {
    return await axios.get("/api/users/", config)
}
export const apiOneUser = async (configGet, id) => {
    return await axios.get(`/api/users/:${id}`, configGet)
}
export const apiUpdateUser = async (config, headers, id) => {
    return await axios.patch(`/api/users/${id}`, config, {
        headers: headers
    })
}
export const apiResetPass = async (config) => {
    return await axios.post(`/api/users/reset/`, config)
}
export const apiPageReset = async (config) => {
    return await axios.post("api/users/pagereset", config)
}