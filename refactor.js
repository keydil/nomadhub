const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add auto-responsive useEffect
content = content.replace(
    `const [viewLayout, setViewLayout] = useState<'responsive' | 'phone'>('responsive');`,
    `const [viewLayout, setViewLayout] = useState<'responsive' | 'phone'>('responsive');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewLayout('phone');
            } else {
                setViewLayout('responsive');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);`
);

// 2. Remove the floating buttons for manual responsive toggle
content = content.replace(
    /\{\/\* Floating Presentation Layout Switcher.*?<\/div>/s,
    `{/* Floating Presentation Layout Switcher removed in favor of auto-detect */}`
);

// 3. Fix "Sarah Fadhil" hardcoded name
content = content.replace(
    /Pelanggan: <strong className="text-stone-800 truncate">Sarah Fadhil<\/strong>/g,
    `Pelanggan: <strong className="text-stone-800 truncate">{(order as any).customerName || 'Pelanggan'}</strong>`
);

// 4. Update the "handleAdvanceOrder" to call a real prop if it exists
content = content.replace(
    `const handleAdvanceOrder = (orderId: string, currentStatus: OrderStatus) => {`,
    `const handleAdvanceOrder = (orderId: string, currentStatus: OrderStatus) => {
        // If passed from parent, use the real backend action
        if ((props as any).onAdvanceOrderAction) {
            (props as any).onAdvanceOrderAction(orderId, currentStatus);
            return;
        }`
);

// Also we need to make sure 'props' is accessible. Let's change the component signature to include '...props'
content = content.replace(
    `onLogout
}: VendorDashboardProps) {`,
    `onLogout,
    ...props
}: VendorDashboardProps & { [key: string]: any }) {`
);

// 5. Update handlePublishNewProduct to call backend prop
content = content.replace(
    `const handlePublishNewProduct = () => {`,
    `const handlePublishNewProduct = async () => {
        if ((props as any).onPublishMenuAction) {
            await (props as any).onPublishMenuAction(aiMenuName.trim(), aiDescription, aiPrice, uploadedPhotoUrl, aiCategory, (props as any).actualFileToUpload);
            triggerNotification(\`🎉 Menu "\${aiMenuName}" sukses dipublikasikan untuk Pembeli!\`);
            setUploadedPhotoUrl(null);
            setAiMenuName('');
            setAiDescription('');
            return;
        }`
);

// 6. Update handleMagicPolish to call backend prop
content = content.replace(
    `const handleMagicPolish = () => {`,
    `const handleMagicPolish = async () => {
        if (!aiMenuName.trim()) {
            triggerNotification('⚠️ Isi nama minuman/makanan terlebih dahulu!');
            return;
        }
        setIsMagicPolishing(true);
        if ((props as any).onMagicPolishAction) {
            try {
                const res = await (props as any).onMagicPolishAction(aiMenuName);
                if (res?.description) setAiDescription(res.description);
                triggerNotification('🔮 Copywriting premium sukses dipoles AI!');
            } catch (e) {
                triggerNotification('❌ Gagal memoles teks dengan AI.');
            } finally {
                setIsMagicPolishing(false);
            }
            return;
        }`
);

// 7. Replace handleChooseMockPhoto with a real file uploader
content = content.replace(
    `const handleChooseMockPhoto = (type: 'ice_coffee' | 'croissant' | 'matcha') => {`,
    `const handleChooseRealPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const localUrl = URL.createObjectURL(file);
        setUploadedPhotoUrl(localUrl);
        (props as any).setActualFileToUpload && (props as any).setActualFileToUpload(file);
        
        setIsVisionScanning(true);
        setVisionProcessStep('Vision AI Analyzing...');
        
        if ((props as any).onProcessImageAction) {
            try {
                const res = await (props as any).onProcessImageAction(file);
                if (res) {
                    setAiMenuName(res.title || '');
                    setAiPrice(res.suggestedPrice || '25000');
                    if (res.category) setAiCategory(res.category);
                    triggerNotification('📸 Vision AI berhasil memindai citarasa foto!');
                }
            } catch (e) {
                triggerNotification('❌ Vision AI gagal menganalisis.');
            } finally {
                setIsVisionScanning(false);
            }
            return;
        }
    };
    
    const handleChooseMockPhoto = (type: 'ice_coffee' | 'croissant' | 'matcha') => {`
);

// Replace the mock buttons in UI with an actual file input
content = content.replace(
    /Pilih Demo Foto Makanan Sat-Set:.*?<\/div>\s*<\/div>\s*<\/>/s,
    `Unggah Foto Makanan Asli:</h4>
     <p className="text-[9.5px] text-stone-400 font-semibold mt-1">Pilih foto dari galeri untuk memicu Vision AI:</p>
     <div className="flex gap-2 mt-4.5 w-full">
         <label className="w-full bg-amber-500 hover:bg-amber-600 rounded-xl px-4 py-3 border border-amber-600 text-[11px] font-black text-stone-900 transition flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-md text-center">
             <Camera className="w-4 h-4" />
             Buka Galeri / Kamera
             <input type="file" className="hidden" accept="image/*" onChange={handleChooseRealPhoto} />
         </label>
     </div>
     </>
    `
);

// 8. Update handleSaveEdit to call backend
content = content.replace(
    `const handleSaveEdit = () => {`,
    `const handleSaveEdit = async () => {
        if (!editingItem) return;
        if (!editName.trim()) {
            triggerNotification('⚠️ Nama menu tidak boleh kosong!');
            return;
        }

        if ((props as any).onEditMenuAction) {
            await (props as any).onEditMenuAction(editingItem.id, editName.trim(), editPrice, editCategory, editDescription.trim());
            triggerNotification(\`💾 Menu "\${editName.trim()}" berhasil diperbarui!\`);
            setEditingItem(null);
            return;
        }`
);

// 9. Update handleDeleteItem to call backend
content = content.replace(
    `const handleDeleteItem = () => {`,
    `const handleDeleteItem = async () => {
        if (!editingItem) return;

        if ((props as any).onDeleteMenuAction) {
            await (props as any).onDeleteMenuAction(editingItem.id);
            triggerNotification(\`🗑️ Menu "\${editingItem.name}" berhasil dihapus.\`);
            setEditingItem(null);
            setIsConfirmingDelete(false);
            return;
        }`
);

// 10. Update handleSaveSettings
content = content.replace(
    `const handleSaveSettings = (e: React.FormEvent) => {`,
    `const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((props as any).onSaveSettingsAction) {
            await (props as any).onSaveSettingsAction(tempStoreName, tempLocation, tempSlogan);
            triggerNotification('💾 Pengaturan Kedai & Titik Parkir sukses disimpan!');
            return;
        }`
);

// 11. Profile Upload Action
content = content.replace(
    `const newLogo = prompt("Masukkan URL gambar benderamu:", logoImage);
                                                        if (newLogo) setLogoImage(newLogo);`,
    `const fileInput = document.createElement('input');
                                                        fileInput.type = 'file';
                                                        fileInput.accept = 'image/*';
                                                        fileInput.onchange = async (e: any) => {
                                                            const file = e.target.files?.[0];
                                                            if (file && (props as any).onUploadLogoAction) {
                                                                const url = await (props as any).onUploadLogoAction(file);
                                                                if (url) setLogoImage(url);
                                                                triggerNotification("📸 Gambar logo berhasil diubah!");
                                                            }
                                                        };
                                                        fileInput.click();`
);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('VendorDashboard.tsx refactored successfully!');
