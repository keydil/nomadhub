'use client';

import { useState, useEffect } from 'react';

export interface PolishedData {
  description: string;
  hashtags: string[];
}

export function useMagicPolish(signatureDish: { title: string; description: string }) {
  const [data, setData] = useState<PolishedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!signatureDish.title) return;

    const cacheKey = `polish_${signatureDish.title.replace(/\s+/g, '_').toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    const polishHero = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/magic-polish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: signatureDish.title })
        });
        const resultData = await res.json();
        if (resultData.result) {
          setData(resultData.result);
          localStorage.setItem(cacheKey, JSON.stringify(resultData.result));
        }
      } catch (err) {
        console.error('Failed to polish hero:', err);
      } finally {
        setIsLoading(false);
      }
    };

    polishHero();
  }, [signatureDish.title]);

  return { data, isLoading };
}
