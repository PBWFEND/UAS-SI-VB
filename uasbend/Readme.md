✈️ Flight Schedule Management API - Kelompok 5

Deskripsi Aplikasi

Flight Schedule Management API adalah RESTful API backend yang dibangun menggunakan Express.js, Prisma ORM, dan JWT Authentication.
Aplikasi ini digunakan untuk mengelola jadwal penerbangan milik pengguna, di mana setiap pengguna hanya dapat mengakses dan mengelola data penerbangan yang dimilikinya sendiri.

Sistem ini menerapkan relasi One-to-Many, yaitu:

Satu User dapat memiliki banyak Flight

Satu Flight hanya dimiliki oleh satu User

API ini dirancang untuk digunakan oleh frontend berbasis web (React) sebagai dashboard manajemen jadwal penerbangan.

ERD (Entity Relationship Diagram)
User
--------------------------------
id (PK)
name
email
password
role
createdAt
--------------------------------
1
|
|
∞
--------------------------------
FlightSchedule 
--------------------------------
id (PK)
flightNumber
origin
destination
date
time
userId (FK)
createdAt
--------------------------------


Relasi:

User (1) → Flight (Many)

Foreign Key: userId pada tabel FlightSchedule 

Cara Setup & Menjalankan Project
1. Menyiapkan Project

Project ini dikerjakan di dalam repository kelas yang disediakan oleh dosen.
Masuk ke folder backend UAS, misalnya:

D:\kelompok5\UAS-SI-VB\uasbend
cd backend

2. Install Dependency
npm install

3. Konfigurasi Environment

Buat file .env berdasarkan .env.example:

# Database connection (MySQL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# JWT
JWT_SECRET="your_jwt_secret_here"

# Server
PORT=3000


4. Setup Prisma & Database
npx prisma migrate dev
npx prisma generate

5. Menjalankan Server
npm run dev


Server akan berjalan di:

http://localhost:3000

Endpoint Penting
Authentication
Method	Endpoint	Deskripsi
POST	/api/auth/register	Registrasi user
POST	/api/auth/login	Login user & mendapatkan JWT
User
Method	Endpoint	Deskripsi
GET	/api/users/profile	Mengambil profil user (JWT Required)
Flight (Protected – JWT Required)
Method	Endpoint	Deskripsi
GET	/api/flights	Mengambil seluruh flight milik user
POST	/api/flights	Menambahkan flight baru
PUT	/api/flights/:id	Update flight milik user
DELETE	/api/flights/:id	Menghapus flight milik user

🔒 Ownership Rule:
User tidak dapat mengakses atau memodifikasi flight milik user lain.
Jika User A mencoba menghapus Flight milik User B, maka API akan menolak request.

Kontribusi Tiap Anggota Kelompok
Nama Anggota	Peran	Kontribusi
Marsya Anastasya (230660221100)	Backend Engineer	Setup Express, struktur project
Marsya Anastasya (230660221100)	Database Engineer	Prisma schema, relasi database
Marsya Anastasya (230660221100)	Auth Specialist	JWT, bcrypt, middleware auth
Intan Nurdewi Sekarnasih (230660221089)	CRUD User, Flight, validasi, integrasi backend
Talitha Ardelia Ivana (23066022114) Frontend	CRUD Flight, validasi, integrasi frontend & UI Frontend
Aisyah Triwulandari (230660221084) DevOps/Deployment & Dokumentasi (README + API Docs + ERD)
Seluruh anggota memahami keseluruhan sistem dan berkontribusi aktif dalam pengembangan.

Catatan

Backend menggunakan Express.js

Database dikelola dengan Prisma ORM

Autentikasi menggunakan JWT

Password di-hash menggunakan bcrypt

Validasi input menggunakan express-validator

# Link Deployment 

User :
1. admin@flight.com : password123
2. marsya@gmail.com : 212121
3. intannur@gmail.com : 555
4. aisyah@gmail.com : 0125
5. talitha@gmail.com : 060605