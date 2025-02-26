import { generateAuthToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    // Cek panjang password
    if (!password || password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 13 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    // TODO: Hash password (gunakan bcrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate jwt token
      generateAuthToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token: generateAuthToken(newUser._id, res),
        updatedAt: newUser.updatedAt,
        createdAt: newUser.createdAt,

        status: "success",
        message: "User created successfully",
      });
    }

    // TODO: Simpan user ke database (misalnya MongoDB)

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while signing up",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    // Cari user di database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    // Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid password",
      });
    }

    // Generate jwt token
    generateAuthToken(user._id, res);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error while logging in",
      error: error.message,
    });
    console.log("Error can't signup: " + error.message);
  }
};

export const logout = (req, res) => {
  try {
    // TODO: Logout user (hapus token)
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.header("Authorization", "");
    res.status(200).json({
      status: "success",
      message: "User logged out",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Can't log out",
      error: error.message,
    });
    log("Error can't logout: " + error.message);
  }
};
