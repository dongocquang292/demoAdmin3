const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const checkRole = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                if (decoded.role === 1) {
                    next();
                } else {
                    res.status(500).json({ message: "Not admin" })
                }
            }
        });
    }
}
module.exports = checkRole;