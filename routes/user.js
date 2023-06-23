require('../db/conn');
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/register', userController.userRegister);
router.post('/signin', userController.userLogin);


module.exports = router;