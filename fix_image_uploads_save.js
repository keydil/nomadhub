const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// For Menu Upload
const targetMenuBlock = `                                                            const uploadedUrl = await (props as any).onUploadLogoAction(file);
                                                            if (uploadedUrl) {
                                                                setMenuItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, image: uploadedUrl } : it));
                                                                setEditingItem(prev => prev ? { ...prev, image: uploadedUrl } : null);
                                                                triggerNotification("📸 Gambar menu berhasil diubah!");
                                                            }`;

const replacementMenuBlock = `                                                            const uploadedUrl = await (props as any).onUploadLogoAction(file);
                                                            if (uploadedUrl) {
                                                                setMenuItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, image: uploadedUrl } : it));
                                                                setEditingItem(prev => prev ? { ...prev, image: uploadedUrl } : null);
                                                                
                                                                // Langsung save ke database agar tidak perlu klik Simpan Perubahan lagi!
                                                                if ((props as any).onEditMenuAction) {
                                                                    await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim(), editHashtags, uploadedUrl);
                                                                }
                                                                triggerNotification("📸 Gambar menu berhasil diubah & disimpan otomatis!");
                                                            }`;

if (content.includes(targetMenuBlock)) {
    content = content.replace(targetMenuBlock, replacementMenuBlock);
    console.log("Menu auto-save updated!");
} else {
    console.log("Failed to find Menu block");
}

fs.writeFileSync(filePath, content, 'utf8');
