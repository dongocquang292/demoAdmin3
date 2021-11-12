import { clearData, saveData } from '../utils/localStorage';
import { useDispatch } from 'react-redux';
import { getUserSuccess } from '../Redux/auth/action';
import { Button } from '@material-ui/core';
import React from 'react';

const Logout = () => {
    const dispatch = useDispatch()
    let payload = {
        isAuth: false,
        name: "",
        email: ""
    }

    const handleLogOut = async () => {
        clearData()
        saveData("email", "guest")
        dispatch(getUserSuccess(payload))
        localStorage.removeItem("token");
    }

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleLogOut}>Log Out</Button>
        </>
    )
}

export { Logout }