const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /(<option value="All">Coffee & Minuman<\/option>\s*<option value="Makanan Utama">Makanan Utama<\/option>\s*<option value="Snack">Camilan Gurih<\/option>\s*<option value="Dessert">Dessert Manis<\/option>)/;

const newCats = `<option value="Makanan Utama">Makanan Utama</option>
                                                    <option value="Coffee">Kopi & Minuman Dingin</option>
                                                    <option value="Minuman Tradisional">Minuman Hangat & Tradisional</option>
                                                    <option value="Snack">Camilan & Gorengan</option>
                                                    <option value="Dessert">Dessert & Roti</option>
                                                    <option value="Frozen Food">Siap Masak / Frozen Food</option>`;

if (regex.test(content)) {
    content = content.replace(regex, newCats);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Categories fixed in edit modal!');
} else {
    console.log('Regex failed in edit modal.');
}
