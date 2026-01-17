# 🌸 Blossom Tasks - Aplikasi Manajemen Tugas 

**Blossom Tasks** adalah aplikasi *To-Do List* bertema bunga yang dirancang untuk memberikan pengalaman manajemen tugas yang menenangkan. Proyek ini dikembangkan menggunakan stack **MERN/MEVN** (React/Node.js) untuk memenuhi syarat mata kuliah **UAS Pemrograman Berbasis Web Back-end**.

---

## 🎨 Gambaran Proyek
Aplikasi ini berfokus pada keseimbangan antara fungsionalitas backend yang tangguh dan keindahan antarmuka (UI). Dengan fitur unik seperti *Mood Tracker* dan animasi kelopak bunga melayang, Blossom Tasks mengubah daftar tugas yang membosankan menjadi taman produktivitas yang indah.

### Fitur Utama:
- **Autentikasi Aman**: Login dan Register menggunakan enkripsi password dan JWT.
- **Task Management**: CRUD lengkap (Create, Read, Update, Delete) tugas.
- **Mood Tracker Sidebar**: Fitur interaktif untuk mencatat perasaan pengguna.
- **Smart Search Bar**: Pencarian tugas secara real-time.
- **Progress Bloom**: Statistik otomatis untuk melihat persentase tugas yang selesai.
- **Loading State**: Feedback visual "Sedang menanam tugas..." saat memproses data API.
- **Responsive Design**: Tampilan Sidebar yang otomatis menyesuaikan diri di perangkat mobile.

---

## 📊 ERD (Entity Relationship Diagram)
Skema database yang menghubungkan antara akun pengguna dan tugas-tugasnya.
```text
[ User ] ---1:N--- [ Task ]
  - id (PK)          - id (PK)
  - name             - user_id (FK)
  - email            - title
  - password         - isCompleted
                     - createdAt
```

## 🛠️ Alur Aplikasi 
Berikut adalah gambaran bagaimana data mengalir di dalam aplikasi Blossom:

**🚀 Panduan Instalasi & Setup**
1. Persyaratan Sistem
- Node.js (Versi 16 ke atas)
- MongoDB Atlas atau MySQL Lokal
- Akun Git

2. Konfigurasi Environment (.env)
```
PORT=3000
DATABASE_URL=mongodb+srv://yellyambarwaty:yelly12345@cluster0.px5y9ky.mongodb.net/?appName=Cluster0
JWT_SECRET=blossom_secret_key_2026_uas_proweb
```

3. Menjalankan Backend
```
cd backend
npm install
npm start
```

4. Menjalankan Frontend
```
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment
- Frontend: Netlify
- Live URL: 🔗 https://blossomtasks.netlify.app/
- Backend: Local Server (port 3000)

## 👩🏻‍💻 Account Testing
 ```
 "email": "yelly@kelompok1.com"
  "password": "Yelly12345"

  "email": "nazwa@kelompok1.com",
  "password": "Nazwa123456"

  "email": "fitri@kelompok1.com",
  "password": "Fitri12345"

  "email": "tika@kelompok1.com",
  "password": "Tika12345"
```

---

## 📌 Dokumentasi Endpoint API
|Method|Endpoint|Deskripsi|
|---|---|---|
|POST|/api/auth/register|Membuat akun gardener baru|
|POST|/api/auth/login|Login dan mendapatkan JWT Token|
|GET|/api/tasks|Mengambil semua daftar tugas milik user|
|POST|/api/tasks|Menanam/menambahkan tugas baru|
|PUT|/api/tasks/:id|Memperbarui status selesai tugas|
|DELETE|/api/tasks/:id|Menghapus tugas dari taman|

---

## 👥 Kontribusi Kelompok 1 
Kerja sama tim dalam pengembangan Blossom Tasks:
|Nama|NPM|Kontribusi|
|---|---|---|
|**Yelly Ambarwaty**|230660221033|UI/UX, Frontend Developer, Deployment, Documentation, Postman|
|**Nazwa Umaira Nanindia Ramdhani**|230660221008|RESTful API, Skema database, Keamanan JWT|
|**Tika Anggraeni**|230660221098|Postman, Pengujian fungsionalitas (CRUD), Frontend Developer|
|**Fitri Cahyani**|230660221028|RESTful API, UI/UX, API Integration|
