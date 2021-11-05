import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import axios from "axios";
import styles from "../Styles/Form.module.css";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


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

const ResetPass = () => {
    const [email, setEmail] = useState("");
    const classes = useStyles();
    const handleClick = async () => {
        let config = {
            "email": email,
        }

        await axios.post(`/api/users/reset/`, config).then((res) => {
            console.log("Res: ", res);
            if (res.status === 200) {
                Alert.success(`${res.data.message}`, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 2000
                })
            }

        }).catch((err) =>
            Alert.error("Not found email", {
                position: 'top-right',
                effect: 'slide',
                timeout: 1500
            })
        )

    }

    return (
        <Grid container justify="center" className={styles.loginWrapper}>
            <Grid className={styles.loginCard} container align="center" direction="column" md={3} sm={5} xs={9}>
                <Typography className={styles.editTag} variant="h5" style={{ fontWeight: "bold", color: "#283593", marginBottom: "10px" }}>Input email to reset password</Typography>
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
                <Button className={classes.dwlBtn} onClick={handleClick} variant="contained" color="primary">SENT</Button>
            </Grid>
            <Alert stack={{ limit: 1 }} />
        </Grid>

    )
}

export { ResetPass }