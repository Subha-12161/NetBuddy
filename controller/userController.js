require('../db/conn');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ Message: "Please Enter Email." })
        }
        if (!password) {
            return res.status(400).json({ Message: "Please Enter Password." })
        }

        const dataFound = await User.findOne({ email: email });

        if (dataFound) {
            const isMatch = await bcrypt.compare(password, dataFound.password);

            if (isMatch && dataFound.w_count < 3) {
                const token = await dataFound.generateAuthToken();
                res.cookie("JWT", token, {
                    httpOnly: true
                });

                res.status(202).json({
                    Message: "User Signin successful",
                    JWT: token,
                });
            } else {
                if (dataFound.w_count >= 3) {
                    dataFound.active_status = 0;
                    dataFound.save();
                    res.status(400).json({ Message: "Account is not active contact admin" });
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

    if (!name) {
        return res.status(422).json({ Message: "Please Enter Name" });
    }
    if (!email) {
        return res.status(422).json({ Message: "Please Enter Email" })
    }
    if (!password) {
        return res.status(422).json({ Message: "Please Enter Password" })
    }
    if (!cpassword) {
        return res.status(422).json({ Message: "Please Confirm Password" })
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(422).json({ Message: "Email exists." });
        } else if (password != cpassword) {
            return res.status(422).json({ Message: "Password and confirm password doesn't match." });
        } else {
            const userData = new User({ name, email, password, cpassword });
            await userData.save();
            res.status(201).json({ Message: "Registration Successfull , Login to continue." });
        }

    } catch (error) {
        return res.status(500).json({ Error: error });
    }
}

// Reset Password
const forgetPassword = async (req, res) => {
    const email = req.body.email;

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'makenna.glover@ethereal.email',
            pass: '5RwM5H2cUE5EY8stsF'
        }
    });


        const info = await transporter.sendMail({
            from: 'srout12161@gmail.com', 
            to: email,
            subject: "Hello ✔", 
            text: "Hello world?", 
            html: "<b>Hello world?</b>",
        });
    
        if(info.accepted != null){
            console.log(info.accepted);
        }
    res.json(info);

}


module.exports = { userLogin, userRegister, forgetPassword };