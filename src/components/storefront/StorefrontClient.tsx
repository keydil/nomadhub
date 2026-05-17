'use client';

import React, { useState, useEffect } from 'react';
import { StorefrontLayout } from './StorefrontLayout';
import { HeroProduct } from './HeroProduct';
import { AIRecommendation } from './AIRecommendation';
import { MenuCatalog } from './MenuCatalog';
import { CompactHeaderVendor } from './CompactHeaderVendor';
import { BottomNav } from './BottomNav';
import { CartDrawer } from './CartDrawer';
import { AnimatePresence, motion } from 'framer-motion';
import { useMagicPolish } from '@/hooks/useMagicPolish';

interface StorefrontClientProps {
  vendor: any;
  menuItems: any[];
}

export default function StorefrontClient({ vendor, menuItems }: StorefrontClientProps) {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'queue'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Pick the first item as the "Signature Dish" for the Hero
  const signatureDish = menuItems[0] || {
    title: 'Welcome to our Kitchen',
    description: 'Discover the best flavors in town.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000'
  };

  // Magic Polish Hook (AI Recommendation)
  const { data: polishedData, isLoading: isPolishing } = useMagicPolish(signatureDish);

  // Logic for AI recommendation (just pick the second item or signature for now)
  const recommendedItem = menuItems[1] || menuItems[0];

  // Lock scroll when Hero is active
  useEffect(() => {
    if (!showFullMenu) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, [showFullMenu]);

  const handleTabChange = (tab: 'home' | 'cart' | 'queue') => {
    if (tab === 'cart') {
      setIsCartOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <StorefrontLayout>
      <AnimatePresence mode="wait">
        {!showFullMenu ? (
          <HeroProduct 
            key="hero"
            name={signatureDish.title}
            description={isPolishing ? "Crafting a masterpiece..." : (polishedData?.description || signatureDish.description)}
            hashtags={polishedData?.hashtags}
            imageUrl={signatureDish.imageUrl}
            onExplore={() => setShowFullMenu(true)} 
          />
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-32"
          >
            <CompactHeaderVendor vendor={vendor} onClose={() => setShowFullMenu(false)} />
            
            <main className="space-y-12 py-8">
              {activeTab === 'home' && (
                <>
                  <div className="px-6">
                    <AIRecommendation 
                      recommendedItem={recommendedItem} 
                    />
                  </div>
                  <MenuCatalog items={menuItems.map(item => ({ ...item, vendorId: vendor.id }))} />
                </>
              )}
              
              {activeTab === 'queue' && (
                <div className="px-6 py-20 text-center text-slate-400">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">My Queue</h2>
                  <p>You have no active orders yet.</p>
                </div>
              )}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        vendorId={vendor.id}
        onSuccess={() => setActiveTab('queue')}
      />
    </StorefrontLayout>
  );
}
