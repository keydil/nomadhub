const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix logo image initialization
content = content.replace(
    `const [logoImage, setLogoImage] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80');`,
    `const [logoImage, setLogoImage] = useState((props as any).logoImage || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80');`
);

// Fix AI Menu URL Initialization in edit/publish form
content = content.replace(
    `image: uploadedPhotoUrl || 'https://images.unsplash.com`,
    `image: (props as any).uploadedPhotoUrl || uploadedPhotoUrl || 'https://images.unsplash.com`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('VendorDashboard.tsx refactored logo state successfully!');
