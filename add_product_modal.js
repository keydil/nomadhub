const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/storefront/HomeTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variable
const stateInjection = `    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);`;
content = content.replace(`    const [searchQuery, setSearchQuery] = useState('');`, stateInjection);

// 2. Remove tags from the catalog card & add onClick to the card
const tagsRegex = /(\{item\.title\}\s*<\/h4>\s*\{?\/\*.*?\*\/\}?\s*<span className="text-\[12px\] font-extrabold text-amber-700 block mt-0\.5">\s*Rp \{item\.price\?\.toLocaleString\('id-ID'\)\}\s*<\/span>\s*<p className="text-\[9px\] text-stone-400 leading-relaxed line-clamp-2 mt-1">\s*\{\(\(\) => \{\s*try \{ return JSON\.parse\(item\.description\)\.description \|\| item\.description \}\s*catch \{ return item\.description \}\s*\}\)\(\)\}\s*<\/p>)[\s\S]*?(<\/div>\s*<\/div>\s*\{?\/\* Direct Notes Input Field \*\/\}?)/;

content = content.replace(tagsRegex, `$1
                                    </div>
                                </div>
                                {/* Direct Notes Input Field */`);

// Wait, the card div needs an onClick. Let's find the card opening div.
// <div key={item.id} className={`bg-white rounded-2.5xl p-2.5 border ...
const cardOpenRegex = /(<div key=\{item\.id\} className={`bg-white rounded-2\.5xl p-2\.5 border \$\{isSelected \? 'border-amber-400 shadow-sm' : 'border-stone-150'\} flex flex-col justify-between group transition-all relative overflow-hidden`})/;
content = content.replace(cardOpenRegex, `$1 onClick={() => setSelectedProduct(item)} cursor-pointer`);

// 3. Append Modal before the last </div>
const modalCode = `
            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ translateY: '100%' }}
                            animate={{ translateY: '0%' }}
                            exit={{ translateY: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[32px] z-50 flex flex-col overflow-hidden shadow-2xl"
                        >
                            <div className="w-12 h-1 bg-stone-250 rounded-full mx-auto mt-3 flex-shrink-0" />
                            
                            <div className="flex-1 overflow-y-auto pb-8">
                                <div className="h-56 w-full relative bg-stone-100">
                                    <img 
                                        src={selectedProduct.image || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Menu'} 
                                        alt={selectedProduct.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <button 
                                        onClick={() => setSelectedProduct(null)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-stone-900/50 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-stone-900/70 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-black text-stone-900 leading-tight">
                                                {selectedProduct.title}
                                            </h3>
                                            <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mt-2 inline-block">
                                                {selectedProduct.category === 'All' ? 'Coffee' : selectedProduct.category}
                                            </span>
                                        </div>
                                        <span className="text-lg font-extrabold text-amber-600 whitespace-nowrap">
                                            Rp {selectedProduct.price?.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1.5">Deskripsi</h4>
                                            <p className="text-xs text-stone-600 leading-relaxed">
                                                {(() => {
                                                    try { return JSON.parse(selectedProduct.description).description || selectedProduct.description }
                                                    catch { return selectedProduct.description }
                                                })()}
                                            </p>
                                        </div>
                                        
                                        {(() => {
                                            let tags = [];
                                            try {
                                                const parsed = JSON.parse(selectedProduct.description);
                                                if (parsed.hashtags) tags = parsed.hashtags;
                                            } catch {}
                                            if (tags.length > 0) {
                                                return (
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1.5">Tags</h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {tags.map((tag, i) => (
                                                                <span key={i} className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded border border-sky-100">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                    
                                    <div className="mt-8 pt-4 border-t border-stone-100">
                                        <button 
                                            onClick={() => {
                                                onUpdateQuantity(selectedProduct.id, 1);
                                                setSelectedProduct(null);
                                            }}
                                            className="w-full bg-stone-900 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-xl shadow-stone-900/20"
                                        >
                                            Tambah ke Keranjang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
`;

content = content.replace(/<\/div>\s*$/, modalCode);

// Don't forget to import X icon if it's missing
if (!content.includes('X, ')) {
    content = content.replace('Search, Star, Plus, Minus, MapPin, Compass, Phone, Sparkles, ShoppingCart, Check, Zap', 'Search, Star, Plus, Minus, MapPin, Compass, Phone, Sparkles, ShoppingCart, Check, Zap, X');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Product Modal Injected!');
