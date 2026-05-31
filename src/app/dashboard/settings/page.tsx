'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, Upload, Store, MapPin, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { fetchVendor, updateVendorProfile, uploadVendorLogo } from '@/app/actions';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [vendorSlug, setVendorSlug] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const v = await fetchVendor();
      if (v) {
        setVendorSlug(v.slug);
        setName(v.name || '');
        setDescription(v.description || '');
        setLocation(v.location || '');
        setLogoUrl(v.logo_url || '');
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = await updateVendorProfile(name, description, location, logoUrl);
    
    setIsSaving(false);
    if (res?.error) {
      toast.error('Gagal menyimpan profil', { description: res.error });
    } else {
      toast.success('Profil toko berhasil diperbarui! 🎉');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar', { description: 'Maksimal ukuran logo adalah 2MB.' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const publicUrl = await uploadVendorLogo(formData);
      setLogoUrl(publicUrl);
      toast.success('Logo berhasil diunggah!');
    } catch (err: any) {
      toast.error('Gagal mengunggah logo', { description: err.message });
    } finally {
      setIsUploading(false);
      // Reset input so they can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="w-10 h-10 p-0 rounded-full border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Toko</h1>
          <p className="text-slate-500 mt-1">Kelola identitas publik dan branding toko Anda.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <Card className="border-sky-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-sky-50/50 border-b border-sky-100/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Store className="h-5 w-5 text-sky-500" />
                Informasi Dasar
              </CardTitle>
              <CardDescription>Detail ini akan ditampilkan di halaman publik toko Anda.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Store URL (Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">URL Toko (Permanen)</label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20">
                    <span className="bg-slate-100 border-r border-slate-200 px-4 py-2.5 text-slate-500 text-sm flex items-center select-none">
                      nomadhub.biz.id/
                    </span>
                    <input 
                      type="text" 
                      value={vendorSlug} 
                      readOnly 
                      className="flex-1 bg-transparent px-4 py-2.5 text-slate-600 font-medium text-sm focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-400">URL toko tidak dapat diubah untuk mencegah kerusakan link yang sudah dibagikan.</p>
                </div>

                {/* Store Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nama Toko</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Store className="h-4 w-4" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Masukkan nama toko..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Lokasi Saat Ini</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. GBK Festival, Gate 3"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Deskripsi / Slogan</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-slate-400">
                      <AlignLeft className="h-4 w-4" />
                    </div>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ceritakan sedikit tentang keunikan toko Anda..."
                      rows={4}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-8 shadow-md shadow-sky-200"
                  >
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                    ) : 'Simpan Perubahan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Logo Upload */}
        <div>
          <Card className="border-slate-200 sticky top-8">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                <ImageIcon className="h-4 w-4 text-sky-500" />
                Logo Toko
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full border-4 border-sky-50 shadow-inner bg-white flex items-center justify-center overflow-hidden mb-6 relative group">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Store Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Store className="h-12 w-12 text-slate-300" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-slate-800 mb-1">Upload Logo Baru</h4>
                <p className="text-xs text-slate-500 mb-6 px-4">
                  Disarankan format persegi (1:1). Maksimal 2MB (JPG, PNG).
                </p>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  variant="outline"
                  className="w-full border-slate-200 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Pilih Foto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
