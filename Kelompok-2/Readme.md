# Sistem Absensi Digital Perkuliahan

## Gambaran Umum

Sistem Absensi Digital Perkuliahan adalah aplikasi berbasis web untuk pengelolaan kehadiran mahasiswa secara digital.  

Tujuan pengembangan sistem:
- Menggantikan absensi manual
- Mengurangi kesalahan pencatatan
- Mempermudah monitoring kehadiran
- Mendukung sistem akademik berbasis teknologi

## **Peran Pengguna (User Roles)**

Aplikasi memiliki **3 peran utama pengguna**, yaitu **Admin**, **Dosen**, dan **Mahasiswa**, dengan hak akses sebagai berikut:

### 1. **Admin**
- **Mengelola data mahasiswa, dosen, dan mata kuliah** melalui operasi CRUD (Create, Read, Update, Delete).
- Bertanggung jawab atas **pengaturan dan pengelolaan sistem secara keseluruhan**.

### 2. **Dosen**
- **Membuka sesi absensi secara real-time**, menghasilkan **kode absensi unik** untuk keamanan.
- **Melihat daftar hadir mahasiswa** pada setiap pertemuan.
- **Mengunduh rekap absensi** dalam bentuk **PDF**, baik **per pertemuan** maupun **rekap semester**.

### 3. **Mahasiswa**
- **Melihat sesi absensi aktif** sesuai **mata kuliah yang diambil**.
- **Memasukkan kode absensi** dari dosen.
- **Mengunduh laporan absensi PDF** berdasarkan **filter mata kuliah**, dengan link hasil PDF tersedia di **Google Drive**.

---

## Teknologi yang Digunakan

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JSON Web Token (JWT)
- Bcrypt
- express-validator

### Frontend
- React.js
- Vite
- Axios
- CSS

---

## Arsitektur Data dan Relasi (ERD)

Relasi utama menggunakan pola One-to-Many:
- User (Dosen) → Course
- Course → AbsenceSession
- AbsenceSession → Attendance
- User (Mahasiswa) → Attendance

---

## Setup dan Menjalankan Aplikasi

### Backend
1. Masuk ke folder backend-absensi  
2. Install dependency

    npm install

3. Konfigurasi environment  
   Salin `.env.example` menjadi `.env`

4. Migrasi database

    npx prisma migrate dev

5. Jalankan server

    npm run dev

Backend:
http://localhost:3000

---

### Frontend
1. Masuk ke folder frontend-absensi  
2. Install dependency

    npm install

3. Jalankan aplikasi

    npm run dev

Frontend:
http://localhost:5173

---

## Endpoint Utama

- POST /api/auth/register-admin
- POST /api/auth/register-dosen
- POST /api/auth/register-mahasiswa
- POST /api/auth/login

Keamanan:
- JWT Authentication
- Role-based access
- Ownership validation

---

## Deployment

- Backend: Server lokal (Port 3000)
- Frontend (Netlify):
  https://sistem-absen-digital.netlify.app

---

## Dokumentasi Pendukung

Dokumentasi mencakup:
- Implementasi sistem
- Tampilan aplikasi
- Endpoint API REGISTER & LOGIN

Link:
https://drive.google.com/drive/folders/1kLFpbEcSSHx--OqP6dccxNZkf7NJUnqZ

---

## 👥 Anggota Kelompok dan Kontribusi  
- 230660221018    Intan Kartika
- 230660221094    Kikania Zahra
- 230660221030    Syifa Nur Insani
- 230660221113    Muhammad Andre Nugraha
  
| No | Nama | Peran | Kontribusi |
|----|-----------------------------------------------|----------------------|--------------------------------------------------------------|
| 1 | Intan Kartika | Backend Engineer | Struktur project dan setup Express.js |
| 2 | Intan Kartika & Kikania Zahra | Database Engineer | Perancangan schema Prisma, relasi database, dan migrasi |
| 3 | Kikania Zahra, Intan Kartika & Muhammad Andre| Auth Specialist | Implementasi JWT, hashing password, dan middleware |
| 4 | Kikania Zahra, Syifa Nur Insani & Intan Kartika | CRUD Specialist | Implementasi rute resource (Course, Session, Attendance) |
| 5 | Muhammad Andre & Intan Kartika | DevOps / Deployment | Setup server lokal dan deployment Netlify |
| 6 | Syifa Nur Insani, Muhammad Andre & Intan Kartika | UI/UX & Testing | Desain UI dashboard, testing, dan validasi sistem |
| 7 | Syifa Nur Insani & Intan Kartika | Dokumentasi | Penyusunan README.md, API Docs |  

---  

