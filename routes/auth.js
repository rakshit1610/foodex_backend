const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
// const { body } =  require('express-validator/check');

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.post('/checkOtp', authController.checkOTP);

router.post('/resendOtp', authController.resendOTP);

router.post('/sendResetOtp', authController.sendResetOtp);

router.post('/resetPassword', authController.resetPassword);

router.post('/checkResetOtp', authController.checkResetOtp);

module.exports = router;