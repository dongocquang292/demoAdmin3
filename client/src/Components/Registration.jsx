import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postUserFailure, postUserRequest, postUserSuccess } from '../Redux/auth/action';
import { Redirect, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { apiRegister } from '../api/user';

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

const Registration = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const isAuth = useSelector((state) => state.auth.isAuth)
    const classes = useStyles();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleClick = () => {
        if (password !== confirmPassword) {
            alert("Password not match")
        } else {
            let userData = {
                "name": name,
                "email": email,
                "password": password
            }
            dispatch(postUserRequest())

            apiRegister(userData).then((res) => {
                dispatch(postUserSuccess())
                redirectToLogin()
            }).catch = (err) => {
                dispatch(postUserFailure())
            }
        }
    }

    if (isAuth === true) {
        return <Redirect to="/" />
    }

    const redirectToLogin = () => {
        setTimeout(() => {
            history.push("/login");
        }, 3000);
    }

    return (
        <Grid container justifyContent="center" className={styles.regWrapper}>

            <Grid className={styles.loginCard} item={true} container align="center" direction="column" md={3} sm={5} xs={9}>
                <TextField
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Grid className={styles.space} />
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
                <Button variant="contained" color="primary" onClick={handleClick}>Register</Button>

                <Box className={styles.divider} />
                <Typography >
                    Already have an account ?
                </Typography>
                <Button className={classes.secondBtn} variant="contained" color="primary" onClick={() => { history.push("/login") }}>Login</Button>
            </Grid>

        </Grid >
    )
}

export { Registration }