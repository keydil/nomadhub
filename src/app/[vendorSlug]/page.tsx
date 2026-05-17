import React from 'react';
export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getVendorBySlug, getMenuItemsByVendorId } from '@/app/actions';
import StorefrontClient from '@/components/storefront/StorefrontClient';

interface PageProps {
  params: Promise<{ vendorSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vendorSlug } = await params;
  const vendor = await getVendorBySlug(vendorSlug);
  
  if (!vendor) {
    return { title: 'Vendor Not Found' };
  }

  const headerList = await headers();
  const host = headerList.get('host') || '';
  const isCustomDomain = host.includes('.my.id') || 
    (!host.includes('nomadhub.app') && !host.includes('localhost:3000') && !host.includes('.run.app'));

  if (isCustomDomain) {
    return {
      title: `${vendor.name} - Official Online Menu`,
      description: `Experience the finest selection from ${vendor.name}. AI-powered menu and real-time ordering.`
    };
  }

  return {
    title: `${vendor.name} | NomadHub Elite`,
    description: `Order and discover delicious menu from ${vendor.name} via NomadHub.`
  };
}

export default async function VendorStorefront({ params }: PageProps) {
  const { vendorSlug } = await params;
  
  const vendor = await getVendorBySlug(vendorSlug);
  
  if (!vendor) {
    notFound();
  }

  const menuItems = await getMenuItemsByVendorId(vendor.id);

  return (
    <StorefrontClient 
      vendor={vendor} 
      menuItems={menuItems} 
    />
  );
}
