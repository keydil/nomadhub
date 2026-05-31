# Implementasi Fitur: Dashboard Analytics & Order History (Kasir Pintar 💰)

Saat ini, pesanan yang sudah selesai (Completed) atau dibatalkan (Cancelled) langsung menghilang dari *Live Queue* dan penjual tidak punya rekap data untuk melihat seberapa banyak porsi yang terjual dan total uang yang masuk. 

Fitur ini akan menyulap NomadHub dari sekadar aplikasi "Antrean" menjadi aplikasi **Mesin Kasir Pintar (Point of Sale)** kelas atas.

## User Review Required

> [!IMPORTANT]
> **Keputusan Desain & Arsitektur**
> 1. Saya berencana membuat halaman baru khusus di `/dashboard/orders` agar halaman utama *Live Queue* tetap bersih dan fokus untuk operasional.
> 2. Di halaman `/dashboard/orders` ini kita akan menggunakan **Recharts** untuk menampilkan grafik omset per jam (jam sibuk) hari ini.
> 3. Kita juga akan menanamkan *Card* statistik di halaman utama (`/dashboard`) untuk menggantikan angka statis "86 Today's Served" menjadi data yang benar-benar diambil dari *Database*.
>
> **Apakah abang setuju dengan pendekatan halaman terpisah untuk rekap riwayat ini?**

## Proposed Changes

### 1. Backend / Data Fetching

#### [MODIFY] `src/app/actions.ts`
- Menambahkan fungsi `fetchTodayStats()`: Untuk menghitung Total Pendapatan (Rp) dan Total Pesanan Selesai hari ini.
- Menambahkan fungsi `fetchOrderHistory()`: Untuk mengambil semua pesanan berstatus `completed` atau `cancelled` dengan urutan terbaru di atas.

### 2. Modifikasi Dasbor Utama (Live Dashboard)

#### [MODIFY] `src/app/dashboard/page.tsx`
- Mengganti kotak statistik "Est. Wait Time" menjadi **"Today's Revenue (Omset Hari Ini)"** secara *real-time*.
- Mengganti angka "86" di "Today's Served" dengan angka asli hasil tarikan *database*.
- Menambahkan tombol/link "Lihat Riwayat Pesanan & Analitik" yang mengarah ke halaman baru.

### 3. Halaman Riwayat & Grafik Baru

#### [NEW] `src/app/dashboard/orders/page.tsx`
- Membuat antarmuka *Glassmorphism* khas NomadHub.
- Menampilkan grafik **Omset per Jam** menggunakan pustaka `recharts`.
- Menampilkan tabel / daftar *Order History* (Riwayat Pesanan) lengkap dengan nomor antrean, nama pelanggan, jam selesai, status (Selesai/Batal), dan rincian menu yang dibeli beserta harga.

## Verification Plan

### Manual Verification
1. Mengubah *hardcoded stat cards* di `/dashboard` menjadi *real data*.
2. Membuka halaman `/dashboard/orders`.
3. Memastikan semua pesanan percobaan (seperti pesanan abang barusan) terekam dengan sukses dan masuk hitungan Omset.
4. Mengecek grafik *Recharts* apakah mem-plot penjualan pada jam yang tepat.
