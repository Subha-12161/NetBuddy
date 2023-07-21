const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const mobileUser = require("../model/mobileUserSchema");

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.JWT;
        if (!token) {
            return res.render('user/login');
        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

        const findUser = await User.findOne({ _id: verifyToken._id, tokens: token });

        if (!findUser) { throw new Error('User not found') };

        req.token = token;
        req.rootUser = findUser;
        req.userID = findUser._id;

        next();

    } catch (error) {
        console.error(error);
        res.render('user/login');
    }
}

const userAuthenticate = async (req, res, next) => {
    try {
        const token = req.body.JWT;
        if (!token) {
            return res.send('NO token');
        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        const findUser = await mobileUser.findOne({ _id: verifyToken._id, tokens: token });

        if (!findUser) { throw new Error('User not found') };

        req.token = token;
        req.rootUser = findUser;
        req.userID = findUser._id;

        next();

    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "failed", msg: "Unauthorized access" });
    }
}

module.exports = { Authenticate, userAuthenticate };
