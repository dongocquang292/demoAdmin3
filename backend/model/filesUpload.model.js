const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filesUploadSchema = new mongoose.Schema(
    {
        email: { type: String, index: true, required: true },
        fileName: { type: String, index: true, required: true },
        fileSize: { type: Number, index: true, required: true },
        type: { type: String, index: true, required: true },
        shared: []
    },
    { versionKey: false }
)

const FileUpload = mongoose.model("file", filesUploadSchema);

module.exports = { FileUpload }