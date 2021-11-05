import React from 'react';
import FileViewer from "react-file-viewer";
const OpenFilePage = () => {
    const nameFile = window.location.href.split('?').reverse()[0]
    const file = `http://localhost:8080/${nameFile}`;
    const type = "docx";
    const onError = e => {
        console.log(e, "error in file-viewer");
    };
    return (
        <FileViewer fileType={type} filePath={file} onError={onError} />

    )
}

export { OpenFilePage }