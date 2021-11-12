import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loadData, saveData } from '../utils/localStorage';
import { Grid, Typography } from '@material-ui/core';
import styles from "../Styles/Dashboard.module.css";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { BtnShare } from './BtnShare';
import { Login } from './Login';
import { getUserSuccess } from '../Redux/auth/action';
import { ListShared } from './ListShared';
import { apiDeleteFile, apiGetFile } from '../api/file';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { alertError } from '../utils/alert';
import { CANTGETLISTFILE, CANTGETLISTUSER } from '../utils/messAlert';
import FileViewer from "react-file-viewer";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const Dashboard = () => {
    const dispatch = useDispatch()
    const [fileList, setFileList] = useState([])
    const [userList, setUserList] = useState([])
    const [fileOpen, setFileOpen] = useState(false)
    const [videoOpen, setVideoOpen] = useState(false)
    const [docxOpen, setDocxOpen] = useState(false)
    const [pdfOpen, setPdfOpen] = useState(false)
    const [mp3Open, setMp3Open] = useState(false)
    const [pdf, setPdf] = useState([])
    const [fileName, setFileName] = useState("")
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

    const handleShowDialog = (name) => {
        let type = name.split('.').pop();

        switch (type) {
            case 'jpg':
                setFileName(name)
                setFileOpen(!fileOpen)
                break;
            case 'JPG':
                setFileName(name)
                setFileOpen(!fileOpen)
                break;
            case 'png':
                setFileName(name)
                setFileOpen(!fileOpen)
                break;
            case 'PNG':
                setFileName(name)
                setFileOpen(!fileOpen)
                break;
            case 'docx':
                setFileName(name)
                setDocxOpen(!docxOpen)
                break;
            case 'pdf':
                const pdf = [
                    { uri: `http://localhost:8080/${name}` },
                ]
                setPdf(pdf)
                setFileName(name)
                setPdfOpen(!pdfOpen)
                break;
            case 'mp4':
                setFileName(name)
                setVideoOpen(!videoOpen)
                break;
            case 'mp3':
                setFileName(name)
                setMp3Open(!videoOpen)
                break;
            default:
                console.log(123);
        }

    }
    const handleDownDialog = () => {
        setFileOpen(!fileOpen)
    }
    const handleDownVideo = () => {
        setVideoOpen(!videoOpen)
    }
    const handleDownDocx = () => {
        setDocxOpen(!docxOpen)
    }
    const handleDownPdf = () => {
        setPdfOpen(!pdfOpen)
    }
    const handleDownMp3 = () => {
        setMp3Open(!mp3Open)
    }
    let config = {
        "email": email,
        headers: {
            token: `Bearer ${token}`
        }
    }
    const handleDelete = async (_id) => {
        apiDeleteFile(_id, config)
            .then(() => {
                getList()
            })
            .catch((err) => {
                console.log(err);
                alertError(CANTGETLISTFILE)
            })

    }

    let configGetList = {
        headers: {
            token: `Bearer ${token}`
        }
    }
    // getList User
    const getListUser = async () => {
        await axios.get("/api/users/", configGetList)
            .then((res) => {
                const newUser = res.data.dataUser
                setUserList(newUser)

            })
            .catch((err) => {
                console.log(err);
                alertError(CANTGETLISTUSER);
            })
    }

    const getList = async () => {
        apiGetFile(configGetList).then((res) => {
            const dataRes = res.data.data;
            const dataFilter = dataRes.filter((el) => el.email === email || el.shared.includes(email) === true)
            setFileList(dataFilter)

        })
            .catch((err) => {
                console.log(err);
                alertError(CANTGETLISTFILE)
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

    const showConfirm = (id) => {
        confirmAlert({
            title: 'Delete File',
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
        getListUser();
        getList()
    }, []);

    if (isAuth !== true) {
        return <Login />
    }
    if (email !== "guest" && fileList.length === 0) {
        getList()
    }
    return (
        <Grid container item={true} justifyContent="center">
            {
                fileList.length > 0 ?

                    <Grid container item={true} md={10} sm={10} xs={10} justifyContent="center">
                        <Grid container justifyContent="center" item={true} className={styles.header}>
                            <Grid container justifyContent="flex-start" item={true} md={1} sm={1} xs={1} className={styles.header_option}> Thumbnail</Grid>
                            <Grid container justifyContent="flex-start" item={true} md={1} sm={1} xs={1} className={styles.header_option}> File Name</Grid>
                            <Grid container justifyContent="flex-start" item={true} md={1} sm={1} xs={1} className={styles.header_option}> Size</Grid>
                            <Grid container justifyContent="flex-start" item={true} md={1} sm={1} xs={1} className={styles.header_option}> Auth</Grid>
                            <Grid container justifyContent="flex-start" item={true} md={2} sm={2} xs={2} className={styles.header_option}>Shared</Grid>
                            <Grid container justifyContent="center" item={true} md={2} sm={2} xs={2} className={styles.header_option}> Open File</Grid>
                            <Grid container justifyContent="center" item={true} md={2} sm={2} xs={2} className={styles.header_option}> Share File</Grid>
                            <Grid container justifyContent="center" item={true} md={2} sm={2} xs={2} className={styles.header_option}> Delete File</Grid>
                        </Grid>
                        {
                            fileList ? fileList.map((el) =>
                                <Grid container md={12} key={el._id} item={true} >
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={1} sm={1} xs={1}>
                                        {/* {
                                            el.type === "image" ? <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img> : <img src={`http://localhost:8080/imgAplication.png`} alt="" className={styles.thumbnail}></img>

                                        } */}

                                        {(() => {

                                            switch (el.fileName.split('.').pop()) {
                                                case 'jpg':
                                                    return (
                                                        <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'JPG':
                                                    return (
                                                        <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'png':
                                                    return (
                                                        <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'PNG':
                                                    return (
                                                        <img src={`http://localhost:8080/${el.fileName}`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'pdf':
                                                    return (
                                                        <img src={`http://localhost:8080/pdf.png`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'docx':
                                                    return (
                                                        <img src={`http://localhost:8080/docxIcon.png`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'mp4':
                                                    return (
                                                        <img src={`http://localhost:8080/mp4Icon.png`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                case 'mp3':
                                                    return (
                                                        <img src={`http://localhost:8080/mp3Icon.jpg`} alt="" className={styles.thumbnail}></img>
                                                    )
                                                default:
                                                    return (
                                                        <img src={`http://localhost:8080/imgAplication.png`} alt="" className={styles.thumbnail}></img>
                                                    )
                                            }

                                        })()}
                                    </Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={1} sm={1} xs={1}>{el.fileName}</Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={1} sm={1} xs={1}>{checkSize(el.fileSize)}</Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={1} sm={1} xs={1}>{el.email}</Grid>
                                    <Grid className={styles.listItem} item={true} container alignItems="center" justifyContent="flex-start" md={2} sm={2} xs={2}>
                                        <ListShared arrShared={el.shared} id={el._id} getList={getList} />

                                    </Grid>
                                    <Grid className={styles.listItem} item={true} container justifyContent="center" md={2} sm={2} xs={2}>
                                        <button className={styles.btn} variant="contained" color="primary" onClick={() => handleShowDialog(el.fileName)}>Open File</button>
                                    </Grid>
                                    <Grid className={styles.listItem} item={true} container justifyContent="center" md={2} sm={2} xs={2}>
                                        <BtnShare userList={userList} id={el._id} getList={getList} />
                                    </Grid>
                                    <Grid className={styles.listItem} item={true} container justifyContent="center" md={2} sm={2} xs={2}>
                                        <button variant="contained"
                                            color="primary"
                                            // onClick={() => handleDelete(el._id)}
                                            onClick={() => showConfirm(el._id)}
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
                                    styles={{ position: "absolute" }}
                                    open
                                    onClick={handleDownDialog} >
                                    <img src={`http://localhost:8080/${fileName}`} className={styles.imgDialog} alt="" onClick={handleDownDialog}></img>
                                </dialog>
                            )

                        }
                        {
                            videoOpen && (
                                <dialog
                                    className={styles.dialog}
                                    styles={{ position: "absolute" }}
                                    open
                                    onClick={handleDownVideo} >
                                    <video width="750" height="500" controls onClick={handleDownVideo}>
                                        <source src={`http://localhost:8080/${fileName}`} type="video/mp4" />
                                    </video>

                                </dialog>
                            )
                        }
                        {
                            docxOpen && (
                                <dialog
                                    className={styles.dialog}
                                    styles={{ position: "absolute" }}
                                    open
                                    onClick={handleDownDocx} >
                                    <FileViewer onClick={handleDownDocx} fileType={'docx'} filePath={`http://localhost:8080/${fileName}`} />

                                </dialog>
                            )
                        }
                        {
                            pdfOpen && (
                                <dialog
                                    className={styles.dialog}
                                    styles={{ position: "absolute" }}
                                    open
                                    onClick={handleDownPdf} >
                                    <DocViewer
                                        pluginRenderers={DocViewerRenderers}
                                        documents={pdf}
                                        config={{
                                            header: {
                                                disableHeader: false,
                                                disableFileName: false,
                                                retainURLParams: false
                                            }
                                        }}
                                        style={{ width: 900, height: 1000 }}
                                    />

                                </dialog>
                            )
                        }
                        {
                            mp3Open && (
                                <dialog
                                    className={styles.audioBox}
                                    styles={{ position: "absolute" }}
                                    open
                                    onClick={handleDownMp3} >
                                    <h3 className={styles.h3Title}>Audio</h3>
                                    <audio className={styles.audioFile} controls>
                                        <source src={`http://localhost:8080/${fileName}`} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                    <div>
                                        <img src={`http://localhost:8080/audioIcon.png`} className={styles.imgAudio} alt="" onClick={handleDownDialog}></img>
                                    </div>

                                </dialog>
                            )
                        }

                    </Grid > : <Typography className={styles.emptyList} variant="h3">No files have been uploaded</Typography>
            }
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { Dashboard }