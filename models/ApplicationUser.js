const mongoose = require("mongoose");

const applicationUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationId: {
        type: String,
    },
    token: { type: String },
});

applicationUserSchema.index({ email: 1 }, { unique: true });

const ApplicationUser = mongoose.model("ApplicationUser", applicationUserSchema);

module.exports = ApplicationUser;