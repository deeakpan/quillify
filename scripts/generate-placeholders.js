const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate 8 placeholder images
for (let i = 1; i <= 8; i++) {
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <rect x="20" y="20" width="260" height="360" fill="#d4af37" rx="5"/>
      <text x="150" y="200" font-family="Arial" font-size="24" fill="black" text-anchor="middle">
        Book ${i}
      </text>
    </svg>
  `;

  fs.writeFileSync(path.join(publicDir, `book${i}.svg`), svg);
}

console.log('Generated placeholder book covers in public directory'); 