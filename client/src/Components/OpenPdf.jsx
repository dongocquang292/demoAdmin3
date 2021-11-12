import React from 'react';
import FileViewer from "react-file-viewer";
import styles from "../Styles/Dashboard.module.css";
const OpenPdf = () => {
    const nameFile = window.location.href.split('?').reverse()[0]
    const file = `http://localhost:8080/${nameFile}`;
    const type = "pdf";
    const onError = e => {
        console.log(e, "error in file-viewer");
    };
    return (
        <FileViewer className={styles.viewPdf} fileType={type} filePath={file} onError={onError} />

    )
}

export { OpenPdf }