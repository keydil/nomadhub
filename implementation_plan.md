# NomadHub Product Roadmap & Scaling Plan 🚀🏆

Tujuan dokumen ini adalah merangkum dan melacak rencana strategis pengembangan NomadHub dari fase MVP stabil saat ini menuju aplikasi SaaS kelas komersial elit dengan sentuhan desain kelas dunia.

---

## 🎨 FASE 1: ELITE UI/UX & VISUAL REDESIGN (Current Priority)
Fokus utama saat ini adalah merombak Storefront Vendor menjadi pengalaman yang imersif, cerdas, dan premium menggunakan pendekatan *Progressive Disclosure* dan *Hyper-Personalized AI UI*.

### 🛠️ Technical Stack Tambahan:
*   **Animations**: `framer-motion` (untuk transisi selembut sutra).
*   **Icons**: `lucide-react` (ikon minimalis modern).
*   **Utility**: `clsx`, `tailwind-merge` (untuk manajemen class Tailwind yang rapi).

### 🏗️ Arsitektur Komponen Storefront (`src/components/storefront/`):
1.  **`StorefrontLayout`**: Wrapper utama dengan sistem *scroll-driven animations*.
2.  **`HeroProduct`**: Visual utama yang imersif (Progressive Disclosure).
3.  **`AIRecommendation`**: Section khusus rekomendasi cerdas berbasis konteks.
4.  **`MenuCatalog`**: Katalog menu modular dengan kategori.
5.  **`MenuItemCard`**: Kartu menu individual dengan detail yang bisa di-expand (Disclosure).
6.  **`FloatingCart`**: Keranjang melayang yang minimalis.

### 💡 Rencana Peningkatan Desain:
1.  **Immersive Reveal**: Saat halaman dimuat, tampilkan Hero Product secara penuh, lalu munculkan elemen lain saat user mulai scroll.
2.  **Context-Aware UI**: Menampilkan salam dan rekomendasi berbeda berdasarkan waktu (Pagi/Siang/Malam).
3.  **Micro-Interactions**: Efek *haptic-like* pada tombol dan kartu menu.

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

*Status: Memulai implementasi teknis komponen Storefront.* 📐🎨✨
