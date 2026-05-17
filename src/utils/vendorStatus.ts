/**
 * Utility untuk mengecek status operasional Vendor berdasarkan
 * kombinasi jam operasional dan manual override.
 */

export interface VendorStatusInfo {
  is_manually_closed: boolean;
  opening_time: string; // Format 'HH:mm'
  closing_time: string; // Format 'HH:mm'
}

export function checkVendorStatus(vendor: VendorStatusInfo): boolean {
  // 1. Cek Manual Kill-Switch
  if (vendor.is_manually_closed) {
    return false;
  }

  // 2. Cek Jam Operasional
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Konversi current time ke total menit untuk perbandingan mudah
  const currentTotalMinutes = (currentHour * 60) + currentMinute;

  // Helper untuk konversi 'HH:mm' ke total menit
  const parseTimeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
  };

  try {
    const openingMinutes = parseTimeToMinutes(vendor.opening_time || '09:00');
    const closingMinutes = parseTimeToMinutes(vendor.closing_time || '22:00');

    // Logika jika jam tutup melewati tengah malam (misal 17:00 - 02:00)
    if (closingMinutes < openingMinutes) {
      return currentTotalMinutes >= openingMinutes || currentTotalMinutes < closingMinutes;
    }

    // Logika standar (misal 09:00 - 21:00)
    return currentTotalMinutes >= openingMinutes && currentTotalMinutes < closingMinutes;
  } catch (error) {
    console.error('Error parsing vendor operational hours:', error);
    return true; // Fallback ke open jika format waktu salah
  }
}
