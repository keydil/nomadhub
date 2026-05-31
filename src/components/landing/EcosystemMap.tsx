'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

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
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || isInitializingRef.current || (mapRef.current as any)._leaflet_id) return;
    
    isInitializingRef.current = true;

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
        zoomControl: false, // Remove default zoom control to make it look cleaner
      });

      // Add a clean style map tileset (CartoDB Positron)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Plot hanya vendor dengan koordinat valid
      vendors
        .filter((v) => v.latitude !== null && v.longitude !== null)
        .forEach((vendor) => {
          const marker = L.marker([vendor.latitude!, vendor.longitude!]).addTo(map);
          marker.bindPopup(`
            <div style="font-family: inherit; min-width: 160px; padding: 4px;">
              <strong style="font-size: 16px; color: #0f172a; display: block; margin-bottom: 4px;">${vendor.name}</strong>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${vendor.is_manually_closed ? '#ef4444' : '#10b981'};"></span>
                <span style="font-size: 13px; font-weight: 600; color: ${vendor.is_manually_closed ? '#ef4444' : '#10b981'}">
                  ${vendor.is_manually_closed ? 'Currently Closed' : 'Open Now'}
                </span>
              </div>
              <a href="/${vendor.id}" style="display: block; width: 100%; text-align: center; padding: 8px 12px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 700;">
                Kunjungi Toko
              </a>
            </div>
          `, {
            closeButton: false,
            className: 'custom-leaflet-popup'
          });
        });

      mapInstanceRef.current = map;
      
      // Fix tile loading issues by invalidating size after render
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [vendors]);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden ring-1 ring-slate-900/5 shadow-inner z-0">
      <div ref={mapRef} className="absolute inset-0 z-0" />
      {/* Nice gradient overlay to make it blend with the page */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] z-10" />
    </div>
  );
}
