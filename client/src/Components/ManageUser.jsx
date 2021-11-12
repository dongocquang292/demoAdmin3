import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserRequest, deleteUserSuccess, getUserSuccess } from '../Redux/auth/action';
import { loadData, saveData } from '../utils/localStorage';
import { Button, Grid, Typography } from '@material-ui/core';
import styles from "../Styles/Dashboard.module.css";
import { Redirect, useHistory } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { apiDeleteUser, apiGetAllUser } from '../api/user';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { alertError } from '../utils/alert';
import { MUSTADMIN } from '../utils/messAlert';

const ManageUser = () => {
    const dispatch = useDispatch()
    const [userList, setUserList] = useState([])
    const email = loadData("email")
    const token = localStorage.getItem("token");
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

    let config = {
        headers: {
            token: `Bearer ${token}`
        }
    }
    const handleDelete = (_id) => {
        dispatch(deleteUserRequest())

        apiDeleteUser(_id, config).then(() => {
            getList()
        })
            .catch((err) => {
                console.log("err: ", err);
                alertError(MUSTADMIN)
                const serverErr = deleteUserFailure(err)
                dispatch(serverErr)
            })
        dispatch(deleteUserSuccess())
    }

    const getList = () => {
        apiGetAllUser(config).then((res) => {
            const newData = res.data.dataUser
            setUserList(newData)
        })
            .catch((err) => {
                console.log(err);
            })
    }


    const showConfirm = (id) => {
        confirmAlert({
            title: 'Delete User',
            message: 'Are you sure ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDelete(id)
                },
                {
                    label: 'No',
                }
            ]
        });
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
        <Grid container item={true} justifyContent="center">
            {
                userList.length > 0 ?

                    <Grid container item={true} md={8} sm={8} xs={8} justifyContent="center">
                        <Grid container item={true} justifyContent="center" className={styles.header}>
                            <Grid container item={true} justifyContent="flex-start" md={3} sm={3} xs={3} className={styles.header_option}> User Name</Grid>
                            <Grid container item={true} justifyContent="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> Email</Grid>
                            <Grid container item={true} justifyContent="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> Role</Grid>
                            <Grid container item={true} justifyContent="center" md={3} sm={3} xs={3} className={styles.header_option}> Edit User</Grid>
                            <Grid container item={true} justifyContent="center" md={3} sm={3} xs={3} className={styles.header_option}> Delete User</Grid>
                        </Grid>
                        {
                            userList ? userList.map((el) =>

                                <Grid container item={true} key={el._id} md={12} >
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={3} sm={3} xs={3}>{el.name}</Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={2} sm={2} xs={2}>{el.email}</Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={1} sm={1} xs={1}>{el.role}</Grid>
                                    <Grid className={styles.listItem} item={true} container justifyContent="center" md={3} sm={3} xs={3}>
                                        <Button variant="contained" color="primary" onClick={() => history.push(`/edit/?${el._id}`)}>Edit User</Button>
                                    </Grid>
                                    <Grid className={styles.listItem} item={true} container justifyContent="center" md={3} sm={3} xs={3}>
                                        <Button variant="contained"
                                            color="primary"
                                            // onClick={() => handleDelete(el._id)}
                                            onClick={() => showConfirm(el._id)}
                                        >   Delete User
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : null
                        }
                    </Grid> : <Typography className={styles.emptyList} variant="h5"> Not Found</Typography>
            }
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { ManageUser }