Kita implement Fase 1: Fondasi Ekosistem untuk NomadHub.

## Konteks Codebase
- Next.js + Supabase
- Server logic: `src/app/actions.ts`
- Tabel utama: `vendors`

## Kondisi database SAAT INI (real data, 5 vendor):
- huut-mania       → is_email_verified: false, location: null
- kopi-miskin      → is_email_verified: true,  location: ""
- mr-churraos      → is_email_verified: true,  location: "Rumah (Pre-Order) / CFD Bandung"
- sushi-mentai     → is_email_verified: false, location: null
- sushi-yareu      → is_email_verified: false, location: null

Kolom yang ADA: id, name, description, location (text), created_at,
is_manually_closed (bool), opening_time, closing_time, owner_id,
is_email_verified (bool), verification_token, verification_expires_at, logo_url

Kolom yang BELUM ADA dan harus ditambah: latitude, longitude, is_active

---

## Aturan bisnis yang harus diimplementasi:
- Vendor tampil di hamburger menu & ekosistem HANYA jika: is_active = true DAN is_email_verified = true
- Vendor yang belum verifikasi email = tidak tampil di ekosistem (tapi toko mereka tetap bisa diakses via direct URL)
- is_manually_closed = status buka/tutup hari ini (sudah ada, jangan diubah)
- is_active = apakah toko terdaftar aktif di ekosistem NomadHub (kolom baru)

---

## LANGKAH 1 — Migrasi Database (jalankan di Supabase SQL Editor)

```sql
-- Tambah kolom koordinat & status ekosistem
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS latitude FLOAT8;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS longitude FLOAT8;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set is_active berdasarkan kondisi existing
-- Yang sudah verified = aktif, yang belum = nonaktif dulu
UPDATE vendors SET is_active = true  WHERE is_email_verified = true;
UPDATE vendors SET is_active = false WHERE is_email_verified = false;

-- Koordinat placeholder untuk vendor yang sudah verified
-- (akan diupdate vendor sendiri lewat dashboard di Fase 2)
UPDATE vendors SET latitude = -6.9175, longitude = 107.6191
WHERE id IN ('kopi-miskin', 'mr-churraos');
```

---

## LANGKAH 2 — Update `src/app/actions.ts`

Tambahkan fungsi baru berikut (jangan hapus fungsi yang sudah ada):

```typescript
// Ambil semua vendor yang layak tampil di ekosistem
export async function fetchAllActiveVendors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      id, name, description, location,
      latitude, longitude,
      is_active, is_manually_closed,
      opening_time, closing_time,
      logo_url, is_email_verified
    `)
    .eq('is_active', true)
    .eq('is_email_verified', true)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
```

Juga update fungsi `fetchVendor` dan `updateVendorProfile` yang sudah ada:
- `fetchVendor`: tambahkan `latitude, longitude, is_active` ke SELECT
- `updateVendorProfile`: tambahkan handling untuk update `latitude`, `longitude`, `is_active` jika field tersebut dikirim

---

## LANGKAH 3 — Buat `src/components/storefront/EcosystemDrawer.tsx`

Komponen drawer/sidebar dengan spesifikasi:

**Trigger & animasi:**
- Tombol hamburger (icon ☰ atau gunakan Heroicons `Bars3Icon`) di pojok kiri atas header
- Drawer slide-in dari kiri, lebar 280px
- Overlay gelap (bg-black/40) di belakang, klik overlay = tutup drawer
- Animasi buka/tutup pakai Tailwind transition

**Isi drawer (dari atas ke bawah):**
1. Header drawer: logo/nama "NomadHub" + tombol close (×)
2. Tombol "← Beranda NomadHub" → navigasi ke `/`
3. Divider
4. Judul section "Toko Lainnya"
5. List vendor dari `fetchAllActiveVendors()`:
   - Tampilkan: logo (jika ada, fallback ke inisial nama), nama toko, badge status (🟢 Buka / 🔴 Tutup berdasarkan `is_manually_closed`)
   - Klik item → navigasi ke `/{vendor.id}`
   - **Vendor yang sedang dibuka (currentVendorId) jangan ditampilkan di list**
   - Jika list kosong setelah filter = tampilkan teks "Belum ada toko lain"

**Props komponen:**
```typescript
interface EcosystemDrawerProps {
  currentVendorId: string;
}
```

**Data fetching:**
- Fetch vendor list di server component parent, passing sebagai prop ke drawer
- Atau gunakan client-side fetch dengan useEffect jika lebih mudah diintegrasikan

---

## LANGKAH 4 — Integrasikan ke Header

Di `src/components/storefront/CompactHeaderVendor.tsx`:
- Import `EcosystemDrawer`
- Tambahkan `<EcosystemDrawer currentVendorId={vendor.id} />` di dalam komponen
- Tombol hamburger muncul di sisi kiri header, sebelum nama/logo toko

---

## Verifikasi Manual Setelah Selesai:

1. Buka `localhost:3000/mr-churraos`
2. Klik tombol hamburger kiri atas → drawer terbuka
3. List harus menampilkan "kopi miskin" (bukan mr-churraos sendiri)
4. huut-mania, sushi-mentai, sushi-yareu TIDAK boleh muncul (belum verified)
5. Klik "kopi miskin" → navigasi ke `localhost:3000/kopi-miskin`
6. Di kopi-miskin, hamburger → list harus tampilkan "Mr. Churraos"
7. Klik "← Beranda NomadHub" → navigasi ke `localhost:3000`

## Yang TIDAK perlu dikerjakan di task ini:
- Peta / Leaflet (itu Fase 2)
- Form input koordinat vendor (itu Fase 2)
- Perubahan pada halaman dashboard vendor
- Perubahan pada sistem autentikasi