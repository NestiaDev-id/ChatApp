import { generateAuthToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
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
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate jwt token
      generateAuthToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
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
        fullName,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const login = (req, res) => {
  res.send("Login page");
};

export const logout = (req, res) => {
  res.send("Logout page");
};
