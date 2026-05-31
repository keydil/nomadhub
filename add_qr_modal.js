const fs = require('fs');

let content = fs.readFileSync('src/components/VendorDashboard.tsx', 'utf8');

// Add import
if (!content.includes('import QRGeneratorModal')) {
    content = content.replace(
        "import { motion, AnimatePresence } from 'framer-motion';",
        "import { motion, AnimatePresence } from 'framer-motion';\nimport { Printer } from 'lucide-react';\nimport QRGeneratorModal from './vendor/QRGeneratorModal';"
    );
}

// Add state
if (!content.includes('const [isQRModalOpen, setIsQRModalOpen]')) {
    content = content.replace(
        "const [logoImage, setLogoImage] = useState((props as any).logoImage);",
        "const [logoImage, setLogoImage] = useState((props as any).logoImage);\n    const [isQRModalOpen, setIsQRModalOpen] = useState(false);"
    );
}

// Add button
if (!content.includes('Cetak QR Kedai')) {
    content = content.replace(
        "{isUploadingLogo ? 'Mengunggah...' : 'Ganti Gambar Avatar'}\n                                                </button>\n\n                                            </div>",
        "{isUploadingLogo ? 'Mengunggah...' : 'Ganti Gambar Avatar'}\n                                                </button>\n                                                <button\n                                                    onClick={() => setIsQRModalOpen(true)}\n                                                    className=\"bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[9.5px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs\"\n                                                >\n                                                    <Printer className=\"w-3 h-3\" />\n                                                    Cetak QR Kedai\n                                                </button>\n                                            </div>"
    );
}

// Add modal
if (!content.includes('<QRGeneratorModal')) {
    content = content.replace(
        "        </div>\n    );\n}",
        "            {isQRModalOpen && (\n                <QRGeneratorModal \n                    storeName={storeName}\n                    logoImage={logoImage}\n                    storeUrl={`https://nomadhub.biz.id/${storeName.replace(/\\s+/g, '-').toLowerCase()}`}\n                    onClose={() => setIsQRModalOpen(false)}\n                />\n            )}\n        </div>\n    );\n}"
    );
}

fs.writeFileSync('src/components/VendorDashboard.tsx', content, 'utf8');
console.log('Modifications applied!');
