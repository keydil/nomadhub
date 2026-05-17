'use client';

import React, { useState } from 'react';
import { setupStore } from '@/app/auth-actions';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState('');

  // Auto-generate slug from store name
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Ensure slug is sent
    formData.set('slug', slug);
    
    const result = await setupStore(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      toast.error('Store setup failed', { description: result.error });
    } else {
      toast.success('Store created successfully! 🎉');
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100">
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Setup Your Store</h1>
        <p className="text-slate-500 font-medium">Let's get your business online in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">
            Store Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            onChange={handleNameChange}
            placeholder="e.g. Mr. Churraos"
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-bold text-slate-700 ml-1">
            Store URL (Slug)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-5 text-slate-400 font-bold select-none">
              nomadhub.app/
            </span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="mr-churraos"
              className="w-full pl-[135px] pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium focus:border-sky-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <p className="text-xs text-slate-400 ml-1 mt-1 font-medium">This will be your unique public link.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold text-slate-700 ml-1">
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="e.g. The best churros in town! Catch our food truck."
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition-all resize-none"
          ></textarea>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !slug}
          size="lg"
          fullWidth
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 mt-6 rounded-2xl h-14 font-black transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Store...
            </span>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </form>
    </div>
  );
}
