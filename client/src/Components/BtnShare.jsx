import { FormControl, Hidden, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import styles from "../Styles/Dashboard.module.css";
import Alert from 'react-s-alert';
import axios from 'axios';
import { loadData } from '../utils/localStorage';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
const BtnShare = (props) => {
    const email = loadData("email")
    const userList = props.userList
    const [emailSL, setEmailSL] = useState(undefined)
    const handleShare = async (id, emailSL) => {

        let config = {
            "email": emailSL,
            "emailCurrent": email
        }
        if (emailSL === email) {
            return Alert.warning(`Can't share to yourself`, {
                position: 'top-right',
                effect: 'slide',
                timeout: 1500
            })
        } else {
            await axios.post(`/api/files/share/`, config, {
                params: id
            }).then((res) => {
                if (res.status === 200) {
                    Alert.success('Share success', {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                } else {
                    Alert.error('Fail to share', {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 1500
                    })
                }
            }).catch(err => {
                let errMess = err.message;
                const pieces = errMess.split(/[\s,]+/);
                const last = pieces[pieces.length - 1]
                if (last === "304") {
                    Alert.error(`This user has shared`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 2000
                    })
                } else {
                    Alert.error(`Must be the owner`, {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 2000
                    })
                }
            }
            )
        }
        setEmailSL(undefined)
    }
    let x = document.getElementById("email-select")
    console.log("x: ", x);
    return (
        <FormControl fullWidth id="myForm" >
            <InputLabel id="email-select-label">Email</InputLabel>
            <Select
                labelId="email-select-label"
                id="email-select"
                label="Email"
                onChange={(e) => { setEmailSL(e.target.value) }}
            >
                {

                    userList.map((ur) =>

                        <MenuItem value={ur.email}  >
                            {/* {showEmail === undefined ? ur.email : null} */}
                            {ur.email}
                        </MenuItem>
                    )
                }

            </Select >
            {
                emailSL !== undefined ?
                    <button className={styles.btnShare} onClick={() => handleShare(props.id, emailSL)}>Share</button>
                    // <button className={styles.btnShare} onClick={myResetFunction}>Share</button>
                    : null
            }
        </FormControl>
    )
}

export { BtnShare }