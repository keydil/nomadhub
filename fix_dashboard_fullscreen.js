const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replaceStr = `        <div className="h-[100dvh] w-full relative flex flex-col bg-[#faf9f6] text-stone-850 font-sans overflow-hidden select-none">`;

let re = /<div className="h-\[100dvh\] md:min-h-screen w-full relative flex flex-col items-center justify-center bg-stone-950 p-0 md:p-6 lg:p-8 select-none overflow-x-hidden text-stone-850 font-sans">[\s\S]*?\{\/\* --- DEVICE SCREEN CANVAS --- \*\/\}\s*<div className="relative w-full h-full bg-\[#faf9f6\] md:bg-transparent md:rounded-\[30px\] overflow-hidden flex flex-col z-10 select-none">/;

if (re.test(content)) {
    content = content.replace(re, replaceStr);
    console.log("Regex fallback succeeded!");
} else {
    console.log("Regex fallback failed. Content not found.");
}

const closingTagsRegex = /                <\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;
const newClosingTags = `        </div>\n    );\n}`;
content = content.replace(closingTagsRegex, newClosingTags);

const bottomNavRegex = /<div\s*id="seller_app_bottom_nav"\s*className="absolute bottom-0 left-0 right-0 h-\[74px\] bg-white\/95 backdrop-blur-md border-t border-stone-150 px-4 pt-2\.5 pb-\[22px\] flex justify-around items-center z-45 shadow-\[0_-8px_24px_rgba\(0,0,0,0\.03\)\]"\s*>/;
const newBottomNav = `<div
                        id="seller_app_bottom_nav"
                        className="mt-auto w-full h-[74px] flex-none bg-white/95 backdrop-blur-md border-t border-stone-150 px-4 pt-2.5 pb-[22px] flex justify-around items-center z-45 shadow-[0_-8px_24px_rgba(0,0,0,0.03)]"
                    >`;
content = content.replace(bottomNavRegex, newBottomNav);

const scrollAreaRegex = /<div className="flex-1 overflow-y-auto pb-24 scrollbar-none">/;
const newScrollArea = `<div className="flex-1 overflow-y-auto pb-4 scrollbar-none">`;
content = content.replace(scrollAreaRegex, newScrollArea);

const stripRegex = /\{\/\* Virtual iOS Bottom Indication Strip aligned with Light Theme \*\/\}\s*<div className="absolute bottom-\[4px\] left-1\/2 -translate-x-1\/2 w-28 h-1 bg-stone-300 rounded-full z-40 pointer-events-none" \/>/;
content = content.replace(stripRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
