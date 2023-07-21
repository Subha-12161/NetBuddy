require('../db/conn');
const User = require('../model/mobileUserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
const login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        const dataFound = (!email) ? await User.findOne({ mobile }) : await User.findOne({ email });

        if (dataFound) {

            const isMatch = await bcrypt.compare(password, dataFound.password);

            if (isMatch) {

                const token = await dataFound.generateAuthToken();

                res.status(202).json({
                    status: "success", msg: "User Signin successful",
                    JWT: token,
                    data: {
                        "id": dataFound._id,
                        "name": dataFound.name,
                        "email": dataFound.email,
                        "password": dataFound.password,
                        "mobile": dataFound.mobile,
                    }
                });
            } else {
                res.status(200).json({ status: "failed", msg: "Username or password is inncorrect" });
            }

        } else {
            res.status(200).json({ status: "failed", msg: "User not found" });
        }
    } catch (error) {
        res.status(200).json({ Error: error });
    }

}

// Registration
const signup = async (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
        const userExists = await User.findOne({ email });
        const Exists = await User.findOne({ mobile });

        let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        let result = regex.test(email);

        if (userExists) {
            return Exists ? res.status(200).json({ status: "failed", msg: "Mobile number exists." }) : res.status(200).json({ status: "failed", msg: "Email exists." });
        } else {
            if (result) {
                const userData = new User({ name, email, password, mobile });
               
                await userData.save();
                console.log("Registration Successfull." );

                res.status(201).json({ status: "success", msg: "Registration Successfull." });
            } else {
                console.log("Email is not valid");
                return res.status(200).json({ status: "failed", msg: "Email is not valid" });
            }
        }
    } catch (error) {
        return res.status(500).json({ Error: error });
    }
}

// checkuser
const checkuser = async (req, res) => {
    try {
        const { emailPhone } = req.body;
        if (!emailPhone) {
            return res.status(200).json({ status: "failed", msg: "Enter email or mobile number" });
        } else {
            const data = await User.findOne({ $or: [{ email: emailPhone }, { mobile: emailPhone }] });
            data ? res.status(202).json({ status: "success", msg: "User found" }) : res.status(200).json({ status: "failed", msg: "User not found." });
        }
    } catch (error) {
        return res.status(500).json({ status: "failed", msg: error });
    }
}

// Reset Password
const forgetPassword = async (req, res) => {
    try {
        const { emailPhone, password } = req.body;
        if (!emailPhone || !password) {
            return res.status(200).json({ status: "failed", msg: "Enter email or mobile number." });
        } else {
            const hashPassword = await bcrypt.hash(password, 12);
            const result = await User.findOneAndUpdate({ $or: [{ email: emailPhone }, { mobile: emailPhone }] }, { password: hashPassword })
            result ? res.status(202).json({ status: "success", msg: "Password update successful" }) : res.status(200).json({ status: "failed", msg: "Failed to update password" });
        }
    } catch (error) {
        return res.status(200).json({ status: "failed", msg: error });
    }
}


module.exports = { signup, login, checkuser, forgetPassword };