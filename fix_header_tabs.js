const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const anchorTop = `                    </AnimatePresence>`;
const anchorBottom = `                                    setActiveTab('settings');
                                    triggerNotification('⚙️ Beralih ke Pengaturan Profil Kedai.');`;

const missingCode = `                    </AnimatePresence>

                    {/* --- TOP BRANDING MINI HEADER --- */}
                    <div className="px-5 pt-3.5 pb-3 bg-white border-b border-stone-150 flex justify-between items-center flex-shrink-0 z-20">
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] font-black tracking-widest text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded leading-none uppercase">PORTAL MITRA</span>
                                <span className="text-[8px] font-black text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded leading-none uppercase">ELITE APP</span>
                            </div>
                            <h2 className="text-base font-black text-stone-900 mt-1 cursor-pointer hover:opacity-85 flex items-center gap-1.5 capitalize">
                                <Store className="w-4.5 h-4.5 text-amber-600" />
                                <span>{storeName}</span>
                            </h2>
                        </div>

                        {/* Premium Header Tab Switcher (Visible on Laptop and tablet devices only) */}
                        <div className={\`hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-2xl\`}>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('queue');
                                    triggerNotification(\`📊 Beralih ke Antrean \${storeName}.\`);
                                }}
                                className={\`px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer \${activeTab === 'queue' ? 'bg-amber-500 text-stone-950 font-black shadow-xs' : 'text-stone-500 hover:text-stone-800'
                                    }\`}
                            >
                                Antrean Antar ({activeQueueCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('ai-menu');
                                    triggerNotification('✨ Beralih ke Vision AI Recipe Workspace.');
                                }}
                                className={\`px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer \${activeTab === 'ai-menu' ? 'bg-sky-500 text-white font-black shadow-xs' : 'text-stone-500 hover:text-stone-850'
                                    }\`}
                            >
                                Recipe AI Scanner
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('settings');
                                    triggerNotification('⚙️ Beralih ke Pengaturan Profil Kedai.');`;

if (content.includes(anchorTop) && content.includes(anchorBottom)) {
    // Regex replace everything between anchorTop and anchorBottom (including them)
    const regex = new RegExp(anchorTop + '[\\s\\S]*?' + anchorBottom.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\$&'));
    content = content.replace(regex, missingCode);
    console.log("Header tabs repaired!");
} else {
    console.log("Could not find anchors!");
}

fs.writeFileSync(filePath, content, 'utf8');
