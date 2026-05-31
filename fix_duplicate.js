const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorDashboard.tsx');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// The file got duplicated. Lines 1 to 67 are the old content.
// The new content starts at line 68 (0-indexed line 67).
// Let's verify line 67 is "import React, { useState, useEffect } from 'react';" (ignoring carriage returns)
if (lines[67].includes('import React')) {
    lines = lines.slice(67);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log('Fixed duplication by removing first 67 lines.');
} else {
    console.log('Line 67 is not import React. Found: ' + lines[67]);
}
