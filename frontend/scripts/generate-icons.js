const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 calculation table for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPNG(size) {
  const width = size;
  const height = size;

  // IHDR: width(4), height(4), bitDepth(1), colorType(1 = RGBA: 6), compression(1), filter(1), interlace(1)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // 8 bits per channel
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // default compression
  ihdr[11] = 0; // default filter
  ihdr[12] = 0; // no interlace

  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  // Draw black background with orange 'LVX' cross emblem / typography
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      // Distance from center
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Check if inside inner emblem 'L' / graphic
      const isInnerL = (nx > -0.45 && nx < -0.25 && ny > -0.5 && ny < 0.5) ||
                       (nx >= -0.25 && nx < 0.35 && ny > 0.3 && ny < 0.5);

      const isInnerV = (Math.abs(nx - (ny * 0.4)) < 0.08 && ny > -0.3 && ny < 0.3) ||
                       (Math.abs(nx + (ny * 0.4)) < 0.08 && ny > -0.3 && ny < 0.3);

      const isBorder = Math.abs(nx) > 0.92 || Math.abs(ny) > 0.92;

      let r = 10, g = 10, b = 10, a = 255; // Dark premium background

      if (isBorder) {
        // Orange neon border
        r = 255; g = 84; b = 0;
      } else if (isInnerL || isInnerV || (Math.abs(nx) < 0.05 && Math.abs(ny) < 0.5)) {
        // High-contrast pure white / vibrant orange
        r = 255; g = 84; b = 0;
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const idat = zlib.deflateSync(rawData);

  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', idat);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPNG(512));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180));
console.log('PWA icons created successfully in public/icons/');
