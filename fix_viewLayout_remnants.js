const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className=\{viewLayout === 'responsive' \? '([^']+)' : ''\}/g, 'className="$1"');
content = content.replace(/className=\{viewLayout === 'responsive' \? '([^']+)' : '([^']+)'\}/g, 'className="$1"');

// Wait, the one on line 416: viewLayout === 'phone'
// It looks like it was something else, let's just replace viewLayout === 'phone' with false
content = content.replace(/viewLayout === 'phone'/g, 'false');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed remnants!');
