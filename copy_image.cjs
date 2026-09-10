const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\srije\\.gemini\\antigravity-ide\\brain\\c8a70e01-f5d8-478b-9ea5-0930f9d845bf\\.user_uploaded\\media_1789055673816.jpg';
const dest = path.join(__dirname, 'src', 'assets', 'auth-bg', 'jharkhand-machinery.jpg');

fs.copyFileSync(src, dest);
console.log('Successfully copied machinery image to src/assets/auth-bg/jharkhand-machinery.jpg!');
