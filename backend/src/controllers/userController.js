import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";

export const updateName = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user?._id; // Pastikan user sudah login

    // Cek apakah user sudah login
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized. Please login again.",
      });
    }

    // Validasi username
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        status: "fail",
        message: "Username must be at least 3 characters long.",
      });
    }

    // Update username di database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true, runValidators: true } // Mengembalikan data terbaru & validasi input
    );

    // Jika user tidak ditemukan
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Berhasil mengupdate username
    res.status(200).json({
      status: "success",
      message: "Username updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error("Update Name Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Gambar yang dikirim dari frontend
    const userId = req.user?._id; // Ambil ID user dari request (harus login terlebih dahulu)

    // Pastikan user sudah login sebelum mengupdate profil
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized. Please login again.",
      });
    }

    // Periksa apakah user mengirimkan gambar profil atau tidak
    if (!profilePic) {
      return res.status(400).json({
        status: "error",
        message: "Profile picture is required",
      });
    }

    // Cek format gambar yang diterima
    const allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = profilePic.split(";")[0].split("/")[1]; // Ambil ekstensi dari base64

    if (!allowedFormats.includes(fileExtension)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid image format. Only JPG, PNG, GIF, WEBP allowed.",
      });
    }

    // Estimasi ukuran gambar dalam base64 (dalam bytes)
    const base64Size = (profilePic.length * 3) / 4 - 2;
    const maxSize = 2 * 1024 * 1024; // Maksimal 2MB

    if (base64Size > maxSize) {
      return res.status(400).json({
        status: "fail",
        message: "Image size exceeds the 2MB limit.",
      });
    }

    // Upload gambar ke Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(profilePic, {
      folder: "profile_pictures", // Simpan di folder khusus Cloudinary
      transformation: [{ width: 500, height: 500, crop: "fill" }], // Resize ke 500x500
    });

    // Update profil user dengan URL gambar yang baru
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // Simpan URL gambar dari Cloudinary
      { new: true } // Kembalikan data terbaru setelah update
    );

    // Jika user tidak ditemukan
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Berhasil mengupdate gambar profil
    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic, // URL gambar yang diperbarui
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};
