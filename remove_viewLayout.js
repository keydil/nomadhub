const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace standard template literals with viewLayout
// e.g. ${viewLayout === 'responsive' ? 'pb-24' : 'pb-28'}
content = content.replace(/\$\{viewLayout === 'responsive' \? '([^']+)' : '([^']+)'\}/g, '$1');

// e.g. ${viewLayout === 'responsive' ? 'md:bg-transparent' : ''}
content = content.replace(/\$\{viewLayout === 'responsive' \? '([^']+)' : ''\}/g, '$1');

// e.g. ${viewLayout === 'phone' ? '...' : '...'}
content = content.replace(/\$\{viewLayout === 'phone' \? '([^']+)' : '([^']+)'\}/g, '$2');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned up viewLayout usages!');
