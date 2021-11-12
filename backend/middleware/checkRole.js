const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const checkRole = function (req, res, next) {

    const authorization = req.headers.token;
    const token = authorization.replace('Bearer ', '')
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                if (decoded.role === 'admin') {
                    next();
                } else {
                    res.status(405).json({ message: "Not admin" })
                }
            }
        });
    }
}
module.exports = checkRole;