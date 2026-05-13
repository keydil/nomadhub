# NomadHub Product Roadmap & Scaling Plan 🚀🏆

Tujuan dokumen ini adalah merangkum dan melacak rencana strategis pengembangan NomadHub dari fase MVP stabil saat ini menuju aplikasi SaaS kelas komersial elit dengan sentuhan desain kelas dunia.

---

## 🎨 FASE 1: ELITE UI/UX & VISUAL REDESIGN (Current Priority)
Fokus utama saat ini adalah mempercantik visual, memperbaiki pengalaman pengguna (UX), dan menyusun panduan seni (Art Direction) yang premium sebelum menyentuh logika bisnis lebih lanjut.

### 💡 Rencana Peningkatan Desain:
1.  **Pengumpulan Referensi (Moodboarding)**:
    *   Mencari inspirasi layout SaaS modern berbasis mobile (seperti Bento Grid, Uber Eats UX, atau Stripe Dashboard).
    *   Menentukan skema tipografi (misal: Inter, Outfit, atau Satoshi) dan palet warna gelap/terang yang sangat kontras & harmonis.
2.  **Desain Ulang Komponen Utama**:
    *   *Landing Page*: Membuat transisi hero section lebih dinamis.
    *   *Storefront Vendor*: Membuat daftar menu terlihat lebih "lezat" dengan layout grid bento modern, kartu mengambang, dan detail modal.
    *   *Dashboard Vendor*: Merapikan penataan kartu statistik agar lebih intuitif diakses lewat HP satu tangan.
3.  **Implementasi Animasi Mikro**:
    *   Menggunakan pustaka animasi ringan (seperti Framer Motion) untuk transisi kartu, *hover effect*, dan interaksi antar elemen agar UI terasa "hidup".

---

## 🏢 FASE 2: MULTI-TENANT SAAS ENGINE (Scaling Boss)
Mengubah pondasi database tunggal menjadi sistem multi-akun skala besar yang siap dijual ke publik.

### 🛠️ Rencana Teknis Arsitektur:
1.  **Relasi Vendor-User di Supabase**:
    *   Memetakan kolom `owner_id` di tabel `vendors` ke ID pengguna asli di tabel otentikasi Supabase (`auth.users.id`).
2.  **Dynamic Registration Flow**:
    *   Membangun halaman *Onboarding* khusus. Ketika user baru mendaftar akun, sistem secara otomatis memaksa pembuatan toko baru (menentukan nama toko, deskripsi, dan meng-generate `slug` otomatis).
3.  **Keamanan Data Terisolasi (RLS Hardening)**:
    *   Memastikan pemilik Toko A sama sekali tidak bisa melihat, mengedit, atau menghapus data pesanan milik Toko B di database Postgres.

---

## 🌐 FASE 3: COMMERCIAL CUSTOM DOMAIN & PROXY (Elite Status)
Mematangkan fitur Bunglon (White-Label) agar berfungsi nyata di internet menggunakan domain kustom milik klien.

### 🛰️ Rencana Pemasangan Cloud:
1.  **Konfigurasi Cloud Domains**:
    *   Menghubungkan domain kustom (misal: `*.nomadhub.my.id`) ke layanan Google Cloud Run Load Balancer / Mapping.
2.  **Dokumentasi Manual Vendor**:
    *   Menyusun petunjuk sederhana bagi vendor yang ingin mengarahkan domain CNAME pribadi mereka ke DNS server NomadHub kita.

---

*Status: Menunggu referensi desain visual dari Anda untuk mulai mengeksekusi Fase 1.* 📐🎨✨
