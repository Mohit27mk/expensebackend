

const e = require('express');
const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup',userController.postAddUser);

router.post('/login',userController.postLoginUser);



module.exports = router;
