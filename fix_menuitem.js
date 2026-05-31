const fs = require('fs');

let v = fs.readFileSync('src/components/VendorDashboard.tsx', 'utf8');
v = v.replace(/it\.menuItem\.name/g, 'it.title');
v = v.replace(/item\.menuItem\.name/g, 'item.title');
v = v.replace(/it\.menuItem\.price/g, 'it.price');
v = v.replace(/item\.menuItem\.price/g, 'item.price');
fs.writeFileSync('src/components/VendorDashboard.tsx', v);

let o = fs.readFileSync('src/components/storefront/OrdersTab.tsx', 'utf8');
o = o.replace(/it\.menuItem\.name/g, 'it.title');
fs.writeFileSync('src/components/storefront/OrdersTab.tsx', o);

console.log('Fixed menuItem!');
