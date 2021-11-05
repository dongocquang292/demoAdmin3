import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { deleteFileFailure, deleteFileRequest, deleteFileSuccess, getFileListFailure, getFileListRequest, getFileListSuccess } from '../Redux/app/action';
import { loadData, saveData } from '../utils/localStorage';
import { Grid, Typography } from '@material-ui/core';
import styles from "../Styles/Dashboard.module.css";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { BtnShare } from './BtnShare';
import { Login } from './Login';
import { getUserSuccess } from '../Redux/auth/action';


const Dashboard = () => {
    const dispatch = useDispatch()
    const [fileList, setFileList] = useState([])
    const [userList, setUserList] = useState([])
    // const [emailSelected, setEmailSelected] = useState("")
    const [fileOpen, setFileOpen] = useState(false)
    const [fileName, setFileName] = useState("")
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
    const handleShowDialog = (name, type) => {
        if (type === "image") {
            setFileName(name)
            setFileOpen(!fileOpen)
        } else {
            window.open(`http://localhost:8080/#/open/?${name}`)
        }
    }
    const handleDownDialog = () => {
        setFileOpen(!fileOpen)
    }
    let config = {
        "email": email,
    }
    const handleDelete = (_id) => {
        dispatch(deleteFileRequest())

        axios.delete(`/api/files/${_id}`, config)
            .then(() => {
                getList()
            })
            .catch((err) => {
                // const serverErr = deleteFileFailure(err)
                // dispatch(serverErr) 
                // comment to fix something went wrong...
                Alert.error("Do not own to delete", {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 2000
                })
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
        return <Login />
    }
    if (email !== "guest" && fileList.length === 0) {
        getList()
    }

    console.log("list file: ", fileList);
    return (
        <Grid container justify="center">
            {
                fileList.length > 0 ?

                    <Grid container md={10} sm={10} xs={10} justify="center">
                        <Grid container justify="center" className={styles.header}>
                            <Grid container justify="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> Thumbnail</Grid>
                            <Grid container justify="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> File Name</Grid>
                            <Grid container justify="flex-start" md={1} sm={1} xs={1} className={styles.header_option}> Size</Grid>
                            <Grid container justify="flex-start" md={2} sm={2} xs={2} className={styles.header_option}> Auth</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Open File</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Share File</Grid>
                            <Grid container justify="center" md={2} sm={2} xs={2} className={styles.header_option}> Delete File</Grid>
                        </Grid>
                        {
                            fileList ? fileList.map((el) =>

                                <Grid container md={12} >
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={2} sm={2} xs={2}>
                                        {
                                            el.type === "image" ? <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img> : <img src={`http://localhost:8080/imgAplication.png`} alt="" className={styles.thumbnail}></img>
                                        }

                                    </Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={1} sm={1} xs={1}>{el.fileName}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={1} sm={1} xs={1}>{checkSize(el.fileSize)}</Grid>
                                    <Grid className={styles.listItem} container alignItems="center" justify="flex-start" md={2} sm={2} xs={2}>{el.email}</Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        <button className={styles.btn} variant="contained" color="primary" onClick={() => handleShowDialog(el.fileName, el.type)}>Open File</button>
                                    </Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        {/* <FormControl fullWidth>
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

                                            </Select >
                                            {
                                                emailSelected !== "" ?
                                                    <button className={styles.btnShare} onClick={() => handleShare(el._id, emailSelected)}>Share</button>
                                                    : null
                                            }
                                        </FormControl> */}

                                        <BtnShare userList={userList} id={el._id} />
                                        {/* {
                                            emailSelected !== "" ?
                                                <button className={styles.btnShare} onClick={() => handleShare(el._id, emailSelected)}>Share</button>
                                                : null
                                        } */}
                                    </Grid>
                                    <Grid className={styles.listItem} container justify="center" md={2} sm={2} xs={2}>
                                        <button variant="contained"
                                            color="primary"
                                            onClick={() => handleDelete(el._id)}
                                            className={styles.btn}
                                        >   Delete File
                                        </button>
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
                                    onClick={handleDownDialog} >

                                    <img src={`http://localhost:8080/${fileName}`} className={styles.imgDialog} alt="" onClick={handleDownDialog}></img>

                                    {/* <DocViewer documents={`http://localhost:8080/${fileName}`} /> */}
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