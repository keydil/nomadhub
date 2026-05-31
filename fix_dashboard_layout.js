const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The string we want to replace
const targetStr = `            <div
                id="ux_phone_mockup"
                className={
                    false
                        ? "relative w-full max-w-[395px] h-[820px] rounded-[52px] bg-stone-900 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-4 border-stone-800/90 flex flex-col overflow-hidden"
                        : "relative w-full max-w-[395px] md:max-w-6xl h-[820px] md:h-auto md:min-h-[820px] rounded-[52px] md:rounded-[36px] bg-stone-900 md:bg-[#faf9f6]/95 p-3 md:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)] md:shadow-2xl border-4 md:border md:border-stone-250/70 flex flex-col overflow-hidden transition-all duration-300"
                }
            >
                {/* Apple Dynamic Island Notch */}
                <div className={\`absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none md:hidden\`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-950 absolute right-4" />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-900 absolute left-4" />
                </div>`;

const replaceStr = `            <div
                id="ux_phone_mockup"
                className="relative w-full md:max-w-6xl h-[100dvh] md:h-auto md:min-h-[820px] md:rounded-[36px] bg-[#faf9f6] md:bg-[#faf9f6]/95 md:p-4 shadow-none md:shadow-2xl border-none md:border md:border-stone-250/70 flex flex-col overflow-hidden transition-all duration-300"
            >`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    console.log("Successfully replaced target string!");
} else {
    console.log("Failed to find target string. Proceeding with regex fallback...");
    // Fallback: replace everything between <div id="ux_phone_mockup"... to the end of dynamic island
    let re = /<div\s+id="ux_phone_mockup"[\s\S]*?className=\{[\s\S]*?false[\s\S]*?border-stone-250\/70 flex flex-col overflow-hidden transition-all duration-300"[\s\S]*?\}\s*>\s*\{\/\* Apple Dynamic Island Notch \*\/\}\s*<div className=\{`absolute top-4 left-1\/2 -translate-x-1\/2 w-28 h-5\.5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none md:hidden`\}>\s*<div className="w-2\.5 h-2\.5 rounded-full bg-stone-950 absolute right-4" \/>\s*<div className="w-1\.5 h-1\.5 rounded-full bg-stone-900 absolute left-4" \/>\s*<\/div>/;
    
    if (re.test(content)) {
        content = content.replace(re, replaceStr);
        console.log("Regex fallback succeeded!");
    } else {
        console.log("Regex fallback also failed.");
    }
}

// 2. Also remove `p-0 md:p-6 lg:p-8` from the outer container if we want it completely full screen on mobile, and maybe change `min-h-screen` to `h-[100dvh]`
const outerContainerRegex = /className="min-h-screen w-full relative flex flex-col items-center justify-center bg-stone-950 p-0 md:p-6 lg:p-8 select-none overflow-x-hidden text-stone-850 font-sans"/;
const newOuterContainer = `className="h-[100dvh] md:min-h-screen w-full relative flex flex-col items-center justify-center bg-stone-950 p-0 md:p-6 lg:p-8 select-none overflow-x-hidden text-stone-850 font-sans"`;

content = content.replace(outerContainerRegex, newOuterContainer);

fs.writeFileSync(filePath, content, 'utf8');

