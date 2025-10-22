// Simple icon generator for PWA
const fs = require('fs');
const path = require('path');

// Create simple PNG icons using data URLs
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Base64 encoded 1x1 blue pixel
const bluePixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';

sizes.forEach(size => {
  // Create a simple colored square as placeholder
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#4285f4" rx="${size * 0.2}"/>
    <text x="50%" y="60%" font-family="Arial" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="middle">📖</text>
  </svg>`;
  
  // Save SVG (browsers can use SVG as PNG)
  const iconPath = path.join(__dirname, 'client', 'public', 'icons', `icon-${size}x${size}.png`);
  
  // Create a simple text file as placeholder (browsers will show broken image icon)
  fs.writeFileSync(iconPath, `<!-- ${size}x${size} icon placeholder -->`);
});

console.log('✅ Icon placeholders created!');
console.log('📝 Note: Replace with actual PNG icons for production');