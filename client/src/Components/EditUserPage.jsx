import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import styles from "../Styles/Form.module.css";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


const EditUserPage = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const id = window.location.href.split("?")[1]
    // get one user to fill
    const getInfo = () => {
        axios.get(`/api/users/:${id}`)
            .then((res) => {
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
    const handleClick = () => {
        // if (password !== confirmPassword) {
        //     Alert.warning(`Password not match`, {
        //         position: 'top-right',
        //         effect: 'slide',
        //         timeout: 1500
        //     })
        // } else if (password === "") {
        //     Alert.warning(`Pls enter password`, {
        //         position: 'top-right',
        //         effect: 'slide',
        //         timeout: 1500
        //     })
        // } else {
        let config = {
            "name": name,
            "email": email,
            "role": role,
            // "password": password
        }

        axios.patch(`/api/users/:${id}`, config)
            .then((res) => {
                console.log("res mail:", res.data.data);
                if (res.status === 200) {
                    Alert.success(`Edit User Success`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                } else {
                    Alert.error(`Fail To Edit User`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                }
            })
            .catch((err) => {
                Alert.error(`Must be Admin to edit`, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 1500
                })
                console.log(err);
            })
        // }
    }
    return (
        <Grid container justify="center" className={styles.loginWrapper}>

            <Grid className={styles.loginCard} style={{ marginTop: "50px" }} container align="center" direction="column" md={3} sm={5} xs={9}>
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
                {/* <TextField
                    type="text"
                    id="outlined-primary"
                    variant="outlined"
                    required={true}
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                /> */}
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
                {/* <TextField
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
                <Grid className={styles.space} /> */}
                <Button variant="contained" color="primary" onClick={handleClick}>Edit</Button>
                <Grid className={styles.space} />
                <Button variant="contained" color="primary" onClick={() => history.push('/manageUser')}>Return</Button>
            </Grid>
            <Alert stack={{ limit: 1 }} />
        </Grid >
    )
}

export { EditUserPage }