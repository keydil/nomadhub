Lanjut ke Fase 2: Discovery Map. Tapi ada 2 bug di Fase 1 yang harus 
difix dulu sebelum mulai.

---

## HOTFIX Fase 1 (kerjakan ini dulu)

### Fix 1 — Status dot selalu merah di EcosystemDrawer
Di `EcosystemDrawer.tsx`, kondisi status pakai `vendor.status === 'open'`
tapi kolom itu tidak ada di database. Yang benar:

Cari baris ini:
  vendor.status === 'open'

Ganti SEMUA kemunculannya dengan:
  !vendor.is_manually_closed

### Fix 2 — Pastikan koordinat ikut di-fetch
Buka `src/app/actions.ts`, cari fungsi `fetchAllActiveVendors()`.
Pastikan SELECT-nya sudah include `latitude` dan `longitude`.
Kalau belum ada, tambahkan.

---

## FASE 2 — Discovery Map di Landing Page

### Konteks
- Drawer (EcosystemDrawer) sudah jalan dari Fase 1
- Vendor aktif: kopi-miskin & mr-churraos (koordinat placeholder: -6.9175, 107.6191)
- Gunakan Leaflet.js + OpenStreetMap (GRATIS, bukan Google Maps)

---

### LANGKAH 1 — Install dependency

```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

---

### LANGKAH 2 — Buat komponen peta

Buat file baru: `src/components/landing/EcosystemMap.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import type { VendorForMap } from '@/types/vendor'; // sesuaikan dengan type yang ada

interface EcosystemMapProps {
  vendors: {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    is_manually_closed: boolean;
    logo_url: string | null;
  }[];
}

export function EcosystemMap({ vendors }: EcosystemMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Lazy import Leaflet (client-only)
    import('leaflet').then((L) => {
      // Fix icon default Leaflet yang rusak di Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-6.9175, 107.6191], // Default: Bandung
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Plot hanya vendor dengan koordinat valid
      vendors
        .filter((v) => v.latitude !== null && v.longitude !== null)
        .forEach((vendor) => {
          const marker = L.marker([vendor.latitude!, vendor.longitude!]).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; min-width: 140px;">
              <strong style="font-size: 14px;">${vendor.name}</strong><br/>
              <span style="font-size: 12px; color: ${vendor.is_manually_closed ? '#ef4444' : '#22c55e'}">
                ${vendor.is_manually_closed ? '🔴 Tutup' : '🟢 Buka'}
              </span><br/>
              <a href="/${vendor.id}" style="font-size: 12px; color: #0ea5e9; margin-top: 4px; display: inline-block;">
                Kunjungi Toko →
              </a>
            </div>
          `);
        });

      mapInstanceRef.current = map;
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [vendors]);

  return (
    <div
      ref={mapRef}
      style={{ height: '420px', width: '100%', borderRadius: '16px', zIndex: 0 }}
    />
  );
}
```

**PENTING:** Tambahkan CSS Leaflet di `src/app/layout.tsx` atau `globals.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

---

### LANGKAH 3 — Tambah section peta di Landing Page

Di `src/app/page.tsx` (landing page utama):

1. Import komponen dan fetch data:
```typescript
import { fetchAllActiveVendors } from '@/app/actions';
import dynamic from 'next/dynamic';

// Dynamic import wajib karena Leaflet butuh browser (no SSR)
const EcosystemMap = dynamic(
  () => import('@/components/landing/EcosystemMap').then(m => m.EcosystemMap),
  { ssr: false, loading: () => <div style={{height: '420px', background: '#f1f5f9', borderRadius: '16px'}} /> }
);
```

2. Fetch vendors di server component:
```typescript
const vendors = await fetchAllActiveVendors();
```

3. Tambahkan section peta di bawah hero section yang sudah ada:
```tsx
<section style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
    Temukan Toko di Sekitarmu
  </h2>
  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
    Semua toko yang terdaftar di NomadHub, real-time.
  </p>
  <EcosystemMap vendors={vendors} />
</section>
```

---

## Verifikasi Manual Setelah Selesai:

1. Buka `localhost:3000`
2. Scroll ke bawah → harus ada peta interaktif
3. Ada 2 pin di Bandung (koordinat sama karena masih placeholder)
4. Klik pin → popup muncul dengan nama toko, status, dan link "Kunjungi Toko"
5. Klik link di popup → masuk ke halaman toko
6. Buka `localhost:3000/mr-churraos` → hamburger menu → dot kopi-miskin harus HIJAU (bukan merah lagi)

## Yang TIDAK perlu dikerjakan di task ini:
- Form self-service koordinat vendor (Fase 3)
- Halaman statis per kota untuk SEO (Fase 3)
- Perubahan dashboard vendor
- Perubahan sistem auth