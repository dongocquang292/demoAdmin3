const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: { type: String, index: true, required: true },
        email: { type: String, index: true, required: true },
        password: { type: String, index: true, required: true },
        role: { type: String, index: true, default: 'user' }
    },
    { versionKey: false }
)

const UserUpload = mongoose.model("user", userSchema);

module.exports = { UserUpload }