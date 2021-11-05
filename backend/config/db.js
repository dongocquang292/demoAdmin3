const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {

    // Create the database connection 
    await new mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ');
    });

    // If the connection throws an error, setTimeout retry connect
    mongoose.connection.on('error', function (err) {
        console.log('Failed to connect to mongo on startup - retrying in 3 sec ' + err);
        setTimeout(connect, 3000);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}

module.exports = { connect }