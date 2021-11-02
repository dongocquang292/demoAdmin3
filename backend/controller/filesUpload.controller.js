const e = require("express");
const { FileUpload } = require("../model/filesUpload.model")
const { UserUpload } = require("../model/user.model")
const getFiles = async (req, res) => {
    const filePackage = await FileUpload.find().lean().exec();

    return res.status(200).json({
        status: 'success',
        data: filePackage
    })
}

const UploadFile = async (req, res) => {
    try {
        const email = req.body.email;
        const fileName = req.file.originalname
        const fileSize = req.file.size
        const typeFile = req.file.mimetype.split("/")
        const filePackage = await FileUpload.create({ email: email, fileName: fileName, fileSize: fileSize, type: typeFile[0], shared: email });
        return res.status(200).json({ status: 'success', data: filePackage, img: `http://localhost:8080/${fileName}` })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

const getOneFile = async (req, res) => {
    try {
        const id = (req.params.id).split(':')[1]
        const filePackage = await FileUpload.findById(id).lean().exec()
        const fileName = filePackage.fileName;
        res.send(`http://localhost:8080/${fileName}`).status(200).json({ status: 'success' })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

const updateFile = async (req, res) => {
    try {
        const filePackage = await FileUpload.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec()
        return res.status(200).json({ status: 'success', data: filePackage })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

const deleteFile = async (req, res) => {
    try {
        const filePackage = await FileUpload.findByIdAndDelete(req.params.id).lean().exec()
        return res.status(200).json({ status: 'success', data: filePackage })
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

const shareFile = async (req, res) => {
    const id = req.query[0];
    const email = req.body;
    const user = await UserUpload.findOne(email);
    if (user !== null) {
        try {
            const fileFind = await FileUpload.findOne({ _id: id })
            const arrayShared = fileFind.shared
            if (arrayShared.includes(email.email) === true) {
                return res.status(304).json({ message: "No" })
            } else {
                await FileUpload.findByIdAndUpdate({ _id: id }, { $push: { shared: email.email } }, { new: true });
                return res.status(200).json({
                    status: "success",
                    message: "share success"
                })
            }

        } catch (error) {
            res.status(500).json({
                status: "fail",
                message: "Can't share"
            })
        }
    } else {
        return res.status(403).json({
            status: "fail",
            message: "Email not found"
        })
    }

}
module.exports = {
    getFiles, UploadFile, getOneFile, updateFile, deleteFile, shareFile
}