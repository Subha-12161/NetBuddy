const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mobileUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    complaints_count: {
        type: Number,
        required: false,
        default:1
    },
    mobile: {
        type: String,
        required: true
    },
    tokens: {
        type: String,
    }
});

// pass hashing
mobileUserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//token
mobileUserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        const User = this.constructor;
        await User.updateOne({ _id: this._id }, { tokens: token });
        return token;

    } catch (error) {
        console.log("token err", error);
    }
}

const MobileUser = mongoose.model("MOBILEUSER", mobileUserSchema);

module.exports = MobileUser;