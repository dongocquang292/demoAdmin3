
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
        if (req.file !== undefined) {
            const email = req.body.email;
            const fileName = req.file.originalname
            const fileSize = req.file.size
            const typeFile = req.file.mimetype.split("/")
            const filePackage = await FileUpload.create({ email: email, fileName: fileName, fileSize: fileSize, type: typeFile[0], shared: [] });
            return res.status(200).json({ status: 'success', data: filePackage, img: `http://localhost:8080/${fileName}` })
        } else {
            return res.status(403).json({ status: 'fail', message: 'Pls select file' })
        }

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
        const email = req.email;
        const file = await FileUpload.findById(req.params.id)
        if (email !== file.email) {
            return res.status(403).json({ status: "fail", message: "Do not own to delete" })
        } else {
            const filePackage = await FileUpload.findByIdAndDelete(req.params.id).lean().exec()
            return res.status(200).json({ status: 'success', data: filePackage })
        }

    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message })
    }
}

const shareFile = async (req, res) => {
    const id = req.query[0];
    const email = req.body.email;
    const file = await FileUpload.findById(id)
    if (file.email !== req.body.emailCurrent) {
        res.status(403).json({ status: "fail", message: "Must be the owner of the shared file" })
    } else {
        const user = await UserUpload.findOne({ email: email });
        if (user !== null) {
            try {
                const fileFind = await FileUpload.findOne({ _id: id })
                const arrayShared = fileFind.shared
                if (arrayShared.includes(email) === true) {
                    return res.status(304).json({ message: "No" })
                } else {
                    await FileUpload.findByIdAndUpdate({ _id: id }, { $push: { shared: email } }, { new: true });
                    return res.status(200).json({
                        status: "success",
                        message: "share success",

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
}

const deleteShared = async (req, res) => {
    try {
        const emailDS = req.body.emailDS;
        const id = req.body.idFile;
        const file = await FileUpload.findById({ _id: id })
        const arrShared = file.shared
        const index = arrShared.indexOf(emailDS)
        if (index > -1) {
            arrShared.splice(index, 1);
        }

        await FileUpload.findByIdAndUpdate({ _id: id }, { shared: arrShared }, { new: true })
        res.status(200).json({ status: "success", message: "Deleted Share", newShared: arrShared })
    } catch (error) {
        res.status(400).json({ status: "fail", message: `Can't Delete Share` })
    }
}
module.exports = {
    getFiles, UploadFile, getOneFile, updateFile, deleteFile, shareFile, deleteShared
}