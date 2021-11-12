import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import styles from "../Styles/Form.module.css";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { apiResetPass } from '../api/user';
import { alertError, alertSuccess } from '../utils/alert';
import { NOTFOUNDEMAIL } from '../utils/messAlert';


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

    const handleClick = () => {
        let config = {
            "email": email,
        }

        apiResetPass(config).then((res) => {
            if (res.status === 200) {
                // message
                let mess1 = `${res.data.message}`
                alertSuccess(mess1)
            }

        }).catch((err) => {
            alertError(NOTFOUNDEMAIL)
        }

        )

    }

    return (
        <Grid container justifyContent="center" className={styles.loginWrapper}>
            <Grid className={styles.loginCard} item={true} container align="center" direction="column" md={3} sm={5} xs={9}>
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