# ChatApp

**Real-Time Multi-User Messaging Platform**

![ChatApp Logo](assets/chatapp-logo.png) <!-- Ganti atau hapus jika belum ada logonya -->

---

## 💬 What is ChatApp?

**ChatApp** adalah aplikasi chatting multi-user yang memungkinkan pengguna untuk berinteraksi secara real-time dengan kontak mereka. Aplikasi ini dirancang untuk pengalaman komunikasi yang cepat, ringan, dan modern, lengkap dengan dukungan pengiriman pesan teks, gambar, dan interaksi dinamis berbasis socket.

---

## 🌟 Key Features

- ⚡ **Real-Time Messaging**  
  Komunikasi langsung antar pengguna menggunakan Socket.IO.

- 🧑‍🤝‍🧑 **Multi-User Support**  
  Setiap pengguna memiliki daftar kontak untuk memulai percakapan pribadi atau grup.

- 🖼️ **Image Uploads via Cloudinary**  
  Kirim dan tampilkan gambar dengan integrasi penyimpanan cloud yang aman.

- 🔒 **Authentication System** *(Opsional)*  
  Sistem login dan register dengan keamanan dasar.

- 📱 **Responsive UI**  
  Tampilan yang ramah di perangkat desktop maupun mobile.

---

## 🛠️ Tech Stack

| Layer       | Teknologi             |
|-------------|-----------------------|
| Frontend    | ViteJS (React)        |
| Backend     | Node.js + Express     |
| Real-time   | **Socket.IO**         |
| Media       | **Cloudinary**        |
| Database    | MongoDB (Mongoose)    |

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/username/chatapp.git
cd chatapp
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Setup Backend
```bash
cd frontend
npm install
npm run dev
```

### ⚙️ Future Enhancements
- 🔔 Notifikasi real-time
- 🟢 Status online/offline pengguna
- 🔍 Pencarian kontak
- 📞 Fitur panggilan suara/video (WebRTC)
