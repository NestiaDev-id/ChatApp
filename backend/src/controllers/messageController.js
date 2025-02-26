import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const logginUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: logginUserId },
    }).select("-password");

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: filteredUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching users",
      error: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const logginUserId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: logginUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: logginUserId },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching messages",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null; // Default null jika tidak ada gambar

    if (image) {
      // Cek apakah format gambar valid
      const allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
      const fileExtension = image.split(";")[0].split("/")[1]; // Ambil ekstensi dari base64

      if (!allowedFormats.includes(fileExtension)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid image format. Only JPG, PNG, GIF, WEBP allowed.",
        });
      }

      // Cek ukuran gambar sebelum upload
      const base64Size = (image.length * 3) / 4 - 2; // Estimasi ukuran dalam bytes
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (base64Size > maxSize) {
        return res.status(400).json({
          status: "fail",
          message: "Image size exceeds the 5MB limit.",
        });
      }

      // Upload gambar ke Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
        transformation: [{ width: 800, height: 800, crop: "limit" }], // Resize jika terlalu besar
      });

      imageUrl = uploadResponse.secure_url; // Simpan URL gambar dari Cloudinary
    }

    // Buat pesan baru
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Simpan URL gambar jika ada
    });

    await newMessage.save();

    res.status(200).json({
      status: "success",
      message: "Message sent successfully",
      data: newMessage, // Mengembalikan data pesan yang baru dibuat
    });
  } catch (error) {
    console.error("Send Message Error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while sending message",
      error: error.message,
    });
  }
};
