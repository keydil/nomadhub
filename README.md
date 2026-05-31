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

### 2. White-Label Smart SEO Metadata (Bunglon Mode 🦎)
*   **Deteksi Domain Adaptif**: Sistem secara dinamis mendeteksi rute akses.
*   **Total Penyamaran**: Jika diakses via domain premium pelanggan, identitas "NomadHub" otomatis disembunyikan 100% dari mesin pencari Google dan pratinjau media sosial, diganti dengan merek asli vendor demi profesionalitas tingkat tinggi.

### 3. Enterprise Auth & Secured Workspaces (Multi-Tenant Engine)
*   **Elite Auth Flow**: Desain halaman `/login` dan `/signup` bergaya premium dengan dukungan multi-login (Google OAuth & Email/Password).
*   **Dynamic Onboarding**: Alur pendaftaran vendor otomatis yang terintegrasi di halaman `/onboarding` untuk mengonfigurasi *Store Name*, *Description*, dan *Slug* URL.
*   **Supabase SSR Middleware**: Seluruh akses ke `/dashboard` dan `/onboarding` diproteksi secara ketat menggunakan *Server-side Middleware*. Pengguna yang belum *login* dialihkan ke `/login`, sedangkan pengguna terautentikasi yang belum memiliki toko dialihkan ke alur pendaftaran.
*   **Tenant Isolation**: Akses data (*menu*, *queue*, *store status*) terikat erat dengan identitas pengguna (`owner_id`), bukan URL statis, menjamin isolasi data antar penyewa (*tenant*).

### 4. AI Magic Menu & Marketing Assistant (Gemini 2.5 Flash)
*   **Vision AI 2.5 Analysis**: Mengidentifikasi jenis masakan secara otomatis dari foto makanan yang diunggah, menghasilkan nama serta rekomendasi harga secara akurat.
*   **✨ Magic Polish Prompting**: Mesin copywriting pintar yang mengolah nama masakan menjadi deskripsi pemasaran yang menggugah selera lengkap dengan *hashtags* spesifik.
*   **Respon Terkendali**: Menggunakan setelan paksa `responseMimeType: "application/json"` untuk memastikan struktur keluaran AI 100% stabil anti-eror.

### 5. Cloud Media Vault (Supabase Storage & RLS)
*   **Binary Secure Upload**: Mengirimkan file dari server component langsung ke Bucket Supabase menggunakan penamaan terproteksi UUID kelas militer (`crypto.randomUUID()`).
*   **Tangguh & Terpantau**: Audit logs penuh di terminal server jika terjadi kendala RLS maupun jaringan.

### 6. Smart Real-Time Customer Queue & Playful UI
*   **Live Interaction**: Menghubungkan layar pembeli dan dasbor penjual secara interaktif.
*   **Playful Animation**: Menyajikan desain premium untuk pelacakan pesanan (Orders Tab) dengan animasi "LiveQueueTracker" (Roda dinamis, Kurir motor meluncur untuk *Delivery*, dan animasi memantul untuk *Pickup*).
*   **Multi-Sensory Feedback**: Saat pesanan selesai, HP pelanggan otomatis bergetar (`Vibrate API`), membunyikan bel notifikasi, dan memunculkan hujan konfeti ganda!

### 7. Ultra-Smooth Shimmer Layout & Vendor Isolation
*   Peralihan halaman tanpa *blank-screen* menggunakan kerangka pemuatan dinamis (Skeleton UI) bawaan Next.js `loading.tsx` untuk transisi data yang selembut sutra.
*   **Strict Multi-Tenant Isolation**: Menjamin keamanan data antar penyewa, memisahkan secara ketat *Real-time Subscription*, keranjang belanja, hingga status pembayaran (mendukung alur QRIS interaktif).

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
