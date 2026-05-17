'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import { fetchMenu, saveMenuItem, uploadMenuImage } from '@/app/actions';

interface MenuItem {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
}

export default function AIMenuManager() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  
  // State for actions
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  
  // Menu list
  const [savedItems, setSavedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setIsLoadingMenu(true);
    try {
      const items = await fetchMenu();
      setSavedItems(items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 800;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob failed'));
            },
            'image/jpeg',
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelected = async (file: File) => {
    setImageFile(file);
    setIsProcessing(true);
    setProgress(0);
    setIsComplete(false);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 300);

    try {
      // Step 1: Compress image before sending
      const compressedBlob = await compressImage(file);
      
      const formData = new FormData();
      // Use compressed blob instead of raw file
      formData.append('image', compressedBlob, 'compressed_food.jpg');

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice(data.suggestedPrice || '');
      
    } catch (error) {
      console.error(error);
      toast.error('Analisis visual AI sedang sibuk.', { description: 'Ukuran gambar sudah dioptimasi, namun server mungkin sedang penuh.' });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 500);
    }
  };

  const handleMagicPolish = async () => {
    if (!title.trim()) {
      toast.error('Tulis Judul Menu dulu untuk pakai Magic Polish ✨');
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch('/api/magic-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error('Polish failed');

      const data = await res.json();
      
      // Separate description and hashtags for editing
      if (data.result) {
        setDescription(data.result.description);
        setHashtags(data.result.hashtags || []);
      }
      
      toast.success('Teks berhasil disulap! 🔮');
    } catch (error) {
      console.error(error);
      toast.error('Gagal merapikan teks.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSaveMenu = async () => {
    if (!title || !price) {
      toast.error('Judul dan Harga wajib diisi.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let uploadedUrl = undefined;

      // First step: Upload file to actual Supabase bucket if it exists
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        
        try {
          uploadedUrl = await uploadMenuImage(uploadFormData);
        } catch (e: any) {
          console.warn('Image upload error:', e);
          toast.warning('Data teks tersimpan, tapi gagal upload foto. Pastikan bucket "menu-images" ada.', { duration: 5000 });
        }
      }

      // Second step: Save final row to database (Wrap as JSON)
      const structuredDescription = JSON.stringify({
        description: description,
        hashtags: hashtags
      });

      await saveMenuItem(title, structuredDescription, price, uploadedUrl);
      
      await loadMenu();
      
      // Reset UI state completely
      setTitle('');
      setDescription('');
      setHashtags([]);
      setPrice('');
      setIsComplete(false);
      setImageFile(null);
      toast.success('Item berhasil diterbitkan ke menu publik! 🚀');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan menu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/vendor" className="text-slate-500 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Menu Manager Pro</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Col 1: Uploader Visual */}
        <div className="space-y-6">
          <div className="bg-white p-1 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden min-h-[240px] bg-slate-50 flex items-center justify-center">
              <ImageUploader onImageSelected={handleImageSelected} />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-sky-900/40 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-sky-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#38bdf8]"></div>
                  <div className="bg-white/95 px-6 py-5 rounded-2xl shadow-2xl flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">Vision AI Analyzing</p>
                      <p className="text-xs text-slate-500">Decoding flavors...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-start gap-3 text-sm text-slate-600">
            <div className="bg-sky-100 text-sky-600 p-1.5 rounded-lg">💡</div>
            <p>
              Unggah foto masakanmu untuk analisis visual AI, atau isi form di samping lalu gunakan <strong>Magic Polish</strong> untuk menyulap deskripsinya dalam sekejap!
            </p>
          </div>
        </div>

        {/* Col 2: Detail Form */}
        <div>
          <Card className={`transition-all duration-500 border-2 ${isComplete || title ? 'border-sky-100 shadow-lg shadow-sky-50' : 'border-slate-100'}`}>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700">Nama Menu</label>
                  {isComplete && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded flex items-center gap-1 uppercase tracking-wider">
                      Detected
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Dimsum Mentai Mozarella"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700">Deskripsi Produk</label>
                  <button
                    type="button"
                    onClick={handleMagicPolish}
                    disabled={!title || isPolishing}
                    className="text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1"
                  >
                    {isPolishing ? 'Polishing...' : '✨ Magic Polish'}
                  </button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis detail produk atau klik Magic Polish..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all resize-none text-sm text-slate-700 leading-relaxed"
                ></textarea>

                {/* Hashtag Preview in Form */}
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hashtags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Harga Jual (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35.000"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all font-black text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  fullWidth 
                  onClick={handleSaveMenu}
                  disabled={!title || !price || isProcessing || isSaving}
                  size="lg"
                  className={`rounded-xl h-12 font-bold shadow-lg text-base tracking-wide transition-all active:scale-[0.98] ${title && price ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-200' : ''}`}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : '🚀 Terbitkan Menu'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Better Grid Layout for existing Menu Items with Image display */}
      <div className="border-t border-slate-100 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Aktif Menu
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">{savedItems.length}</span>
          </h2>
        </div>

        {isLoadingMenu ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : savedItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl opacity-50">🍽️</div>
            <p className="font-bold text-slate-800">Belum ada menu.</p>
            <p className="text-slate-500 text-sm mt-1">Mulai dengan mengunggah foto pertamamu di atas.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <Card key={item.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col h-full">
                <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Menu';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-100 to-slate-100 text-sky-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-sm font-black text-slate-900">
                    Rp {item.price}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-3 flex-1 whitespace-pre-wrap">
                    {(() => {
                      try {
                        const parsed = JSON.parse(item.description);
                        return parsed.description || item.description;
                      } catch {
                        return item.description;
                      }
                    })()}
                  </p>
                  
                  {/* Hashtag chips in manager list */}
                  {(() => {
                    try {
                      const parsed = JSON.parse(item.description);
                      if (parsed.hashtags) {
                        return (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {parsed.hashtags.map((tag: string, i: number) => (
                              <span key={i} className="text-[9px] text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        );
                      }
                    } catch { return null; }
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
