const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const indexRoute = require("./routes/index");
const cookieParser = require('cookie-parser');
global.__basedir = __dirname;


app.use(express.static('public'));

// static webpack
app.use(express.static(path.join(__dirname, '../dist')))
app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/", indexRoute)

// app.get('*', function (request, response) {
//   request.sendFile('http://localhost:8080/index.html')
// })


// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

module.exports = {
  app
}