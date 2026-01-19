# Sistem Penjualan Beras Pabrik BSM

## Deskripsi Proyek

Sistem Penjualan Beras Pabrik BSM merupakan aplikasi berbasis web yang digunakan untuk mengelola proses penjualan beras secara online.  
Aplikasi ini dikembangkan sebagai tugas **Ujian Akhir Semester (UAS)** mata kuliah **Pemrograman Berbasis Web Back-End**.

Aplikasi menerapkan arsitektur **client–server** dengan backend berupa **REST API** dan frontend berbasis **Single Page Application (SPA)**.

---

## Teknologi yang Digunakan

### Backend

- Node.js
- Express.js
- MySQL
- Prisma ORM
- JSON Web Token (JWT)

### Frontend

- React (Vite)
- Axios
- Tailwind CSS

---

## Fitur Aplikasi

- Autentikasi pengguna (Login & Register)
- Role pengguna: Admin, Karyawan, Konsumen, Owner
- Manajemen produk beras (CRUD)
- Transaksi pembelian produk
- Upload bukti pembayaran
- Verifikasi pembayaran
- Riwayat transaksi konsumen
- Proteksi route berdasarkan role

---

## Entity Relationship Diagram (ERD)

```text
User (id_user, username, password, role)
   |
   | 1..N
   |
Transaksi (id_tmc, id_user, tanggal, total_harga, status_pembayaran)
   |
   | 1..N
   |
Detail_Transaksi (id_detail, id_tmc, id_produk, qty)

Produk (id_produk, nama_produk, harga, stok, satuan, img)
Struktur Folder
text
Salin kode
UAS_PBW
│
├── bsm-backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── prisma
│   ├── index.js
│   └── package.json
│
└── bsm-frontend
    ├── src
    │   ├── pages
    │   ├── components
    │   ├── services
    │   └── context
    └── package.json
Konfigurasi Environment
Backend (.env)
env
Salin kode
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/bsm_db
JWT_SECRET=bsm_secret_key
Frontend (.env)
env
Salin kode
VITE_API_URL=https://bsm-backend-production.up.railway.app/api
Menjalankan Aplikasi
Menjalankan Backend
bash
Salin kode
cd bsm-backend
npm install
npm start
Menjalankan Frontend
bash
Salin kode
cd bsm-frontend
npm install
npm run dev
Deployment
Backend: Railway
https://bsm-backend-production.up.railway.app

Frontend: Netlify
https://bsm-frontend.netlify.app

Akun Uji Coba
text
Salin kode
ADMIN
username: admin
password: admin123

KONSUMEN
username: konsumen
password: konsumen123
Endpoint API
Method	Endpoint	Keterangan
POST	/api/login	Login user
POST	/api/register	Registrasi user
GET	/api/produk	Ambil data produk
POST	/api/produk	Tambah produk
PUT	/api/produk/:id	Update produk
DELETE	/api/produk/:id	Hapus produk
POST	/api/transaksi	Buat transaksi
GET	/api/transaksi	Riwayat transaksi

Anggota Kelompok 8
Ghatan Zalfaa Kautsar	230660221001	Backend Developer
-	-	Frontend Developer
-	-	Database & Testing
Ridho Akmal Aulia 230660221024
-	-	Dokumentasi
```
