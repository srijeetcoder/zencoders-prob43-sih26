const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  const landingSampleAssets = path.join(__dirname, 'src', 'landing page', 'public', 'sample-assets');
  const targetPublicSampleAssets = path.join(__dirname, 'public', 'sample-assets');
  if (fs.existsSync(landingSampleAssets)) {
    copyDir(landingSampleAssets, targetPublicSampleAssets);
    console.log('Copied landing sample assets to public/sample-assets');
  }

  const srcAssets = path.join(__dirname, 'src', 'assets');
  if (!fs.existsSync(srcAssets)) {
    fs.mkdirSync(srcAssets, { recursive: true });
  }
  const ssPng = path.join(__dirname, 'src', 'components', 'assets', 'ss.png');
  if (fs.existsSync(ssPng)) {
    fs.copyFileSync(ssPng, path.join(srcAssets, 'ss.png'));
    console.log('Copied ss.png to src/assets/ss.png');
  }
} catch (err) {
  console.error('Error during asset copy:', err);
}
