const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const withAuth = function (req, res, next) {

    const authorization = req.headers.token
    const token = authorization.replace('Bearer ', '')
    if (!token) {
        console.log(123);
        res.status(401).send('Unauthorized: No token provided');
    } else {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;

                next();
            }
        });
    }
}
module.exports = withAuth;