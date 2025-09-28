const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require('../../utils/sendEmail');
const sendSms = require("../../utils/sendOtpViaMobile");
require('dotenv').config()


// ===================== LOGIN =====================
exports.login = async (req, res) => {
  console.log("hit me")
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    // === Find user ===
    const [users] = await db.query(
      "SELECT id, email, password ,type_id FROM users WHERE email = ? LIMIT 1",
      [email]
    );


    if (!users || users.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const user = users[0];

    // === Compare password ===
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    // === Generate JWT ===
    const token = jwt.sign(
      { id: user.id, role: user.type_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// FORGOT PASSWORD =====================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;


    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email,]);
    if (!users || users.length === 0) {
      return res
        .status(403)
        .json({ message: "Please provide a valid email!", success: false });
    }


    const otp = Math.floor(100000 + Math.random() * 900000);


    await db.query(
      "UPDATE users SET reset_otp=?, reset_otp_expiry=? WHERE email=?",
      [otp, Date.now() + 10 * 60 * 1000, email]
    );

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({
      message: "OTP sent to email",
      success: true,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};


//VERIFY OTP + UPDATE PASSWORD =====================
exports.verifyOtpAndUpdatePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email=? AND reset_otp=? LIMIT 1",
      [email, otp]
    );

    if (!users || users.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid OTP or email", success: false });
    }

    const user = users[0];

    if (Date.now() > user.reset_otp_expiry) {
      return res
        .status(400)
        .json({ message: "OTP expired", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE users SET password=?, reset_otp=NULL, reset_otp_expiry=NULL WHERE email=?",
      [hashedPassword, email]
    );

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};


// otp send on mobile number 
exports.sendOtpMobile = async (req, res) => {
  const { mobile } = req.body;

  try {
    const [user] = await db.query("SELECT id FROM users WHERE mobile=?", [mobile]);
    if (!user.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 10 * 60 * 1000;

    await db.query("UPDATE users SET reset_otp=?, reset_otp_expiry=? WHERE id=?", [otp, expiry, user[0].id]);

    await sendSms(mobile, otp); 

    return res.json({ success: true, message: `OTP sent to on phone number ${mobile} successfull`});

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error while sending otp via sms', success: false })
  }
};
