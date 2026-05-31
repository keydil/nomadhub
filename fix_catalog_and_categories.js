const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix categories in AI Menu Form
const aiCategoryRegex = /(<select[\s\S]*?value=\{aiCategory\}[\s\S]*?>\s*)<option value="Coffee">Coffee & Minuman<\/option>\s*<option value="Snack">Camilan Gurih<\/option>\s*<option value="Dessert">Dessert Manis<\/option>(\s*<\/select>)/;
const fullCategories = `<option value="Makanan Utama">Makanan Utama</option>
                                                            <option value="Coffee">Kopi & Minuman Dingin</option>
                                                            <option value="Minuman Tradisional">Minuman Hangat & Tradisional</option>
                                                            <option value="Snack">Camilan & Gorengan</option>
                                                            <option value="Dessert">Dessert & Roti</option>
                                                            <option value="Frozen Food">Siap Masak / Frozen Food</option>`;

if (aiCategoryRegex.test(content)) {
    content = content.replace(aiCategoryRegex, `$1${fullCategories}$2`);
} else {
    console.log("Failed to replace AI categories");
}

// 2. Fix categories in Edit Modal
const editCategoryRegex = /(<select[\s\S]*?value=\{editCategory\}[\s\S]*?>\s*)<option value="Makanan Utama">Makanan Utama<\/option>\s*<option value="Coffee">Kopi & Minuman<\/option>\s*<option value="Snack">Camilan & Gorengan<\/option>\s*<option value="Dessert">Dessert Manis<\/option>(\s*<\/select>)/;
const editCategories = `<option value="Makanan Utama">Makanan Utama</option>
                                                    <option value="Coffee">Kopi & Minuman Dingin</option>
                                                    <option value="Minuman Tradisional">Minuman Hangat & Tradisional</option>
                                                    <option value="Snack">Camilan & Gorengan</option>
                                                    <option value="Dessert">Dessert & Roti</option>
                                                    <option value="Frozen Food">Siap Masak / Frozen Food</option>`;
if (editCategoryRegex.test(content)) {
    content = content.replace(editCategoryRegex, `$1${editCategories}$2`);
} else {
    console.log("Failed to replace Edit categories");
}

// 3. Inject tags into Seller Catalog active items
const sellerCatalogRegex = /(<div className="flex items-center justify-between mt-1\.5">\s*<span className="text-\[10px\] text-amber-800 font-extrabold block">\s*Rp \{item\.price\.toLocaleString\('id-ID'\)\}\s*<\/span>\s*<span className="text-\[7\.5px\] text-stone-400 font-black tracking-widest uppercase bg-stone-50 border border-stone-150 px-1 py-0\.5 rounded max-w-\[50px\] truncate">\s*\{item\.category === 'All' \? 'Coffee' : item\.category\}\s*<\/span>\s*<\/div>\s*<\/div>)/;

if (sellerCatalogRegex.test(content)) {
    content = content.replace(sellerCatalogRegex, `$1
                                                                        {item.hashtags && item.hashtags.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                                {item.hashtags.slice(0,3).map((tag, i) => (
                                                                                    <span key={i} className="text-[7.5px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}`);
    console.log("Seller catalog tags injected!");
} else {
    console.log("Failed to inject seller catalog tags");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Script finished.');
