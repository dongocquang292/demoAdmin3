import React, { useState } from 'react';
import { Button, CardMedia, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
const OpenFilePage = () => {
    const [data, setData] = useState();
    const id = window.location.href.split("?")[1]
    const handleClick = async () => {
        const res = await axios.get(`/api/files/:${id}`);
        console.log(res);
        setData(res.data)
    }
    return (
        <Grid container justify="center">
            <Grid container direction="column" md={10} justify="center" alignItems="center">
                <Typography variant="h5" style={{ fontWeight: "bold", color: "#283593", marginBottom: "10px" }}>Click to open file</Typography>
                <Button variant="contained" color="primary" onClick={handleClick}>Open File</Button>
                <CardMedia component="img" image={data} alt=""></CardMedia>
            </Grid>
        </Grid>
    )
}

export { OpenFilePage }