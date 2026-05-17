/**
 * Utility untuk mengecek status operasional Vendor secara real-time di sisi client.
 */

export interface VendorLogicInfo {
  is_manually_closed: boolean;
  opening_time: string; // Format 'HH:mm'
  closing_time: string; // Format 'HH:mm'
}

export function checkVendorStatus(vendor: VendorLogicInfo): 'OPEN' | 'CLOSED' {
  // 1. Prioritas Utama: Manual Kill-Switch
  if (vendor.is_manually_closed) {
    return 'CLOSED';
  }

  // 2. Cek Jam Operasional
  const now = new Date();
  const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();

  const parseToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
  };

  const openMin = parseToMinutes(vendor.opening_time);
  const closeMin = parseToMinutes(vendor.closing_time);

  // Penanganan jam operasional yang melewati tengah malam (misal 17:00 - 02:00)
  if (closeMin < openMin) {
    if (currentTotalMinutes >= openMin || currentTotalMinutes < closeMin) {
      return 'OPEN';
    }
  } else {
    // Jam operasional normal (misal 09:00 - 21:00)
    if (currentTotalMinutes >= openMin && currentTotalMinutes < closeMin) {
      return 'OPEN';
    }
  }

  return 'CLOSED';
}
