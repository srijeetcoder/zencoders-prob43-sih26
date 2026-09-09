const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\srije\\.gemini\\antigravity-ide\\brain\\937448d7-9125-4466-b2ba-e85593b3fb87\\.user_uploaded\\media_1788677962086.png';
const dest = path.join(__dirname, 'public', 'emblem.png');

try {
  fs.copyFileSync(src, dest);
  console.log('SUCCESS: Copied exact image to ' + dest);
} catch (err) {
  console.error('ERROR:', err);
}
