const fs = require('fs');

let content = fs.readFileSync('src/components/VendorDashboard.tsx', 'utf8');

content = content.replace("import QRGeneratorModal from './vendor/QRGeneratorModal';", "import { QrPosterModal } from './vendor/QrPosterModal';");

const replacementModal = `<QrPosterModal\n                    isOpen={isQRModalOpen}\n                    onClose={() => setIsQRModalOpen(false)}\n                    storeName={storeName}\n                    logoImage={logoImage}\n                    tempSlogan={tempSlogan}\n                    onNotification={triggerNotification}\n                />`;

// Just use regex to replace whatever is inside {isQRModalOpen && (...)}
content = content.replace(/<QRGeneratorModal[\s\S]*?\/>/g, replacementModal);

fs.writeFileSync('src/components/VendorDashboard.tsx', content, 'utf8');
