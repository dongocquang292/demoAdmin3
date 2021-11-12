import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Button, Grid } from '@material-ui/core';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { useHistory } from 'react-router-dom';
import { apiPageReset } from '../api/user';
import { alertError, alertSuccess } from '../utils/alert';
import { CHANGEPASSFAIL } from '../utils/messAlert';

const PageReset = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const token = window.location.href.split('?')[1]
    const history = useHistory()
    const handleChange = async (e) => {
        e.preventDefault();
        let config = {
            "token": token,
            "password": password
        }
        if (password !== confirmPassword) {
            let mess3 = `Password not match`
            alertError(mess3)
        } else {
            apiPageReset(config).then((res) => {
                // message
                let mess1 = `${res.data.message}`
                if (res.status === 200) {
                    alertSuccess(mess1)
                    redirectPage()
                } else {
                    alertError(CHANGEPASSFAIL)
                }
            })
                .catch((err) => console.log(err))
        }

    }
    const redirectPage = () => {
        setTimeout(() => {
            history.push("/login")
        }, 1500);
    }
    return (
        <Grid container justifyContent="center" item={true} className={styles.loginWrapper}>
            <Grid className={styles.loginCard} item={true} container align="center" direction="column" md={3} sm={5} xs={9}>

                <TextField
                    type="password"
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Grid className={styles.space} />
                <TextField
                    type="password"
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Grid className={styles.space} />

                <Button variant="contained" color="primary" onClick={(e) => handleChange(e)}>Change Password</Button>
            </Grid>
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { PageReset }