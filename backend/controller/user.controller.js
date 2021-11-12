const { UserUpload } = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Token = require('../model/token.model');
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
                return res.status(200).json({ status: 'success', data, token: token })

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
        const id = (req.params.id)
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            let userbody = {
                "name": req.body.name,
                "email": req.body.email,
                "role": req.body.role
                // "password": hash
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

// reset password
const resetPass = async (req, res) => {
    try {
        const email = req.body.email;
        const findEmail = await UserUpload.findOne({ email: email })
        if (findEmail !== null) {
            const id = findEmail._id
            const payload = { id };
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })
            new Token({
                userId: id,
                token: token
            }).save()
            const link = `${process.env.BASE_URL}/#/pagereset/?${token}`;
            // const pass = await bcrypt.hash(process.env.PASSWORD_RESET, 10)
            // await UserUpload.findByIdAndUpdate(id, { password: pass })
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dongocquang292@gmail.com',
                    pass: `${process.env.PASS_EMAIL}`
                }
            });

            let mailOptions = {
                from: 'dongocquang292@gmail.com',
                to: email,
                subject: 'Test',
                text: link
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).json({ status: "success", message: 'Check email to reset password' })
        } else {
            return res.status(403).json({ status: "fail", message: "Not found email" })
        }


    } catch (error) {
        console.log(error);
    }
}


const linkCheckReset = async (req, res) => {
    try {
        const token = req.body.token;
        const password = req.body.password;
        const pass = await bcrypt.hash(password, 10)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decoded.id;
        const findToken = await Token.findOne({ token: token })
        if (findToken !== null) {
            await UserUpload.findByIdAndUpdate({ _id: id }, { password: pass })
            res.status(200).json({ status: "success", message: "Change password successfully " })
        } else {
            res.status(403).json({ status: "fail", message: "Token incorrect" })
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: "Error" })
    }
}

module.exports = {
    register, login, getUsers, getOneUser, updateUser, deleteUser, resetPass, linkCheckReset
}