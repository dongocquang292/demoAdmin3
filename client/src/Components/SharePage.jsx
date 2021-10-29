import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import axios from "axios";
import { loadData } from '../utils/localStorage';
import styles from "../Styles/Form.module.css";
const useStyles = makeStyles((theme) => ({
    secondBtn: {
        backgroundColor: "#43A047",
        color: "white",
        "&:hover": {
            backgroundColor: "#388E3C"
        },
        marginTop: "10px"
    }
}));

const SharePage = () => {
    const [email, setEmail] = useState("");
    const id = window.location.href.split("?")[1]
    const classes = useStyles();
    const emailCurrent = loadData("email")
    const handleClick = async () => {
        let config = {
            "email": email,
        }
        if (email === emailCurrent) {
            alert("can't share to yourself ")
        } else {
            await axios.post(`/api/files/share/`, config, {
                params: id
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    alert("Share Success")
                }
                if (res.statusText === "bac") {
                    alert("sai email")
                }
            })
        }

    }

    return (
        <Grid container justify="center" className={styles.loginWrapper}>
            <Grid className={styles.loginCard} container align="center" direction="column" md={3} sm={5} xs={9}>
                <Typography className={styles.editTag} variant="h5" style={{ fontWeight: "bold", color: "#283593", marginBottom: "10px" }}>Input email to share</Typography>
                <TextField
                    type="email"
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Grid className={styles.space} />
                <Button className={classes.dwlBtn} onClick={handleClick} variant="contained" color="primary">Share</Button>
            </Grid>
        </Grid>
    )
}

export { SharePage }