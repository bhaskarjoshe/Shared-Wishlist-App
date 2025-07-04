import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import logger from "../config/logger.js";
import jwt from "jsonwebtoken"


const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username or password is missing" });
    }

    const user = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [username]
    );
    if (user.rows.length > 0) {
      return res.status(409).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await pool.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING id", [
      username,
      hashedPassword,
    ]);

    const userID = insertResult.rows[0].id
    console.log(userID)

    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    logger.info(`User registered: ${username}`);
    return res.status(201).json({ message: "user registered successfully" , token});
  } catch (error) {
    logger.error("SignUp error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username or password is missing" });
    }
    const user = await pool.query(
      "SELECT id,username,password FROM users WHERE username=$1",
      [username]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "user doesn't exist" });
    }

    const hashedPassword = user.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    logger.info(`User signed in: ${username}`);
    return res.status(200).json({ message: "user sign in successful", token });
  } catch (error) {
    logger.error("SignIn error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export { signUp, signIn };
