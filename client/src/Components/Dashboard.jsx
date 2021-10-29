import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { deleteFileFailure, deleteFileRequest, deleteFileSuccess, getFileListFailure, getFileListRequest, getFileListSuccess } from '../Redux/app/action';
import { loadData } from '../utils/localStorage';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import styles from "../Styles/Dashboard.module.css";
import { Redirect } from 'react-router';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
const Dashboard = () => {
    const dispatch = useDispatch()
    const [fileList, setFileList] = useState([])
    const [userList, setUserList] = useState([])
    const [emailSelected, setEmailSelected] = useState("")
    const [fileOpen, setFileOpen] = useState(false)
    const [fileName, setFileName] = useState("")
    const email = loadData("email")
    const isAuth = useSelector((state) => state.auth.isAuth)


    const handleShowDialog = (name) => {
        setFileName(name)
        setFileOpen(!fileOpen)
    }
    const handleDelete = (_id) => {
        dispatch(deleteFileRequest())

        axios.delete(`/api/files/${_id}`)
            .then(() => {
                getList()
            })
            .catch((err) => {
                const serverErr = deleteFileFailure(err)
                dispatch(serverErr)
            })
        dispatch(deleteFileSuccess())
    }


    // getList User
    const getListUser = () => {
        axios.get("/api/users/")
            .then((res) => {
                const newUser = res.data.dataUser
                setUserList(newUser)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getList = () => {
        dispatch(getFileListRequest())
        axios.get("/api/files/")
            .then((res) => {
                const dataRes = res.data.data;
                console.log("Res data: ", dataRes);
                const dataFilter = dataRes.filter((el) => el.email === email || el.shared.includes(email) === true)
                setFileList(dataFilter)
                dispatch(getFileListSuccess([]))
            })
            .catch((err) => {
                const serverErr = getFileListFailure()
                dispatch(serverErr)
                dispatch(getFileListSuccess([]))
            })
    }

    const handleShare = async (id, emailSL) => {
        console.log("Email dc chon: ", emailSL);
        let config = {
            "email": emailSL,
        }
        if (emailSL === email) {
            Alert.warning(`Can't share to yourself`, {
                position: 'top-right',
                effect: 'slide',
                timeout: 1500
            })
        } else {
            await axios.post(`/api/files/share/`, config, {
                params: id
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    Alert.success('Share success', {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                } else {
                    Alert.error('Share fail', {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                }
            })
        }
        setEmailSelected("")
    }

    const checkSize = (num) => {
        if (num < 1024) {
            return `${num} Bytes`
        } else if (num >= 1024 && num < 1048576) {
            return `${(num / 1024).toFixed(2)} KB`
        } else if (num >= 1048576) {
            return `${(num / 1024 / 1024).toFixed(2)} MB`
        }
    }

    useEffect(() => {
        getListUser();
        getList();

    }, []);

    // useEffect(() => {

    // }, []);

    if (isAuth !== true) {
        return <Redirect to="/" />
    }

    if (email !== "guest" && fileList.length === 0) {
        getList()
    }
    console.log("file list:", fileList);
    return (
        <Grid container justify="center">
            {
                fileList.length > 0 ?

                    <Grid container md={10} sm={10} xs={10} justify="center">
                        <Grid container justify="center" className={styles.header}>
                            <Grid container justify="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> Thumbnail</Grid>
                            <Grid container justify="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> File Name</Grid>
                            <Grid container justify="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> Size</Grid>
                            <Grid container justify="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> Type</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Open File</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Share File</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Delete File</Grid>
                        </Grid>
                        {
                            fileList ? fileList.map((el) =>

                                <Grid container md={12} >
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={2} sm={2} xs={2}>
                                        <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img>
                                    </Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={2} sm={2} xs={2}>{el.fileName}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={1} sm={1} xs={1}>{checkSize(el.fileSize)}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={1} sm={1} xs={1}>{el.type}</Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        <Button className={styles.btn} variant="contained" color="primary" onClick={() => handleShowDialog(el.fileName)}>Open File</Button>
                                    </Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        <FormControl fullWidth>
                                            <InputLabel id="email-select-label">Email</InputLabel>
                                            <Select
                                                labelId="email-select-label"
                                                id="email-select"
                                                label="Email"
                                                onChange={(e) => setEmailSelected(e.target.value)}
                                            >
                                                {
                                                    userList ? userList.map((ur) =>
                                                        <MenuItem value={ur.email}>{ur.email}</MenuItem>
                                                    ) : null
                                                }

                                            </Select>
                                            {
                                                emailSelected !== "" ?
                                                    <Button onClick={() => handleShare(el._id, emailSelected)}>Share</Button>
                                                    : null
                                            }

                                        </FormControl>

                                    </Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleDelete(el._id)}
                                            className={styles.btn}
                                        >   Delete File
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : null
                        }
                        {
                            fileOpen && (
                                <dialog
                                    className={styles.dialog}
                                    style={{ position: "absolute" }}
                                    open
                                    onClick={handleShowDialog} >
                                    <img src={`http://localhost:8080/${fileName}`} className={styles.imgDialog} alt="" onClick={handleShowDialog}></img>
                                </dialog>
                            )

                        }

                    </Grid > : <Typography className={styles.emptyList} variant="p">No files have been uploaded</Typography>
            }
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { Dashboard }