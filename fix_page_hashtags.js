const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update menuItems map in DashboardContainer
content = content.replace(
    /menuItems={menuItems\.map\(m => \(\{\s*id: m\.id, name: m\.title, description: \(\(\) => \{\s*try \{ return JSON\.parse\(m\.description\)\.description \|\| m\.description \}\s*catch \{ return m\.description \}\s*\}\)\(\), price: m\.price, category: m\.category, image: m\.imageUrl \|\| 'https:\/\/placehold\.co\/400\?text=Menu'\s*\}\)\) as any}/s,
    `menuItems={menuItems.map(m => {
          let desc = m.description;
          let tags: string[] = [];
          try {
             const parsed = JSON.parse(m.description);
             if (parsed.description) desc = parsed.description;
             if (parsed.hashtags) tags = parsed.hashtags;
          } catch {}
          return { id: m.id, name: m.title, description: desc, hashtags: tags, price: m.price, category: m.category, image: m.imageUrl || 'https://placehold.co/400?text=Menu' };
      }) as any}`
);

// Update onEditMenuAction to accept tags
content = content.replace(
    `const onEditMenuAction = async (id: string, name: string, price: number, category: string, desc: string) => {`,
    `const onEditMenuAction = async (id: string, name: string, price: number, category: string, desc: string, tags: string[] = []) => {`
);

content = content.replace(
    `setMenuItems(prev => prev.map(item => item.id === id ? { ...item, title: name, price, category, description: desc } : item));`,
    `setMenuItems(prev => prev.map(item => item.id === id ? { ...item, title: name, price, category, description: JSON.stringify({ description: desc, hashtags: tags }) } : item));`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Page hashtags updated!');
