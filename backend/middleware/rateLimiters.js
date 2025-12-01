
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
  message: { success: false, message: 'Too many login attempts. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false, 
  handler: (req, res) => {
    return res.status(429).json({ success: false, message: 'Too many login attempts. Try again after 15 minutes.' });
  },
});


const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, 
  message: { success: false, message: 'Too many password reset attempts. Try again after 60 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});


module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
};
