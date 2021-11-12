import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadData, saveData } from '../utils/localStorage';
import { getUserSuccess } from '../Redux/auth/action';
import { apiOneUser, apiUpdateUser } from '../api/user';
import { alertError, alertSuccess } from '../utils/alert';
import { EDITUSERFAIL, EDITUSERSUCCESS, MUSTADMIN } from '../utils/messAlert';


const EditUserPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const id = window.location.href.split("?")[1]
    const token = localStorage.getItem("token");
    const emailLoad = loadData("email")
    if (emailLoad === 'guest') {
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
    let configGet = {
        headers: {
            token: `Bearer ${token}`
        }
    }

    // get one user to fill
    const getInfo = async () => {
        apiOneUser(configGet, id).then((res) => {
            setName(res.data.data.name);
            setEmail(res.data.data.email);
            // setRole(res.data.data.role)
        })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getInfo()
    }, []);
    const handleClick = async () => {

        let config = {
            "name": name,
            "email": email,
            "role": role,

            // "password": password
        }

        let headers = {
            'token': `Bearer ${token}`
        }
        apiUpdateUser(config, headers, id).then((res) => {
            if (res.status === 200) {
                alertSuccess(EDITUSERSUCCESS)
            } else {
                alertError(EDITUSERFAIL)
            }
        })
            .catch((err) => {
                alertError(MUSTADMIN)

            })
        // }
    }
    // if (isAuth !== true) {
    //     return <Login />
    // }


    if (isAuth !== true) {
        return <Redirect to="/" />
    }

    return (
        <Grid container justifyContent="center" className={styles.loginWrapper}>

            <Grid className={styles.loginCard} item={true} style={{ marginTop: "50px" }} container align="center" direction="column" md={3} sm={5} xs={9}>
                <Typography className={styles.editTag} variant="h5" style={{ fontWeight: "bold", color: "#283593", marginBottom: "10px" }}>Edit User</Typography>
                <TextField
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Grid className={styles.space} />
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
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={(e) => { setRole(e.target.value) }}

                    // onChange={handleChange}
                    >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>

                    </Select>
                </FormControl>
                <Grid className={styles.space} />
                <Button variant="contained" color="primary" onClick={handleClick}>Edit</Button>
                <Grid className={styles.space} />
                <Button variant="contained" color="primary" onClick={() => history.push('/manageUser')}>Return</Button>
            </Grid>
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { EditUserPage }