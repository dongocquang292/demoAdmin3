import { Grid, Typography } from '@material-ui/core';
import React from 'react';

const NotFound = () => {
    return (
        <Grid container direction="column" justifyContent="center" alignItems="center" md={12} sm xs style={{ marginTop: "30px" }}>
            <Typography variant="h2" style={{ fontWeight: "bold", color: "#283593", marginTop: "200px" }}>Page Not Found</Typography>
        </Grid>
    )
}

export { NotFound }