'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AIMenuManager() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleImageSelected = (file: File) => {
    setImageFile(file);
    setIsProcessing(true);
    setProgress(0);
    setIsComplete(false);
    setTitle('');
    setDescription('');
    setPrice('');
  };

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setIsComplete(true);
            
            // Mock AI results
            setTitle('Artisan Smashed Burger');
            setDescription('Double smashed beef patties with caramelized onions, melted cheddar, and our signature house sauce on a toasted brioche bun.');
            setPrice('12.50');
            
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/vendor" className="text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Menu Manager</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-1 rounded-3xl shadow-sm border border-slate-200">
            <div className="relative rounded-2xl overflow-hidden">
              <ImageUploader onImageSelected={handleImageSelected} />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-sky-900/20 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-sky-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#38bdf8]"></div>
                  
                  <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Analyzing Photo...</p>
                    <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 transition-all duration-150 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-sky-800">
              Upload a clear photo of your dish. Our AI will analyze the ingredients, portion size, and presentation to generate an appealing description and suggested market price.
            </p>
          </div>
        </div>

        <div>
          <Card className={`transition-all duration-500 ${isComplete ? 'border-sky-300 shadow-md shadow-sky-100' : 'border-slate-200'}`}>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-slate-800">Item Details</h3>
                {isComplete && (
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI Generated
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Menu Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classic Cheeseburger"
                  disabled={isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${isComplete ? 'bg-sky-50/50 border-sky-200' : 'bg-white border-slate-200'}`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dish..."
                  rows={4}
                  disabled={isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none ${isComplete ? 'bg-sky-50/50 border-sky-200' : 'bg-white border-slate-200'}`}
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Suggested Price ($)</label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${isComplete ? 'bg-sky-50/50 border-sky-200' : 'bg-white border-slate-200'}`}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button 
                  fullWidth 
                  disabled={!title || isProcessing}
                  className={isComplete ? 'animate-[pulse_2s_ease-in-out]' : ''}
                >
                  Save to Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
