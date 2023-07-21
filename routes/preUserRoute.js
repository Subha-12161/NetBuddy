require('../db/conn');
const express = require('express');
const router = express.Router();
const mobileUserController = require('../controller/mobileUserController.js');

router.post('/signup',mobileUserController.signup);
router.post('/login',mobileUserController.login);
router.post('/checkuser',mobileUserController.checkuser);
router.post('/updatepassword',mobileUserController.forgetPassword);


module.exports = router;