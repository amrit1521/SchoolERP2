import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

   
    const [rows] = await db.query(
      "SELECT id, email, password, type_id, firstname, lastname, mobile, status, remark FROM users WHERE email = ? LIMIT 1",
      [email]
    );

 
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const user = rows[0];

 
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

 
    const token = jwt.sign(
      { id: user.id, role: user.type_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

 
    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
