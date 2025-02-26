import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Ambil token dari cookie atau header
    let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Not authorized to access this route (No Token Found)",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek jika token sudah expired
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        status: "fail",
        message: "Token has expired",
      });
    }

    // Cari user berdasarkan ID
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Kirim user ke route handler berikutnya
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({
      status: "fail",
      message: "Not authorized to access this route (Invalid Token)",
    });
  }
};
