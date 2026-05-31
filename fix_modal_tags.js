const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /(<label className="text-\[9px\] uppercase font-black text-stone-450 tracking-wider block mb-1">Catatan Copywriting \/ Deskripsi Menu<\/label>\s*<textarea[\s\S]*?value=\{editDescription\}[\s\S]*?className="w-full bg-\[#fcfcf9\][\s\S]*?\/>\s*<\/div>)/;

if (regex.test(content)) {
    content = content.replace(regex, `$1
                                        <div className="mt-3">
                                            <label className="text-[9px] uppercase font-black tracking-wider text-stone-400 block mb-1">HASHTAGS (Pisahkan dengan koma)</label>
                                            <input
                                                type="text"
                                                value={editHashtags.join(', ')}
                                                onChange={(e) => setEditHashtags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                                placeholder="#KopiEnak, #Nongkrong"
                                                className="w-full bg-[#fcfcf9] border border-stone-200 focus:outline-none focus:border-amber-500 p-2.5 rounded-xl text-xs font-bold text-stone-750"
                                            />
                                            {editHashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {editHashtags.map((tag, idx) => (
                                                        <span key={idx} className="text-[9px] font-black tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Edit Modal tags input injected!');
} else {
    console.log('Regex failed to match Edit Modal textarea.');
}
