import { FormControl } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styles from "../Styles/Dashboard.module.css";
import axios from 'axios';
import { loadData } from '../utils/localStorage';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Selector from './Selector';
import { alertError, alertSuccess, alertWarning } from '../utils/alert';
import { CANTSHARE, OWNER, SHARED, SHAREFAIL, SHARESUCCESS } from '../utils/messAlert';

const BtnShare = (props) => {
    const email = loadData("email")
    const userList = props.userList;
    const getList = props.getList;
    const [emailSL, setEmailSL] = useState("")
    const token = localStorage.getItem("token");
    let arr = [];
    userList.map((ur) =>
        arr.push({ id: ur._id, value: ur.email })
    )

    const handleShare = async (id, emailSL) => {
        let config = {
            "email": emailSL,
            "emailCurrent": email,
        }
        if (emailSL === email) {
            alertWarning(CANTSHARE)
        } else {
            await axios.post(`/api/files/share/`, config, {
                params: id,
                headers: {
                    token: `Bearer ${token}`
                }
            }).then((res) => {
                if (res.status === 200) {
                    alertSuccess(SHARESUCCESS)
                } else {
                    alertError(SHAREFAIL)
                }
            }).catch(err => {
                let errMess = err.message;
                const pieces = errMess.split(/[\s,]+/);
                const last = pieces[pieces.length - 1]
                if (last === "304") {
                    alertError(SHARED)
                } else {
                    alertError(OWNER)
                }
            }
            )
        }
        setEmailSL("")

    }
    useEffect(() => {
        getList()
    }, [emailSL])
    return (
        <FormControl fullWidth className={styles.formShare} >
            <Selector
                arr={arr}
                emailSL={emailSL}
                setEmailSL={setEmailSL}
            />
            {
                emailSL !== "" ?
                    <button className={styles.btnShare} onClick={() => handleShare(props.id, emailSL)}>Share</button>
                    : null
            }
        </FormControl>
    )
}

export { BtnShare }