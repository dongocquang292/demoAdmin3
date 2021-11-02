const { UserUpload } = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Get User
const getUsers = async (req, res) => {
    const user = await UserUpload.find().lean().exec();
    return res.status(200).json({ status: 'success', dataUser: user })
}

// Get Single User
const getOneUser = async (req, res) => {
    const id = req.params.id.split(':')[1];
    try {
        const user = await UserUpload.findById(id).lean().exec()
        return res.status(200).json({ status: 'success', data: user })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

// Register User
const register = async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await UserUpload.findOne({ where: { email: email } });
        if (!findUser) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                let userbody = {
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": hash
                }
                UserUpload.create(userbody);
                return res.status(201).json({ status: 'success', data: userbody })
            });
        }


    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

// Login method
const login = async (req, res) => {

    try {
        const user = await UserUpload.findOne({ email: req.body.email }).lean().exec();
        const { email, password } = req.body;
        // Compare User password with Hash String
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {

                // create token
                const payload = { email, role: user.role };
                const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1h'
                })
                let data = {
                    response: true,
                    name: user.name,
                    email: user.email,
                    message: "User Authenticated Successfully"
                }
                return res.cookie('token', token, { httpOnly: true }).status(200).json({ status: 'success', data })
            } else {
                let data = {
                    response: false,
                    message: "User Authenticated Failed"
                }
                return res.status(500).json({ status: 'fail', data })
            }
        });
    } catch {
        return res.status(404).json({ status: 'fail', message: "User Not Found" })
    }
}

// Update User
const updateUser = async (req, res) => {
    try {
        const id = (req.params.id).split(':')[1]
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            let userbody = {
                "name": req.body.name,
                "email": req.body.email,
                "role": req.body.role,
                "password": hash
            }
            const user = UserUpload.findByIdAndUpdate(id, userbody, { new: true }).lean().exec()
            return res.status(200).json({ status: 'success', data: user })
        })

    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}


// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await UserUpload.findByIdAndDelete(req.params.id).lean().exec()
        return res.status(200).json({ status: 'success', data: user })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

module.exports = {
    register, login, getUsers, getOneUser, updateUser, deleteUser
}