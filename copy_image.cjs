const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\srije\\.gemini\\antigravity-ide\\brain\\0bc29fe8-d801-4e4a-9395-600fc557dc31\\jharkhand_mining_clean_1789053510566.jpg';
const dest = 'g:\\SIH\\zencoders-prob43-sih26\\src\\assets\\auth-bg\\jharkhand-mining.jpg';

fs.copyFileSync(src, dest);
console.log('Successfully replaced jharkhand-mining.jpg with the clean version!');
