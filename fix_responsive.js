const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the window resize listener and viewLayout state
const useEffectRegex = /    const \[viewLayout, setViewLayout\] = useState\<'responsive' \| 'phone'\>\('responsive'\);\s+useEffect\(\(\) => \{\s+const handleResize = \(\) => \{\s+if \(window\.innerWidth < 768\) \{\s+setViewLayout\('phone'\);\s+\} else \{\s+setViewLayout\('responsive'\);\s+\}\s+\};\s+handleResize\(\);\s+window\.addEventListener\('resize', handleResize\);\s+return \(\) => window\.removeEventListener\('resize', handleResize\);\s+\}, \[\]\);/s;

content = content.replace(useEffectRegex, '');

// 2. Fix the wrapper classes to be native full screen on mobile, and panel on desktop
const wrapperRegex = /            <div\s+id="ux_phone_mockup"\s+className=\{[\s\S]*?\([\s\S]*?viewLayout === 'phone'[\s\S]*?\: "relative w-full max-w-\[395px\] md:max-w-6xl h-\[820px\] md:h-auto md:min-h-\[820px\] rounded-\[52px\] md:rounded-\[36px\] bg-stone-900 md:bg-\[#faf9f6\]\/95 p-3 md:p-4 shadow-\[0_25px_60px_rgba\(0,0,0,0\.85\)\] md:shadow-2xl border-4 md:border md:border-stone-250\/70 flex flex-col overflow-hidden transition-all duration-300"\s+\}\s+>/;

const newWrapper = `            <div
                id="ux_phone_mockup"
                className="relative w-full min-h-[100dvh] md:max-w-6xl md:h-auto md:min-h-[820px] md:rounded-[36px] bg-[#faf9f6] md:bg-[#faf9f6]/95 md:p-4 shadow-none md:shadow-2xl border-none md:border md:border-stone-250/70 flex flex-col md:overflow-hidden transition-all duration-300"
            >`;

// Wait, the regex might be tricky to match due to formatting. Let's use a simpler string replace.
const oldWrapper = `            <div
                id="ux_phone_mockup"
                className={
                    viewLayout === 'phone'
                        ? "relative w-full max-w-[395px] h-[820px] rounded-[52px] bg-stone-900 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-4 border-stone-800/90 flex flex-col overflow-hidden"
                        : "relative w-full max-w-[395px] md:max-w-6xl h-[820px] md:h-auto md:min-h-[820px] rounded-[52px] md:rounded-[36px] bg-stone-900 md:bg-[#faf9f6]/95 p-3 md:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)] md:shadow-2xl border-4 md:border md:border-stone-250/70 flex flex-col overflow-hidden transition-all duration-300"
                }
            >`;

content = content.replace(oldWrapper, newWrapper);

// 3. Remove Apple Dynamic Island Notch
const notchString = `                {/* Apple Dynamic Island Notch */}
                <div className={\`absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none \${viewLayout === 'responsive' ? 'md:hidden' : ''}\`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-950 absolute right-4" />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-900 absolute left-4" />
                </div>`;
content = content.replace(notchString, '');

// 4. Fix DEVICE SCREEN CANVAS
const oldCanvas = `                <div className={\`relative w-full h-full bg-[#faf9f6] rounded-[42px] md:rounded-[30px] overflow-hidden flex flex-col z-10 select-none \${viewLayout === 'responsive' ? 'md:bg-transparent' : ''}\`}>`;
const newCanvas = `                <div className="relative w-full h-full bg-[#faf9f6] md:bg-transparent md:rounded-[30px] overflow-hidden flex flex-col z-10 select-none">`;
content = content.replace(oldCanvas, newCanvas);

// 5. Remove Simulated iOS Status Bar
const statusBarRegex = /\s*\{\/\* Simulated iOS Status Bar \*\/\}\s*<div className=\{\`h-9 px-6 pt-3 flex justify-between items-center bg-\[#faf9f6\]\/95 z-30 \$\{viewLayout === 'responsive' \? 'md:hidden' : ''\}\`\}>\s*<span className="text-\[12px\] font-extrabold text-stone-900 tracking-tight">\{virtualTime\}<\/span>\s*<div className="flex items-center gap-1\.5 text-stone-900">\s*<Signal className="w-3\.5 h-3\.5" strokeWidth=\{2\.5\} \/>\s*<Wifi className="w-3\.5 h-3\.5" strokeWidth=\{2\.5\} \/>\s*<div className="relative w-5\.5 h-3 border border-stone-900 rounded-sm p-0\.5 flex items-center">\s*<span className="w-3 h-1\.5 bg-stone-900 rounded-3xs" \/>\s*<\/div>\s*<\/div>\s*<\/div>/;
content = content.replace(statusBarRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Responsive fixes applied successfully!');
