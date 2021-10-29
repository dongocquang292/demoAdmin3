import {
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    POST_USER_REQUEST,
    POST_USER_SUCCESS,
    POST_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
    GET_USER_LIST_REQUEST,
    GET_USER_LIST_SUCCESS,
    GET_USER_LIST_FAILURE,
} from '../auth/actiontype'

const getUserRequest = () => {
    return {
        type: GET_USER_REQUEST
    }
}

const getUserSuccess = (payload) => {
    return {
        type: GET_USER_SUCCESS,
        payload
    }
}

const getUserFailure = () => {
    return {
        type: GET_USER_FAILURE
    }
}


const postUserRequest = () => {
    return {
        type: POST_USER_REQUEST
    }
}

const postUserSuccess = (payload) => {
    return {
        type: POST_USER_SUCCESS,
        payload
    }
}

const postUserFailure = () => {
    return {
        type: POST_USER_FAILURE
    }
}

const deleteUserSuccess = () => {
    return {
        type: DELETE_USER_SUCCESS
    }
}

const deleteUserRequest = () => {
    return {
        type: DELETE_USER_REQUEST
    }
}

const deleteUserFailure = () => {
    return {
        type: DELETE_USER_FAILURE
    }
}

const getUserListSuccess = (payload) => {
    return {
        type: GET_USER_LIST_SUCCESS,
        payload
    }
}

const getUserListFailure = () => {
    return {
        type: GET_USER_LIST_FAILURE
    }
}

const getUserListRequest = () => {
    return {
        type: GET_USER_LIST_REQUEST
    }
}
export {
    getUserRequest,
    getUserSuccess,
    getUserFailure,
    postUserRequest,
    postUserSuccess,
    postUserFailure,
    deleteUserSuccess,
    deleteUserRequest,
    deleteUserFailure,
    getUserListSuccess,
    getUserListFailure,
    getUserListRequest
}