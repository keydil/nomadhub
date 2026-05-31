const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// 1. Add aiHashtags state
dashboardContent = dashboardContent.replace(
    `const [aiDescription, setAiDescription] = useState('');`,
    `const [aiDescription, setAiDescription] = useState('');\n    const [aiHashtags, setAiHashtags] = useState<string[]>([]);`
);

// 2. Update handleMagicPolish
dashboardContent = dashboardContent.replace(
    `if (res?.description) setAiDescription(res.description);`,
    `if (res?.description) setAiDescription(res.description);\n                if (res?.hashtags) setAiHashtags(res.hashtags);`
);

// 3. Update handlePublishNewProduct call
dashboardContent = dashboardContent.replace(
    `await (props as any).onPublishMenuAction(aiMenuName.trim(), aiDescription, aiPrice, uploadedPhotoUrl, aiCategory, (props as any).actualFileToUpload);`,
    `await (props as any).onPublishMenuAction(aiMenuName.trim(), aiDescription, aiPrice, uploadedPhotoUrl, aiCategory, (props as any).actualFileToUpload, aiHashtags);`
);

// clear state after publish
dashboardContent = dashboardContent.replace(
    `setAiDescription('');`,
    `setAiDescription('');\n            setAiHashtags([]);`
);

// 4. Inject Hashtags UI below the Textarea
const textareaRegex = /(<textarea[\s\S]*?className="w-full bg-\[#fcfcf9\].*?\/>\n\s*<\/div>)/;
if (textareaRegex.test(dashboardContent)) {
    dashboardContent = dashboardContent.replace(textareaRegex, `$1
                                                    {aiHashtags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {aiHashtags.map((tag, idx) => (
                                                                <span key={idx} className="text-[9px] font-black tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}`);
}

fs.writeFileSync(dashboardPath, dashboardContent, 'utf8');

const pagePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// 5. Update onPublishMenuAction signature in app/dashboard/page.tsx
pageContent = pageContent.replace(
    `const onPublishMenuAction = async (title: string, desc: string, price: string, localUrl: string | null, category: string, file: File | null) => {`,
    `const onPublishMenuAction = async (title: string, desc: string, price: string, localUrl: string | null, category: string, file: File | null, tags: string[] = []) => {`
);

// 6. Fix structuredDescription hardcoded hashtags
pageContent = pageContent.replace(
    `const structuredDescription = JSON.stringify({
      description: desc,
      hashtags: []
    });`,
    `const structuredDescription = JSON.stringify({
      description: desc,
      hashtags: tags
    });`
);

fs.writeFileSync(pagePath, pageContent, 'utf8');

console.log('Hashtags features successfully restored!');
