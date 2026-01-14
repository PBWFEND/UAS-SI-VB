# 📓 Diary Kuliah API

📌 Anggota Kelompok 
|         Nama          |         NIM         |
|  Yudi Aditiya Rahman  |     230660221014    |
|   Nabila Apriliani    |     230660221126    |

Nama Aplikasi : Web Diary Kuliah
Mata Kuliah   : Pemrograman Berbasis Web - Backend Development
Kelas         : SI-VB
Jenis Proyek  : Project UAS

# 📝 Deskripsi Aplikasi
Web Diary Kuliah adalah aplikasi berbasis web yang digunakan oleh mahasiswa untuk mencatat dan mengelola aktivitas perkuliahan secara digital. Aplikasi ini menyediakan fitur autentikasi pengguna, pembuatan catatan kuliah berdasarkan mata kuliah, serta pengelolaan catatan berupa melihat, mengedit, dan menghapus data diary secara aman. Dengan adanya aplikasi ini, mahasiswa diharapkan dapat mencatat aktivitas perkuliahan secara lebih rapi, terorganisir, dan mudah diakses kapan saja, sekaligus menjadi contoh implementasi backend web modern yang menerapkan autentikasi, manajemen data, dan keamanan API.
Aplikasi dibangun menggunakan arsitektur RESTful API dengan penerapan JWT Authentication untuk menjaga keamanan dan privasi data pengguna. Backend dikembangkan menggunakan Express.js dan Prisma ORM yang terintegrasi dengan database MySQL, sehingga proses pengelolaan data menjadi terstruktur, aman, dan efisien.

---

## 🚀 Fitur Utama
- 🔐 Register & Login User (JWT Auth)
- 👤 Profile User
- 📓 CRUD Diary (One-to-Many User → Diary)
- 🛡️ Proteksi route dengan JWT
- ✅ Validasi input menggunakan express-validator

---

## 🧱 Tech Stack
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator

---

## 📂 Struktur Folder
src/
├── controllers/
│ ├── auth.controller.js
│ ├── diary.controller.js
| ├── user.controller.js
├── routes/
│ ├── auth.routes.js
│ ├── diary.routes.js
│ ├── user.routes.js
├── middleware/
│ └── auth.middleware.js
├── utils/
│ └── prisma.js
├── app.js
└── server.js

---

## 🔐 Authentication API

### 

Register
POST /api/auth/register
{
  "name": "Yudi",
  "email": "yudi@gmail.com",
  "password": "123456"
}

Login
POST /api/auth/login
{
  "email": "yudi@gmail.com",
  "password": "123456"
}

Response:
{
  "token": "JWT_TOKEN"
}

---

## 👤 User API
Get Profile
GET /api/users/profile
Header:

Authorization: Bearer JWT_TOKEN
## 📓 Diary API (Protected)

Get All Diary
GET /api/diaries

Create Diary
POST /api/diaries
{
  "title": "Pemrograman Web",
  "content": "Belajar Express dan Prisma"
}
Update Diary
PUT /api/diaries/:id

Delete Diary
DELETE /api/diaries/:id

---

## 🗄️ Database
Menggunakan Prisma ORM dengan relasi:

User (1) → Diary (Many)

## ▶️ Cara Menjalankan Project
npm install
npx prisma migrate dev
npm run dev

Server berjalan di:
http://localhost:3000

# Email dan Password akses login:

  1. Email : Yudi@gmail.com PW : 123456
  2. Email : Nabila@gmail.com PW : 12345

---

# 🧩 2️⃣ ERD (Entity Relationship Diagram)

## 📊 Struktur Database

### 🧑 User
| Field     | Type    |
| id        |Int (PK) |
| name      |  String |
| email     | String  |
| password  | String  |
| createdAt | DateTime|

### 📓 Diary
| Field     | Type    |
| id        | Int (PK)|
| title     | String  |
| content   | String  |
| userId    | Int (FK)|
| createdAt | DateTime|

---

## 🔗 Relasi
User (1) ────< Diary (Many)

---

## 🖼️ ERD
+------------+ +-------------------+
|   User   |       |   Diary     |
+------------+ +-------------------+
| id (PK)  |◄──────| id (PK)     |
| name     |       | title       |
| email    |       | content     |
| password |       | userId (FK) |
| createdAt|       | createdAt   |
+------------+ +-------------------+

---

# ✅ STATUS AKHIR PROJECT UAS

| Modul            |  Status   | Pembagian Tugas|
| Express.js       |   ✅      | Yudi & Nabila |
| Prisma ORM       |   ✅      | Yudi & Nabila |
| JWT Auth         |   ✅      | Yudi & Nabila |
| Input Validation |   ✅      | Yudi & Nabila |
| Auth API         |   ✅      | Yudi & Nabila |
| User API         |   ✅      | Yudi & Nabila |
| CRUD Diary       |   ✅      | Yudi & Nabila |
| README           |   ✅      | Yudi & Nabila |
| ERD              |   ✅      | Yudi & Nabila |
| Deployment       |   ✅      | Yudi          |

# Dokumentasi
  Link tampilan UI APK dan ERD: https://drive.google.com/drive/folders/1YtmFUeFmBNQlvzsfEgMaHqHizjJIdtvN?usp=drive_link
  Link web netlify: https://diary-kuliah.netlify.app/