const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The replacement that failed before:
const regex = /<h4 className="text-\[11\.5px\] font-black text-stone-850">Pilih Demo Foto Makanan Sat-Set:<\/h4>[\s\S]*?<\/div>[\s\S]*?<\/>[\s\S]*?\)}/m;

const replacement = `
<h4 className="text-[11.5px] font-black text-stone-850">Unggah Foto Makanan Asli:</h4>
<p className="text-[9.5px] text-stone-400 font-semibold mt-1">Pilih foto dari galeri untuk memicu Vision AI:</p>
<div className="flex gap-2 mt-4.5 w-full">
    <label className="w-full bg-amber-500 hover:bg-amber-600 rounded-xl px-4 py-3 border border-amber-600 text-[11px] font-black text-stone-900 transition flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-md text-center">
        <Camera className="w-4 h-4" />
        Buka Galeri / Kamera
        <input type="file" className="hidden" accept="image/*" onChange={handleChooseRealPhoto} />
    </label>
</div>
</>
)}
`;

if (regex.test(content)) {
    content = content.replace(regex, replacement.trim());
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Mock buttons replaced successfully!");
} else {
    console.log("Regex didn't match!");
    // Let's try string split as fallback
    const index = content.indexOf('Pilih Demo Foto Makanan Sat-Set:');
    if (index !== -1) {
        console.log("Found string at index " + index);
    }
}
