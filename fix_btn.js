const fs = require('fs');

let content = fs.readFileSync('src/components/VendorDashboard.tsx', 'utf8');

const target = "                                                </button>\r\n\r\n                                            </div>";
const replacement = "                                                </button>\n                                                <button\n                                                    onClick={() => setIsQRModalOpen(true)}\n                                                    className=\"bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[9.5px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs\"\n                                                >\n                                                    <Printer className=\"w-3 h-3\" />\n                                                    Cetak QR Kedai\n                                                </button>\n                                            </div>";

content = content.replace(target, replacement);

const target2 = "                                                </button>\n\n                                            </div>";
content = content.replace(target2, replacement);

fs.writeFileSync('src/components/VendorDashboard.tsx', content, 'utf8');
