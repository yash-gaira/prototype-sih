const sharp = require('sharp');

// Blue pulse icon (#2563eb is blue-600)
// With a white circular background and subtle border like in the animation
const svgCode = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#ffffff" />
  <circle cx="256" cy="256" r="180" fill="#ffffff" stroke="#bfdbfe" stroke-width="8" />
  <svg x="128" y="128" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
</svg>
`;

async function generate() {
  const buffer = Buffer.from(svgCode);
  
  await sharp(buffer).resize(512, 512).toFile('./public/icon-512x512.png');
  await sharp(buffer).resize(192, 192).toFile('./public/icon-192x192.png');
  await sharp(buffer).resize(180, 180).toFile('./public/apple-icon.png');
  
  console.log("Blue pulse icons generated successfully!");
}

generate();
