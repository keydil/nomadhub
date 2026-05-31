const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add editHashtags state
content = content.replace(
    `const [editDescription, setEditDescription] = useState('');`,
    `const [editDescription, setEditDescription] = useState('');\n    const [editHashtags, setEditHashtags] = useState<string[]>([]);`
);

// 2. Set editHashtags in handleStartEdit
content = content.replace(
    `setEditDescription(item.description);`,
    `setEditDescription(item.description);\n        setEditHashtags(item.hashtags || []);`
);

// 3. Pass editHashtags to onEditMenuAction in handleSaveEdit
content = content.replace(
    `await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim());`,
    `await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim(), editHashtags);`
);

// 4. Add Hashtags Input to the Edit Modal UI
// Looking for CATATAN COPYWRITING / DESKRIPSI MENU textarea in the edit modal
const editModalTextareaRegex = /(<label className="text-\[9px\] uppercase font-black tracking-wider text-stone-400 block mb-1">CATATAN COPYWRITING \/ DESKRIPSI MENU<\/label>\s*<textarea[\s\S]*?value=\{editDescription\}[\s\S]*?<\/textarea>)/;

if (editModalTextareaRegex.test(content)) {
    content = content.replace(editModalTextareaRegex, `$1
                                        </div>
                                        <div className="mt-3">
                                            <label className="text-[9px] uppercase font-black tracking-wider text-stone-400 block mb-1">HASHTAGS (Pisahkan dengan koma)</label>
                                            <input
                                                type="text"
                                                value={editHashtags.join(', ')}
                                                onChange={(e) => setEditHashtags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                                placeholder="#KopiEnak, #Nongkrong"
                                                className="w-full bg-[#fcfcf9] border border-stone-200 focus:outline-none p-2.5 rounded-xl text-xs font-bold text-stone-750"
                                            />
                                            {editHashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {editHashtags.map((tag, idx) => (
                                                        <span key={idx} className="text-[9px] font-black tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}`);
}

// 5. Display hashtags in the active menu catalog cards
// Find the <p className="text-[9px] text-stone-400 leading-relaxed mt-1 line-clamp-2">
const catalogDescRegex = /(<p className="text-\[9px\] text-stone-400 leading-relaxed mt-1 line-clamp-2">[\s\S]*?\{item\.description\}[\s\S]*?<\/p>)/;

if (catalogDescRegex.test(content)) {
    content = content.replace(catalogDescRegex, `$1
                                                    {item.hashtags && item.hashtags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {item.hashtags.slice(0,3).map((tag, i) => (
                                                                <span key={i} className="text-[7.5px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {item.hashtags.length > 3 && (
                                                                <span className="text-[7.5px] font-bold text-stone-400 px-1 py-0.5">+{item.hashtags.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}`);
}


fs.writeFileSync(filePath, content, 'utf8');
console.log('Vendor edit modal and catalog updated!');
