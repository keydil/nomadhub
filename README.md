# NomadHub 🍔🚀

**NomadHub** adalah platform SaaS B2B2C berbasis AI modern yang dirancang khusus untuk bisnis F&B bergerak (Mobile F&B) seperti *Food Trucks*, *Pop-up Stalls*, dan UMKM kuliner lainnya. Didesain dengan pendekatan *Mobile-First*, platform ini memberdayakan pemilik usaha untuk mengotomatisasi menu via AI, mengamankan sistem dengan otentikasi server, dan mengelola antrean pelanggan secara *real-time* dengan pengalaman pengguna yang sangat premium.

---

## ⚡ Elite Tech Stack

*   **Framework Utama**: [Next.js 16+](https://nextjs.org/) (App Router & Server Actions)
*   **Kecerdasan Buatan**: Google Generative AI SDK (**Gemini 2.5 Flash** - Vision & Text)
*   **Database & Backend**: [Supabase](https://supabase.com/) (Postgres, Real-time & Storage)
*   **Keamanan & Otentikasi**: Supabase SSR (Server-Side Cookie Based Auth)
*   **Bahasa**: TypeScript (Strict Type Safety)
*   **Styling & Animasi**: Tailwind CSS dengan konsep Glassmorphism, Canvas-Confetti & Shimmer Elements.
*   **Sistem Notifikasi**: [Sonner Toast](https://sonner.emilkowal.ski/) (Rich Interaction Notifications)
*   **Infrastruktur Server**: Google Cloud Run & Docker (Multi-stage Standalone Optimized)

---

## 🌟 Fitur-Fitur Premium & Arsitektur Inti

### 1. Multi-Tenant Root Routing & Custom Domain (`src/proxy.ts`)
*   **Clean URL Portofolio**: Menggunakan arsitektur Root Slug dinamis `/[vendorSlug]` (contoh: `nomadhub.app/mr-churraos`) alih-alih subfolder kaku.
*   **Intelligent Proxy**: Middleware cerdas yang otomatis mengekstrak identitas vendor dari domain masuk untuk mendukung pemetaan domain pribadi pelanggan (*Custom Domain* seperti `namatoko.my.id`).
*   **Strict Multi-Tenant Isolation**: Menjamin keamanan data antar penyewa, memisahkan secara ketat *Real-time Subscription*, keranjang belanja, hingga histori pemesanan.

### 2. Enterprise Auth & Secured Workspaces
*   **Elite Auth Flow**: Desain halaman `/login` dan `/signup` bergaya premium dengan dukungan multi-login (Google OAuth & Email/Password).
*   **Dynamic Onboarding**: Alur pendaftaran vendor (Progressive Disclosure) otomatis di halaman `/onboarding` untuk mengonfigurasi *Store Name*, *Description*, dan *Slug* URL.
*   **Supabase SSR Middleware**: Memproteksi seluruh akses ke `/dashboard` secara *Server-Side*. Akses data terikat erat dengan identitas pengguna (`owner_id`), bukan URL statis.

### 3. AI Magic Menu & Marketing Assistant (Gemini 2.5 Flash)
*   **Vision AI 2.5 Analysis**: Mengidentifikasi jenis masakan secara otomatis dari foto yang diunggah, menghasilkan nama serta rekomendasi harga secara akurat.
*   **✨ Magic Polish Prompting**: Mesin copywriting pintar yang mengolah nama masakan menjadi deskripsi pemasaran yang menggugah selera lengkap dengan *hashtags* spesifik.

### 4. Smart Real-Time Customer Queue & Playful UI
*   **Live Interaction**: Sinkronisasi *real-time* 2 arah antara layar pembeli dan dasbor penjual menggunakan *Supabase Realtime Channels*.
*   **Playful Animation Zone**: Desain premium pelacakan pesanan (Orders Tab) dengan *Giant Progress Orb*, animasi kurir motor meluncur (*Delivery*), dan tas belanja memantul (*Pickup*).
*   **Multi-Sensory Feedback**: Saat pesanan matang/selesai, HP pelanggan bergetar (`Vibrate API`), membunyikan bel notifikasi, dan memicu hujan konfeti ganda. Dasbor penjual juga membunyikan "Ding!" saat ada pesanan masuk.

### 5. Enterprise Payment & Order Management
*   **Interactive QRIS Flow**: Simulasi pembayaran *cashless* interaktif dengan *timer* *countdown* dan integrasi status `Paid/Pending` langsung ke Supabase.
*   **Opsi Fleksibel**: Mendukung metode pembayaran Tunai (*Cash*) dan Transfer Manual, lengkap dengan metode pengambilan pesanan (*Pickup* di konter atau *Delivery* ke meja/alamat).
*   **Table Tracking**: Sistem pelacakan meja pelanggan yang terintegrasi langsung ke dalam struk dan keranjang pemesanan.

### 6. Progressive Cart System & Storefront
*   **Smart Cart Enforcement**: Mencegah pemesanan silang antar vendor dengan aturan *Single-Vendor Cart*.
*   **Promo Engine**: Dukungan injeksi kode voucher/diskon (contoh: *Gratis Ongkir*, *Diskon Spesial*).
*   **Ultra-Smooth Shimmer Layout**: Peralihan halaman tanpa *blank-screen* menggunakan kerangka pemuatan (Skeleton UX) bawaan Next.js.

### 7. Cloud Media Vault & Vendor Utilities
*   **Print-Ready QR Posters**: Generator otomatis poster QR Code toko (*high-res*) yang langsung bisa diunduh atau dicetak oleh vendor.
*   **Binary Secure Upload**: Mengirimkan file langsung ke Bucket Supabase menggunakan penamaan terproteksi UUID kelas militer (`crypto.randomUUID()`).

---

## 🛠️ Menjalankan Aplikasi Lokal

### Prasyarat
*   Node.js v20 ke atas
*   Akun Supabase (Database, Auth Email Enabled, dan Storage Bucket `menu-images` publik)
*   Google Gemini API Key

### 1. Konfigurasi Lingkungan
Buat file `.env.local` di root direktori dan isi variabel berikut:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Instalasi & Eksekusi
```bash
# Install dependensi
npm install

# Jalankan mode pengembangan
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🚢 Panduan Produksi (Google Cloud Run)

### Membangun Image Secara Lokal
```bash
docker build -t nomadhub .
```

### Perintah Deploy Cepat (Via Google Cloud SDK)
Pastikan Anda sudah masuk ke gcloud CLI dan jalankan:
```bash
gcloud run deploy nomadhub \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=isi_disini,NEXT_PUBLIC_SUPABASE_URL=isi_disini,NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_disini"
```

---

*NomadHub - Built with perfection for the future of mobile culinary systems.* 🍔🔥🏆
