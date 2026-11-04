const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 calculation table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generateResellHubIconPNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  
  // Uncompressed raw scanlines: height rows, each: 1 byte filter (0) + width * 4 RGBA bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 512;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Squircle / rounded rect boundary if not maskable
      let a = 255;
      if (!isMaskable) {
        const cornerR = width * 0.23;
        const inCornerX = x < cornerR ? cornerR - x : x > width - cornerR ? x - (width - cornerR) : 0;
        const inCornerY = y < cornerR ? cornerR - y : y > height - cornerR ? y - (height - cornerR) : 0;
        if (inCornerX > 0 && inCornerY > 0) {
          const cornerDist = Math.sqrt(inCornerX * inCornerX + inCornerY * inCornerY);
          if (cornerDist > cornerR) {
            a = 0;
          } else if (cornerDist > cornerR - 1) {
            a = Math.round((cornerR - cornerDist) * 255);
          }
        }
      }

      if (a === 0) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Base Background Gradient (Deep Emerald -> Teal -> Ocean Sky)
      const gradRatio = (x * 0.85 + y * 1.15) / (width * 2);
      let r = Math.round(6 + gradRatio * (3 - 6));
      let g = Math.round(78 + gradRatio * (118 - 78));
      let b = Math.round(59 + gradRatio * (161 - 59));

      // Circular Resell Ring Arc check
      const dx = x - cx;
      const dy = y - cy;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const ringRadius = 192 * scale;
      const ringThickness = 24 * scale;

      const isRing = Math.abs(distFromCenter - ringRadius) <= ringThickness / 2;
      const angle = Math.atan2(dy, dx); // -PI to PI
      const isTopRightArc = isRing && (angle > -Math.PI * 0.52 && angle < Math.PI * 0.04);
      const isBottomLeftArc = isRing && (angle > Math.PI * 0.48 && angle < Math.PI * 1.04);

      // Geometric 'R' coordinates
      const rx1 = (156 - 256) * scale + cx;
      const rx2 = (208 - 256) * scale + cx;
      const ry1 = (128 - 256) * scale + cy;
      const ry2 = (384 - 256) * scale + cy;

      // Stem of 'R'
      const isStem = x >= rx1 && x <= rx2 && y >= ry1 && y <= ry2;

      // Top loop of 'R' (outer semicircle / rect)
      const loopCenterY = (206 - 256) * scale + cy;
      const loopOuterR = 78 * scale;
      const loopInnerR = 34 * scale;
      const loopStartX = rx2 - 2 * scale;
      
      const inLoopBox = x >= rx2 && y >= (128 - 256) * scale + cy && y <= (284 - 256) * scale + cy;
      const loopDist = Math.sqrt((x - loopStartX) * (x - loopStartX) + (y - loopCenterY) * (y - loopCenterY));
      const isOuterLoop = inLoopBox && (x <= loopStartX || loopDist <= loopOuterR);
      const isInnerCutout = inLoopBox && (x >= rx2 && (x <= loopStartX ? Math.abs(y - loopCenterY) <= loopInnerR : loopDist <= loopInnerR));
      const isLoop = isOuterLoop && !isInnerCutout;

      // Diagonal Leg of 'R'
      const legStartY = (250 - 256) * scale + cy;
      const legEndY = (376 - 256) * scale + cy;
      const legStartX = (260 - 256) * scale + cx;
      const legEndX = (374 - 256) * scale + cx;
      
      let isLeg = false;
      if (y >= legStartY && y <= legEndY) {
        const t = (y - legStartY) / (legEndY - legStartY);
        const legCenter = legStartX + t * (legEndX - legStartX);
        const legWidth = 32 * scale;
        if (Math.abs(x - legCenter) <= legWidth / 2) {
          isLeg = true;
        }
      }

      // Gold Kazakh Accent Sun Dot (top right of R)
      const dotX = (374 - 256) * scale + cx;
      const dotY = (128 - 256) * scale + cy;
      const dotDist = Math.sqrt((x - dotX) * (x - dotX) + (y - dotY) * (y - dotY));
      const isGoldDot = dotDist <= 20 * scale;

      // Color assignment
      if (isGoldDot) {
        r = 251; g = 191; b = 36; // Amber gold
        if (dotDist <= 8 * scale) {
          r = 254; g = 240; b = 138; // Light inner gold shine
        }
      } else if (isStem || isLoop || isLeg) {
        r = 255; g = 255; b = 255; // Brilliant crisp white R
      } else if (isTopRightArc) {
        r = 103; g = 232; b = 249; // Vivid cyan loop
      } else if (isBottomLeftArc) {
        r = 52; g = 211; b = 153; // Fresh emerald loop
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Header chunk (IHDR)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG icons for the ResellHub App Badge
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateResellHubIconPNG(180, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateResellHubIconPNG(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateResellHubIconPNG(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateResellHubIconPNG(512, true));
fs.writeFileSync(path.join(publicDir, 'favicon-64x64.png'), generateResellHubIconPNG(64, false));
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), generateResellHubIconPNG(32, false));

console.log('Successfully generated all official ResellHub badge icons in /public:');
console.log('- apple-touch-icon.png (180x180)');
console.log('- pwa-192x192.png (192x192)');
console.log('- pwa-512x512.png (512x512)');
console.log('- pwa-maskable-512x512.png (512x512 maskable)');
console.log('- favicon-64x64.png (64x64)');
console.log('- favicon-32x32.png (32x32)');
