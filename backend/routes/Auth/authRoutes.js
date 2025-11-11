const router = require('express').Router()
const authController = require('../../Controller/Auth/authController')
const {loginLimiter , forgotPasswordLimiter} = require('../../middleware/rateLimiters')


router.post('/login' ,loginLimiter , authController.login)
router.post('/forgot-password',forgotPasswordLimiter , authController.forgotPassword)
router.post('/reset-password' , authController.verifyOtpAndUpdatePassword)
router.post('/create' , authController.createAccount)
router.delete('/deleteacc/:id' , authController.deleteAccount)


// only for trial
router.post("/send-otp-mobile", authController.sendOtpMobile);

module.exports = router;