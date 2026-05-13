import React from 'react';
export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getVendorBySlug, getMenuItemsByVendorId } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JoinQueueCard } from '@/components/JoinQueueCard';

interface PageProps {
  params: Promise<{ vendorSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vendorSlug } = await params;
  const vendor = await getVendorBySlug(vendorSlug);
  
  if (!vendor) {
    return { title: 'Vendor Not Found' };
  }

  // BACA DOMAIN YANG SEDANG DIAKSES SAAT INI!
  const headerList = await headers();
  const host = headerList.get('host') || '';

  // Tentukan apakah dia sedang diakses lewat domain kustom (misal: .my.id atau selain domain utama kita)
  // Jika di local testing, localhost:3000 dianggap domain utama kita.
  const isCustomDomain = host.includes('.my.id') || 
    (!host.includes('nomadhub.app') && !host.includes('localhost:3000') && !host.includes('.run.app'));

  // KONDISI A: WHITE-LABEL (DOMIAN PREMIUM)
  if (isCustomDomain) {
    return {
      title: `${vendor.name} - Official Online Menu`,
      description: `Pesan antrean dan lihat daftar menu lezat terlengkap dari ${vendor.name} secara mudah dan cepat.`
    };
  }

  // KONDISI B: FREE-TIER (DOMAIN BAWAAN NOMADHUB)
  return {
    title: `${vendor.name} | NomadHub`,
    description: `Pesan antrean dan lihat menu lezat dari ${vendor.name} secara praktis melalui NomadHub.`
  };
}

export default async function VendorStorefront({ params }: PageProps) {
  const { vendorSlug } = await params;
  
  const vendor = await getVendorBySlug(vendorSlug);
  
  if (!vendor) {
    notFound();
  }

  const menuItems = await getMenuItemsByVendorId(vendor.id);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.location || '')}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Store Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl shadow-lg flex items-center justify-center text-white text-4xl font-bold mb-6">
            {vendor.name.charAt(0)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{vendor.name}</h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${vendor.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              <span className="flex items-center gap-2">
                <span className={`relative flex h-2 w-2`}>
                  {vendor.status === 'open' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${vendor.status === 'open' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                {vendor.status === 'open' ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full text-sm border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{vendor.location || 'Location not set'}</span>
            </div>
          </div>

          <div className="mt-8">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 rounded-full shadow-sm text-sky-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Open in Maps
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Join Queue CTA */}
        {vendor.status === 'open' && (
          <JoinQueueCard vendorId={vendor.id} activeQueueCount={vendor.activeQueueCount} />
        )}

        {/* Menu Catalog */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Our Menu
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{menuItems.length}</span>
          </h2>
          
          {menuItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-500">This vendor hasn&apos;t added any items to their menu yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group bg-white overflow-hidden">
                  <CardContent className="p-0 flex flex-col sm:flex-row gap-0">
                    {item.imageUrl && (
                      <div className="w-full sm:w-40 md:w-48 aspect-[4/3] sm:aspect-square shrink-0 overflow-hidden relative bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                        <span className="font-black text-sky-600 whitespace-nowrap ml-4 bg-sky-50 px-3 py-1 rounded-full text-sm">Rp {item.price}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-sm whitespace-pre-wrap line-clamp-3">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
