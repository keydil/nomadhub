const fs = require('fs');

// Fix CartTab.tsx
let cartTab = fs.readFileSync('src/components/storefront/CartTab.tsx', 'utf8');

cartTab = cartTab.replace(
  `return sum + ((parseInt(item.price.replace(/[^\\d]/g, '')) || 0)) * item.quantity;`,
  `const itemPrice = item.menuItem ? item.menuItem.price : 0;\n        return sum + (itemPrice + sizeSurcharge) * item.quantity;`
);

cartTab = cartTab.replace(
  `const itemSizePrice = (parseInt(item.price.replace(/[^\\d]/g, '')) || 0) + (false ? 5000 : 0);`,
  `const basePrice = item.menuItem ? item.menuItem.price : 0;\n                            const itemSizePrice = basePrice + (item.size === 'Large' ? 5000 : 0);`
);

cartTab = cartTab.replace(/src=\{item\.imageUrl\}/g, `src={item.menuItem?.image}`);
cartTab = cartTab.replace(/alt=\{item\.title\}/g, `alt={item.menuItem?.name || 'Item'}`);
cartTab = cartTab.replace(/\{item\.title\}/g, `{item.menuItem?.name || 'Item'}`);
cartTab = cartTab.replace(/\{itemSizePrice \* item\.quantity\}/g, `{(itemSizePrice * item.quantity)}`);

fs.writeFileSync('src/components/storefront/CartTab.tsx', cartTab, 'utf8');

// Fix OrdersTab.tsx
let ordersTab = fs.readFileSync('src/components/storefront/OrdersTab.tsx', 'utf8');

ordersTab = ordersTab.replace(
  `const singlePrice = (parseInt(item.price.replace(/[^\\d]/g, '')) || 0) + ('' === 'Large' ? 5000 : 0);`,
  `const basePrice = item.menuItem ? item.menuItem.price : 0;\n                                                                const singlePrice = basePrice + (item.size === 'Large' ? 5000 : 0);`
);

ordersTab = ordersTab.replace(/<h5 className="font-bold text-stone-800">\{item\.title\}<\/h5>/g, `<h5 className="font-bold text-stone-800">{item.menuItem?.name || 'Item'}</h5>`);
ordersTab = ordersTab.replace(/\(\{''\} • \{''\}\)/g, `({item.size} • {item.sugarLevel})`);

fs.writeFileSync('src/components/storefront/OrdersTab.tsx', ordersTab, 'utf8');

// Fix StorefrontClient.tsx activeQueue error
let client = fs.readFileSync('src/components/storefront/StorefrontClient.tsx', 'utf8');
client = client.replace(/activeQueue/g, 'activeQueueId');
fs.writeFileSync('src/components/storefront/StorefrontClient.tsx', client, 'utf8');

console.log('Fixed tabs!');
