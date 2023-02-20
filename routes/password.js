const express = require('express');

const forgotPassControlls = require('../controllers/password');


const router = express.Router();


router.use('/forgotpassword', forgotPassControlls.forgotPassword);
router.get('/reset/:id',forgotPassControlls.resetPassword);
router.get('/update/:id',forgotPassControlls.updatePassword)

module.exports = router;