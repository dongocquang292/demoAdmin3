import React from "react";
import { Select, MenuItem } from "@material-ui/core/";
import styles from "../Styles/Dashboard.module.css";
const Selector = ({ arr, emailSL, setEmailSL }) => {
    const handleChange = e => {
        setEmailSL(e.target.value);
    };

    return (
        <Select displayEmpty className={styles.formShare} value={emailSL} onChange={handleChange}>
            <MenuItem disabled value="">
                <em>Email</em>
            </MenuItem>
            {arr.map(ur => (
                <MenuItem key={ur.id} value={ur.value}>
                    {ur.value}
                </MenuItem>

            ))}
        </Select>
    );
};

export default Selector;