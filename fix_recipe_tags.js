const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /(<textarea\s*rows=\{3\}\s*value=\{aiDescription\}[\s\S]*?\/>\s*<\/div>)/;

if (regex.test(content)) {
    content = content.replace(regex, `$1
                                                {aiHashtags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {aiHashtags.map((tag, idx) => (
                                                            <span key={idx} className="text-[9px] font-black tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Recipe creator tags injected!');
} else {
    console.log('Regex failed.');
}
