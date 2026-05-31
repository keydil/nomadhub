const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const anchorTopRegex = /const \[virtualTime, setVirtualTime\] = useState\('08:45'\);[\s\S]*?const \[aiMenuName, setAiMenuName\] = useState\(''\);/m;

const missingCode = `const [virtualTime, setVirtualTime] = useState('08:45');

    // Static Local States representing real operational values
    const [locationInput, setLocationInput] = useState(storeLocation);
    const [copiedLink, setCopiedLink] = useState(false);

    // Settings Tab states
    const [tempStoreName, setTempStoreName] = useState(storeName);
    const [tempLocation, setTempLocation] = useState(storeLocation);
    const [tempSlogan, setTempSlogan] = useState('Kopi nikmat berkualitas premium buat kaum intelektual urban!');
    const [logoImage, setLogoImage] = useState((props as any).logoImage);

    // AI Menu Tab states
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
    const [isVisionScanning, setIsVisionScanning] = useState(false);
    const [visionProcessStep, setVisionProcessStep] = useState('');

    const [aiMenuName, setAiMenuName] = useState('');`;

if (content.match(anchorTopRegex)) {
    content = content.replace(anchorTopRegex, missingCode);
    console.log("Dashboard state repaired!");
} else {
    console.log("Could not find regex!");
}

fs.writeFileSync(filePath, content, 'utf8');
