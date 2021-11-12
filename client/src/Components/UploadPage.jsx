import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProgress, postFileSuccess } from '../Redux/app/action';
import { loadData, saveData } from '../utils/localStorage';
import { Button, CardMedia, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import styles from "../Styles/Upload.module.css"
import ProgressArc from 'progress-arc-component'
import styled from 'styled-components'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { getUserSuccess } from '../Redux/auth/action';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { Login } from './Login';
import { apiUploadFile } from '../api/file';
import { alertError } from '../utils/alert';
import { PLSSELECTFILE } from '../utils/messAlert';

const useStyles = makeStyles((theme) => ({
    uploadBtn: {
        margin: "10px 25%",
        width: "50%"
    },
    doneBtn: {
        margin: "10px",
        width: "70%",
        padding: "10px"
    },
    doneText: {
        margin: "10px",
        color: "#3f51b5",
        fontWeight: "900"

    },
    grid1: {
        marginBottom: "50px"
    }
}));

// For Progress Bar
const StyledProgressArc = styled(ProgressArc)`
 height: 15em;
 width: 15em;
 border-radius: 0.5em;
 padding: 1em;
 margin: 100px
`
const UploadPage = () => {
    const dispatch = useDispatch()
    // const isAuth = useSelector((state) => state.auth.isAuth)
    const progress = useSelector((state) => state.app.progress)
    const isError = useSelector((state) => state.app.isError)
    let fileData = useSelector((state) => state.app.fileData)
    const [img, setImg] = useState(undefined);
    const classes = useStyles();
    const token = localStorage.getItem("token");
    const isAuth = useSelector((state) => state.auth.isAuth)
    // set by Default email as guest
    if (loadData("email") === null) {
        saveData("email", "guest")
    } else if (loadData("email") !== "guest") {
        let payload = {
            isAuth: true,
            name: loadData("name"),
            email: loadData("email")
        }
        dispatch(getUserSuccess(payload))
    }

    let file;

    let formData = new FormData();
    const email = loadData("email")
    const onUploadProgress = (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        dispatch(getProgress(percentCompleted))
    }
    const handleFileUpload = (e) => {
        file = e.target.files[0];
        // fileSize = file.size;
        formData.append("file", file);
        formData.append("email", email)
    }

    const uploadToServer = () => {
        // dispatch(postFileRequest())
        let config = {
            headers: {
                token: `Bearer ${token}`
            }
        }

        // upload file 
        apiUploadFile(formData, config, onUploadProgress).then((res) => {
            setImg(res.data.img);
            let fileInfo = {
                "email": email,
                "fileName": res.data.data.name,
                "fileSize": file.size,
            }
            const postFileAction = postFileSuccess(fileInfo)
            dispatch(postFileAction)
        })
            .catch((err) => {
                // const serverErr = postFileFailure()
                // dispatch(serverErr)
                console.log(err);
                alertError(PLSSELECTFILE)
            })

    }
    const handleCardReset = () => {
        dispatch(postFileSuccess(""))
    }
    if (isAuth !== true) {
        return <Login />
    }
    if (img === undefined) {
        handleCardReset()
    }
    return (
        <Grid container justifyContent="center" item={true} >
            <Grid container item={true} align="center" direction="column" md={5} xs={10} className={classes.grid1}>
                <img src="./images/Upload1.svg" alt="Upload" className={styles.uploadImg} />
                <TextField
                    type="file"
                    className={classes.uploadBtn}
                    multiple={false}
                    onChange={handleFileUpload}
                />
                <Button className={classes.uploadBtn} variant="contained" color="primary" onClick={uploadToServer}>Upload</Button>
            </Grid>
            <Grid container item={true} justifyContent="center" align="center" md={5} xs={8}>
                {
                    progress > 0 && progress < 100 ? <StyledProgressArc arcColor="#1565C0" textColor="#1565C0" value={progress} /> : null
                }
                {
                    isError && <h1>Something went wrong ...</h1>
                }
                {
                    fileData &&
                    <Grid item={true} md={8} className={styles.completeCard}>
                        <div className={styles.cardCloseDiv}>
                            <HighlightOffIcon onClick={handleCardReset} className={styles.cardCloseIcon} />
                        </div>
                        <Typography variant="h6" className={classes.doneText}>
                            Preview
                        </Typography>
                        <CardMedia component="img" image={img} alt=""></CardMedia>
                        <Typography variant="h5" className={classes.doneText}>
                            File Uploaded Successfully
                        </Typography>
                    </Grid>
                }
                <Alert stack={{ limit: 1 }} />
            </Grid>

        </Grid>
    )
}

export { UploadPage }