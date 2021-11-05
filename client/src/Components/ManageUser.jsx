import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { deleteUserFailure, deleteUserRequest, deleteUserSuccess, getUserSuccess } from '../Redux/auth/action';
import { loadData, saveData } from '../utils/localStorage';
import { Button, Grid, Typography } from '@material-ui/core';
import styles from "../Styles/Dashboard.module.css";
import { Redirect, useHistory } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


const ManageUser = () => {
    const dispatch = useDispatch()
    const [userList, setUserList] = useState([])
    const email = loadData("email")

    if (email === null) {
        saveData("email", "guest")
    } else if (email !== "guest") {
        let payload = {
            isAuth: true,
            name: loadData("name"),
            email: loadData("email")
        }
        dispatch(getUserSuccess(payload))
    }
    const isAuth = useSelector((state) => state.auth.isAuth)
    const history = useHistory();
    const handleDelete = (_id) => {
        dispatch(deleteUserRequest())
        axios.delete(`/api/users/${_id}`)
            .then(() => {
                getList()
            })
            .catch((err) => {
                Alert.error(`Must be Admin to delete`, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 1500
                })
                const serverErr = deleteUserFailure(err)
                dispatch(serverErr)
            })
        dispatch(deleteUserSuccess())
    }

    const getList = () => {
        axios.get("/api/users/")
            .then((res) => {
                console.log("data: ", res.data.dataUser)
                const newData = res.data.dataUser
                setUserList(newData)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getList()
    }, []);

    if (isAuth !== true) {
        return <Redirect to="/" />
    }

    if (email !== "guest" && userList.length === 0) {
        getList()
    }
    return (
        <Grid container justify="center">
            {
                userList.length > 0 ?

                    <Grid container md={8} sm={8} xs={8} justify="center">
                        <Grid container justify="center" className={styles.header}>
                            <Grid container justify="flex-start" md={3} sm={3} xs={3} className={styles.header_option}> User Name</Grid>
                            <Grid container justify="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> Email</Grid>
                            <Grid container justify="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> Role</Grid>
                            <Grid container justify="center" md={3} sm={3} xs={3} className={styles.header_option}> Edit User</Grid>
                            <Grid container justify="center" md={3} sm={3} xs={3} className={styles.header_option}> Delete User</Grid>
                        </Grid>
                        {
                            userList ? userList.map((el) =>

                                <Grid container md={12} >
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={3} sm={3} xs={3}>{el.name}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={2} sm={2} xs={2}>{el.email}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={1} sm={1} xs={1}>{el.role}</Grid>
                                    <Grid className={styles.listItem} container justify="center" md={3} sm={3} xs={3}>
                                        <Button variant="contained" color="primary" onClick={() => history.push(`/edit/?${el._id}`)}>Edit User</Button>
                                    </Grid>
                                    <Grid className={styles.listItem} container justify="center" md={3} sm={3} xs={3}>
                                        <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleDelete(el._id)}
                                        >   Delete User
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : null
                        }
                    </Grid> : <Typography className={styles.emptyList} variant="p"> Not Found</Typography>
            }
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { ManageUser }