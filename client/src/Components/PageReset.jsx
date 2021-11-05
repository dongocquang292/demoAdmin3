import React, { useState } from 'react';
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Button, Grid } from '@material-ui/core';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { useHistory } from 'react-router-dom';

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
            Alert.error(`Password not match`, {
                position: 'top-right',
                effect: 'slide',
                timeout: 1500
            })
        } else {
            await axios.post("api/users/pagereset", config).then((res) => {
                if (res.status === 200) {
                    Alert.success(`${res.data.message}`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                    redirectPage()
                } else {
                    Alert.error(`Can't not change password`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
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
        <Grid container justify="center" className={styles.loginWrapper}>
            <Grid className={styles.loginCard} container align="center" direction="column" md={3} sm={5} xs={9}>

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