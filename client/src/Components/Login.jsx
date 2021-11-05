import React, { useState } from 'react';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { getUserFailure, getUserRequest, getUserSuccess } from '../Redux/auth/action';
import { saveData } from '../utils/localStorage';
import { Redirect, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
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

const Login = () => {
    const dispatch = useDispatch()
    const classes = useStyles();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const isAuth = useSelector((state) => state.auth.isAuth)
    const history = useHistory()

    const handleClick = (e) => {
        e.preventDefault();

        let config = {
            "email": email,
            "password": password
        }

        dispatch(getUserRequest())
        axios.post("/api/users/login", config)
            .then((res) => {
                let response = res.data.data.response
                let name = res.data.data.name
                if (response === true) {
                    let payload = {
                        isAuth: true,
                        name: name,
                        email: email
                    }
                    dispatch(getUserSuccess(payload))
                    saveData("email", email)
                    saveData("name", name)
                    // swal("Login success", "success", window.close(1000));
                    // Alert.success('Login success', {
                    //     position: 'top-right',
                    //     effect: 'slide',
                    //     timeout: 1500
                    // })
                    redirectPage()
                }
            })
            .catch((err) => {
                Alert.error('Login fail', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 1500
                })
                console.log(err);
                dispatch(getUserFailure(err))
            })
    }

    if (isAuth === true) {
        return <Redirect to="/upload" />
    }

    const redirectPage = () => {
        setTimeout(() => {
            history.push("/upload")
        }, 500);
    }

    return (
        <Grid container justify="center" className={styles.loginWrapper}>
            <Grid className={styles.loginCard} container align="center" direction="column" md={3} sm={5} xs={9}>

                <TextField
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Grid className={styles.space} />
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

                <Button variant="contained" color="primary" onClick={handleClick}>Login</Button>
                <Box className={styles.divider} />
                <Grid className={styles.space} />
                <Typography >
                    Don't have an account ?
                </Typography>
                <Button className={classes.secondBtn} variant="contained" color="primary" onClick={() => { history.push("/registration") }}>Create Account</Button>
                <Grid className={styles.space} />
                <Typography onClick={() => { history.push("/resetpass") }}>
                    Forgot password ? Click here to reset
                </Typography>
            </Grid>
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { Login }