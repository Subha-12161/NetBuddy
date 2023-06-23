require('../db/conn');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ Error: "Fill all field." })
        }

        const dataFound = await User.findOne({ email: email });

        if (dataFound) {
            const isMatch = await bcrypt.compare(password, dataFound.password);

            if (isMatch) {
                const token = await dataFound.generateAuthToken();
                res.cookie("JWT", token, {
                    httpOnly: true
                });

                if (dataFound.w_count > 0) {
                    dataFound.w_count = 0;
                    dataFound.save();
                }
                res.status(202).json({ Message: "User Signin successful" });

            } else {

                if (dataFound.w_count >= 3) {
                    dataFound.active_status = 0;
                    dataFound.save();
                    res.status(400).json({ Message: "Account is not active" });
                } else {
                    dataFound.w_count += 1;
                    dataFound.save();
                    res.status(400).json({ Message: "Username or password is inncorrect" });
                }
            }

        } else {
            res.status(404).json({ Message: "User not found." });
        }
    } catch (error) {
        res.status(400).json({ Error: error });
    }

}

// Registration
const userRegister = async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ Error: "Fill all fields" });
    }
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(422).json({ Error: "Email exists." });
        } else if (password != cpassword) {
            return res.status(422).json({ Error: "Password and confirm password doesn't match." });
        } else {
            const userData = new User({ name, email, password, cpassword });
            await userData.save();
            res.status(201).json({ Message: "Registration Successfull." });
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = { userLogin, userRegister };