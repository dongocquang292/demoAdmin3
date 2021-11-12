import axios from 'axios';
export const apiDeleteFile = async (_id, config) => {
    return await axios.delete(`/api/files/${_id}`, config,)
}
export const apiGetFile = async (configGetList) => {
    return await axios.get("/api/files/", configGetList)
}
export const apiDeleteShared = async (config, token) => {
    return await axios.post(`/api/files/deleteShared/`, config, {
        headers: {
            token: `Bearer ${token}`
        }
    })
}
export const apiUploadFile = async (formData, config, onUploadProgress) => {
    return await axios.post("/api/files", formData, config, {
        onUploadProgress
    }
    )
}


