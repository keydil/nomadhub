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

### 3. Enterprise Auth & Secured Workspaces
*   **Supabase SSR Implementation**: Seluruh akses ke Dashboard `/vendor` diproteksi oleh Middleware Server-side yang ketat dengan sistem *cookie validation*.
*   **Logout Terproteksi**: Fitur keluar aman yang terintegrasi dengan sistem Sonner Toast Action.

### 4. AI Magic Menu & Marketing Assistant (Gemini 2.5 Flash)
*   **Vision AI 2.5 Analysis**: Mengidentifikasi jenis masakan secara otomatis dari foto makanan yang diunggah, menghasilkan nama serta rekomendasi harga secara akurat.
*   **✨ Magic Polish Prompting**: Mesin copywriting pintar yang mengolah nama masakan menjadi deskripsi pemasaran yang menggugah selera lengkap dengan *hashtags* spesifik.
*   **Respon Terkendali**: Menggunakan setelan paksa `responseMimeType: "application/json"` untuk memastikan struktur keluaran AI 100% stabil anti-eror.

### 5. Cloud Media Vault (Supabase Storage & RLS)
*   **Binary Secure Upload**: Mengirimkan file dari server component langsung ke Bucket Supabase menggunakan penamaan terproteksi UUID kelas militer (`crypto.randomUUID()`).
*   **Tangguh & Terpantau**: Audit logs penuh di terminal server jika terjadi kendala RLS maupun jaringan.

### 6. Smart Real-Time Customer Queue
*   **Live Interaction**: Menghubungkan layar pembeli dan dasbor penjual secara interaktif.
*   **Multi-Sensory Feedback**: Saat pesanan selesai, HP pelanggan otomatis bergetar (`Vibrate API`), membunyikan bel notifikasi, dan memunculkan hujan konfeti secara bersamaan!

### 7. Ultra-Smooth Shimmer Layout (Skeleton UX)
*   Peralihan halaman tanpa *blank-screen* menggunakan kerangka pemuatan dinamis (Skeleton UI) bawaan Next.js `loading.tsx` untuk transisi data yang selembut sutra.

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
