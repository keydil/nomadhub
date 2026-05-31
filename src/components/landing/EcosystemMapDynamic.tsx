'use client';

import dynamic from 'next/dynamic';

export const EcosystemMapDynamic = dynamic(
  () => import('./EcosystemMap').then(m => m.EcosystemMap),
  { 
    ssr: false, 
    loading: () => <div style={{height: '420px', background: '#f1f5f9', borderRadius: '16px'}} /> 
  }
);
