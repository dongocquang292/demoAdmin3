import { FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import styles from "../Styles/Dashboard.module.css";
import DeleteIcon from '@mui/icons-material/Delete';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { apiDeleteShared } from '../api/file';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { alertError, alertSuccess } from '../utils/alert';
import { DELETESHARESUCCESS, DELETESHAREFAIL } from '../utils/messAlert'
const ListShared = (props) => {
    const arrShared = props.arrShared
    const id = props.id
    const getList = props.getList;
    const token = localStorage.getItem("token");

    const handleDeleteShare = async (email) => {
        let config = {
            emailDS: email,
            idFile: id
        }
        apiDeleteShared(config, token).then(res => {
            if (res.status === 200) {
                getList()
                alertSuccess(DELETESHARESUCCESS)
            }
        })
            .catch((err) => {
                alertError(DELETESHAREFAIL)
            })
    };

    const showConfirm = (ur) => {
        confirmAlert({
            title: 'Delete Shared',
            message: 'Are you sure ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDeleteShare(ur)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    return (
        <FormControl fullWidth className={styles.formListShared}  >
            <Select displayEmpty value="" onChange={(e) => e.target.value}>
                <MenuItem disabled value="" >
                    <em>Email Shared</em>
                </MenuItem>
                {
                    arrShared.map(ur => (
                        <MenuItem key={ur} value={ur}>
                            {ur}
                            <DeleteIcon className={styles.btnDelteShared} onClick={() => showConfirm(ur)} />
                        </MenuItem>
                    ))
                }

            </Select>

        </FormControl>
    )
}

export { ListShared }