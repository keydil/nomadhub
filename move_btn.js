const fs = require('fs');

let content = fs.readFileSync('src/components/VendorDashboard.tsx', 'utf8');

// 1. Remove old button from the avatar section
const targetToRemove = `                                                <button
                                                    onClick={() => setIsQRModalOpen(true)}
                                                    className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[9.5px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                                                >
                                                    <Printer className="w-3 h-3" />
                                                    Cetak QR Kedai
                                                </button>`;
content = content.replace(targetToRemove, '');

// 2. Add the new button under the Lihat Kedai Publik
const findString = `                                                <span>Lihat Kedai Publik (Pembeli)</span>\n                                                <ExternalLink className="w-3 h-3 text-stone-400" />\n                                            </button>`;
const replaceString = `                                                <span>Lihat Kedai Publik (Pembeli)</span>\n                                                <ExternalLink className="w-3 h-3 text-stone-400" />\n                                            </button>\n\n                                            <button\n                                                type="button"\n                                                onClick={() => setIsQRModalOpen(true)}\n                                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10.5px] font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"\n                                            >\n                                                <QrCode className="w-4 h-4" />\n                                                <span>Cetak QR Poster Kedai</span>\n                                            </button>`;

if (content.includes('Lihat Kedai Publik (Pembeli)')) {
    const lines = content.split('\n');
    const newLines = [];
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (lines[i].includes('<span>Lihat Kedai Publik (Pembeli)</span>')) {
            // we skip 2 lines and insert
            newLines.push(lines[i+1]);
            newLines.push(lines[i+2]);
            newLines.push('');
            newLines.push(`                                            <button`);
            newLines.push(`                                                type="button"`);
            newLines.push(`                                                onClick={() => setIsQRModalOpen(true)}`);
            newLines.push(`                                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10.5px] font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"`);
            newLines.push(`                                            >`);
            newLines.push(`                                                <QrCode className="w-4 h-4" />`);
            newLines.push(`                                                <span>Cetak QR Poster Kedai</span>`);
            newLines.push(`                                            </button>`);
            i += 2; // skip the lines we manually pushed
        }
    }
    content = newLines.join('\n');
}

// 3. Import QrCode
if (!content.includes('QrCode,')) {
    content = content.replace('Coffee,', 'Coffee,\n    QrCode,');
}

fs.writeFileSync('src/components/VendorDashboard.tsx', content, 'utf8');
