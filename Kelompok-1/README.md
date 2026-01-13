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


## 🛠️ Alur Aplikasi 
Berikut adalah gambaran bagaimana data mengalir di dalam aplikasi Blossom:

**🚀 Panduan Instalasi & Setup**

1. Persyaratan Sistem
- Node.js (Versi 16 ke atas)
- MongoDB Atlas atau MySQL Lokal
- Akun Git

2. Konfigurasi Environment (.env)
Buat file .env di folder backend dan isi dengan parameter berikut (gunakan .env.example sebagai referensi):

Cuplikan kode
PORT=3000
DATABASE_URL=isi_dengan_url_database_anda
JWT_SECRET=kata_rahasia_untuk_keamanan_token

3. Menjalankan Backend
cd backend
npm install
npm start

4. Menjalankan Frontend
cd frontend
npm install
npm run dev

## 📌 Dokumentasi Endpoint API
Method,Endpoint,Deskripsi
POST,/api/auth/register,Membuat akun gardener baru
POST,/api/auth/login,Login dan mendapatkan JWT Token
GET,/api/tasks,Mengambil semua daftar tugas milik user
POST,/api/tasks,Menanam/menambahkan tugas baru
PUT,/api/tasks/:id,Memperbarui status selesai tugas
DELETE,/api/tasks/:id,Menghapus tugas dari taman

## 👥 Kontribusi Kelompok 1 
Kerja sama tim dalam pengembangan Blossom Tasks:
1. **Yelly Ambarwaty** (230660221033) - Lead UI/UX & Frontend Developer
- Bertanggung jawab atas desain estetik Blossom, animasi CSS, dan seluruh logika React (TaskPage, Mood Tracker).
2. **Nazwa Umaira Nanindia Ramdhani** (230660221008)- Backend Specialist
- Membangun RESTful API menggunakan Express.js dan mengatur skema database serta keamanan JWT.
3. **Fitri Cahyani** (230660221028)- API Integration & QA
- Menghubungkan Frontend dengan API, mengelola Loading States, dan melakukan pengujian fungsionalitas (CRUD).
4. **Tika Anggraeni** (230660221098) - Deployment & Documentation
- Mengelola hosting di Railway/Netlify, menyusun README, ERD, dan menyiapkan aset presentasi.

