import { generateAuthToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    // Cek panjang password
    if (password.length < 6) {
      // Hanya perlu cek password.length
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters",
      });
    }

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Simpan user ke database
    await newUser.save();

    // Generate JWT token
    const token = generateAuthToken(newUser._id, res);

    // Kirim response (Hanya 1 kali!)
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        token,
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
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    // Cari user di database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = generateAuthToken(user._id, res);

    // Kirim response (pastikan hanya ada satu response)
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        token, // Kirim token agar frontend bisa menggunakannya
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while logging in",
      error: error.message,
    });
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

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("CheckAuth Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while checking authentication",
      error: error.message,
    });
  }
};
