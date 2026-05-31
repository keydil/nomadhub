const fs = require('fs');

// Restore CartTab.tsx
let cartTab = fs.readFileSync('src/components/storefront/CartTab.tsx', 'utf8');

cartTab = cartTab.replace(
  `const itemPrice = item.menuItem ? item.menuItem.price : 0;\n        return sum + (itemPrice + sizeSurcharge) * item.quantity;`,
  `return sum + ((parseInt(String(item.price).replace(/[^\d]/g, '')) || 0)) * item.quantity;`
);

cartTab = cartTab.replace(
  `const basePrice = item.menuItem ? item.menuItem.price : 0;\n                            const itemSizePrice = basePrice + (item.size === 'Large' ? 5000 : 0);`,
  `const itemSizePrice = (parseInt(String(item.price).replace(/[^\d]/g, '')) || 0) + (item.size === 'Large' ? 5000 : 0);`
);

cartTab = cartTab.replace(/src=\{item\.menuItem\?\.image\}/g, `src={item.imageUrl}`);
cartTab = cartTab.replace(/alt=\{item\.menuItem\?\.name \|\| 'Item'\}/g, `alt={item.title}`);
cartTab = cartTab.replace(/\{item\.menuItem\?\.name \|\| 'Item'\}/g, `{item.title}`);

fs.writeFileSync('src/components/storefront/CartTab.tsx', cartTab, 'utf8');

// Restore OrdersTab.tsx
let ordersTab = fs.readFileSync('src/components/storefront/OrdersTab.tsx', 'utf8');

ordersTab = ordersTab.replace(
  `const basePrice = item.menuItem ? item.menuItem.price : 0;\n                                                                const singlePrice = basePrice + (item.size === 'Large' ? 5000 : 0);`,
  `const singlePrice = (parseInt(String(item.price).replace(/[^\d]/g, '')) || 0) + (item.size === 'Large' ? 5000 : 0);`
);

ordersTab = ordersTab.replace(/<h5 className="font-bold text-stone-800">\{item\.menuItem\?\.name \|\| 'Item'\}<\/h5>/g, `<h5 className="font-bold text-stone-800">{item.title}</h5>`);

fs.writeFileSync('src/components/storefront/OrdersTab.tsx', ordersTab, 'utf8');

console.log('Restored tabs!');
