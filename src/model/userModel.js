let mongoose = require("mongoose");

let CMS_schema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "SUPERADMIN", "USER"],
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        required: true
    },
    verification_status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "DEACTIVE"
    }
})

CMS_schema.index({ email: 1, status: 1 })

module.exports = mongoose.model("users", CMS_schema)