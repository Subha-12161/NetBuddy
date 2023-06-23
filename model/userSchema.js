const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    active_status: {
        type: Boolean,
        default: 1,
    },
    w_count: {
        type: Number,
        default: 0
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// pass hashing
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//token
userSchema.methods.generateAuthToken = async function () {
    try {

        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: "20m" });

        const user = await User.findOne({ _id: this._id });
        const tokens = user.tokens || [];
        tokens.splice(0, 1, { token: token });
        await User.updateOne({ _id: this._id }, { tokens });
        return token;

    } catch (error) {
        console.log("token err", error);
    }
}

const User = mongoose.model("USER", userSchema);

module.exports = User;