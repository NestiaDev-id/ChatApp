import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";

export const updateName = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await user.updateOne({ _id: req.user._id }, { username });

    res.status(200).json({
      status: "success",
      message: "Username updated successfully",
    });
  } catch (error) {
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

    // Upload gambar ke Cloudinary dengan konfigurasi tambahan
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pictures", // Menyimpan gambar ke folder khusus di Cloudinary
      transformation: [{ width: 500, height: 500, crop: "fill" }], // Resize otomatis ke 500x500
    });

    // Update profil user dengan URL gambar yang baru
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // Simpan URL gambar dari Cloudinary
      { new: true } // Kembalikan data terbaru setelah update
    );

    // Jika user tidak ditemukan di database
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Berhasil mengupdate gambar profil, kirim respons ke frontend
    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic, // URL gambar yang telah diperbarui
      },
    });
  } catch (error) {
    // Jika terjadi error di server, tangkap error dan kirimkan respons
    console.error("Update Profile Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message, // Kirim pesan error agar lebih mudah di-debug
    });
  }
};
