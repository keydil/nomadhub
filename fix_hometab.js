const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/storefront/HomeTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /(<p className="text-\[9px\] text-stone-400 leading-relaxed line-clamp-2 mt-1">\s*\{item\.description\}\s*<\/p>)/;

if (regex.test(content)) {
    content = content.replace(regex, `$1
                                        {(() => {
                                            let tags = [];
                                            try {
                                                const parsed = JSON.parse(item.description);
                                                if (parsed.hashtags) tags = parsed.hashtags;
                                            } catch {}
                                            if (tags.length > 0) {
                                                return (
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {tags.slice(0,3).map((tag, i) => (
                                                            <span key={i} className="text-[7.5px] font-bold text-amber-600 bg-amber-50/50 px-1.5 py-0.5 rounded border border-amber-100">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}`);
    
    // We also need to fix how description is rendered if it's JSON
    // Replace {item.description} inside the P tag with a parsed version
    content = content.replace(
        `<p className="text-[9px] text-stone-400 leading-relaxed line-clamp-2 mt-1">
                                            {item.description}
                                        </p>`,
        `<p className="text-[9px] text-stone-400 leading-relaxed line-clamp-2 mt-1">
                                            {(() => {
                                                try { return JSON.parse(item.description).description || item.description }
                                                catch { return item.description }
                                            })()}
                                        </p>`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('HomeTab catalog tags updated!');
} else {
    console.log('HomeTab regex failed.');
}
