import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { validateData } from "../utils/dataValidation.js";

import User from "../Models/authModel.js";

dotenv.config();

const PassUserMax = 249;

//Takes a username and password
async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    let validation = [{ username: username, password: password }];
    // Data validation
    validateData(validation, [
      ["username", "string", PassUserMax],
      ["password", "string", PassUserMax],
    ]);
    // Check if username exists already
    const existUser = await User.findOne({
      where: {
        UserName: username,
      },
    });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      UserId: uuidv4(),
      UserName: username,
      Password: hashedPassword,
    });
    if (!newUser) {
      return res.status(500).json({
        message: "Failed to create user",
        success: false,
      });
    }
    // Generate a JWT token and set it in a cookie
    const token = jwt.sign(
      { id: newUser.UserId, username: newUser.UserName },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // Set the token in a cookie
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "true",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    //Send
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    next(error);
  }
}
//Takes a username and password
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const validation = [{ username: username, password: password }];
    // Data validation
    validateData(validation, [
      ["username", "string", PassUserMax],
      ["password", "string", PassUserMax],
    ]);
    // Check if username exists
    const user = await User.findOne({
      where: {
        UserName: username,
      },
    });
    //Compare password with the hashed password in the database and check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    // Generate a JWT token and set it in a cookie
    const token = jwt.sign(
      { id: user.UserId, username: user.UserName },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "true",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    next(error);
  }
}

export { register, login };
