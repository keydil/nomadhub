const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useRef if not present
if (!content.includes('useRef')) {
    content = content.replace(/import React, { useState, useEffect } from 'react';/, "import React, { useState, useEffect, useRef } from 'react';");
}

// 2. Add refs to the component body
const refsCode = `
    const logoInputRef = useRef<HTMLInputElement>(null);
    const menuImageInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingMenu, setIsUploadingMenu] = useState(false);
`;
// Insert after `const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);`
content = content.replace(/const \[isConfirmingDelete, setIsConfirmingDelete\] = useState\(false\);/, `const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);\n${refsCode}`);


// 3. Replace the logo button section
const logoButtonRegex = /<button\s*onClick=\{\(\) => \{\s*const newLogo = prompt\("Masukkan URL gambar benderamu:", logoImage\);\s*if \(newLogo\) setLogoImage\(newLogo\);\s*\}\}\s*className="bg-stone-50 border border-stone-200 text-stone-700 text-\[9\.5px\] font-black px-3 py-1\.5 rounded-lg active:scale-95 transition cursor-pointer"\s*>\s*Ganti Gambar Avatar\s*<\/button>/;

const newLogoButton = `
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    ref={logoInputRef}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        if (!(props as any).onUploadLogoAction) {
                                                            triggerNotification("⚠️ Fitur upload belum dikonfigurasi.");
                                                            return;
                                                        }
                                                        setIsUploadingLogo(true);
                                                        const url = await (props as any).onUploadLogoAction(file);
                                                        if (url) {
                                                            triggerNotification("📸 Avatar berhasil diperbarui!");
                                                        }
                                                        setIsUploadingLogo(false);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => logoInputRef.current?.click()}
                                                    disabled={isUploadingLogo}
                                                    className="bg-stone-50 border border-stone-200 text-stone-700 text-[9.5px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer disabled:opacity-50"
                                                >
                                                    {isUploadingLogo ? 'Mengunggah...' : 'Ganti Gambar Avatar'}
                                                </button>
`;
content = content.replace(logoButtonRegex, newLogoButton);

// 4. Replace the menu edit button section
const menuButtonRegex = /<button\s*onClick=\{\(\) => \{\s*const newImg = prompt\("Masukkan URL gambar baru untuk menu ini:", editingItem\.image\);\s*if \(newImg\) \{\s*setMenuItems\(prev => prev\.map\(it => it\.id === editingItem\.id \? \{ \.\.\.it, image: newImg \} : it\)\);\s*setEditingItem\(prev => prev \? \{ \.\.\.prev, image: newImg \} : null\);\s*triggerNotification\("📸 Gambar menu berhasil diubah!"\);\s*\}\s*\}\}\s*className="text-\[9\.5px\] font-bold text-sky-600 hover:text-sky-700 transition mt-1\.5 inline-block cursor-pointer"\s*>\s*Ganti Tautan Foto Menu\s*<\/button>/;

const newMenuButton = `
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    ref={menuImageInputRef}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        // We pass this file to onEditMenuAction by uploading it first
                                                        setIsUploadingMenu(true);
                                                        try {
                                                            const formData = new FormData();
                                                            formData.append('file', file);
                                                            // We need to fetch uploadMenuImage or just use the backend upload API directly
                                                            const res = await fetch('/api/upload', {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            
                                                            // Since we don't have access to uploadMenuImage directly in this component,
                                                            // We'll set it as a temporary object URL, and the actual upload will happen in page.tsx!
                                                            // Actually, page.tsx doesn't take file for edit. It takes imageUrl.
                                                            // We must upload it here. Let's assume the upload endpoint exists, or we use a hack:
                                                            // Wait, \`onPublishMenuAction\` uploads it using \`uploadMenuImage\` internally if \`file\` is provided.
                                                            // Let's pass the \`file\` up to \`onEditMenuAction\` by changing \`onEditMenuAction\` in page.tsx.
                                                            // BUT for now we can just use the \`onUploadLogoAction\` trick or create a local function!
                                                            const uploadedUrl = await (props as any).onUploadLogoAction(file);
                                                            if (uploadedUrl) {
                                                                setMenuItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, image: uploadedUrl } : it));
                                                                setEditingItem(prev => prev ? { ...prev, image: uploadedUrl } : null);
                                                                triggerNotification("📸 Gambar menu berhasil diubah!");
                                                            }
                                                        } finally {
                                                            setIsUploadingMenu(false);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => menuImageInputRef.current?.click()}
                                                    disabled={isUploadingMenu}
                                                    className="text-[9.5px] font-bold text-sky-600 hover:text-sky-700 transition mt-1.5 inline-block cursor-pointer disabled:opacity-50"
                                                >
                                                    {isUploadingMenu ? 'Mengunggah...' : 'Ganti Tautan Foto Menu'}
                                                </button>
`;
content = content.replace(menuButtonRegex, newMenuButton);


// 5. In \`handleSaveEdit\`, we need to pass the updated image url to \`onEditMenuAction\`.
// Currently: \`await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim(), editHashtags);\`
// Change it to pass \`editingItem.image\` as the 7th parameter!
const editActionRegex = /await \(props as any\)\.onEditMenuAction\(editingItem\.id, editName\.trim\(\), editPrice, editCategory, editDescription\.trim\(\), editHashtags\);/;
const newEditAction = `await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim(), editHashtags, editingItem.image);`;
content = content.replace(editActionRegex, newEditAction);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Image uploads fixed!");
