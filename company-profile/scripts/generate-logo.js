// Generates a high-resolution PNG logo for AB - FABIA Service Limited.
// Matches the vector master in brand/logo/ab-fabia-logo.svg (Concept B).
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const FONTS = path.join(__dirname, '..', 'assets', 'fonts');
const OUT = path.join(__dirname, '..', '..', 'brand', 'logo', 'ab-fabia-logo.png');

GlobalFonts.registerFromPath(path.join(FONTS, 'Archivo-ExtraBold.ttf'), 'ArchivoExtraBold');
GlobalFonts.registerFromPath(path.join(FONTS, 'Inter-SemiBold.ttf'), 'InterSemiBold');

const NAVY = '#0B1F3A';
const STEEL = '#6B7A8D';
const AMBER = '#F5A623';

const SCALE = 3;

// logical layout constants (design space)
const WORD_SIZE = 44;
const SUB_SIZE = 14;
const SUB_TRACK = 5;
const WORD_Y = 140;   // baseline
const SUB_Y = 182;    // baseline

function measureWord(ctx) {
  ctx.font = `${WORD_SIZE}px ArchivoExtraBold`;
  const wordW = ctx.measureText('AB - FABIA').width;
  ctx.font = `${SUB_SIZE}px InterSemiBold`;
  const chars = [...'SERVICE LIMITED'];
  let subW = 0;
  for (const ch of chars) subW += ctx.measureText(ch).width;
  subW += SUB_TRACK * (chars.length - 1);
  return { wordW, subW };
}

const probe = createCanvas(10, 10).getContext('2d');
const { wordW, subW } = measureWord(probe);

const contentW = Math.max(wordW, subW, 44); // 44 = chevron mark width
const padX = 44;
const W = Math.ceil((contentW + padX * 2) * SCALE);
const H = 220 * SCALE;
const cx = W / (2 * SCALE);

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, W, H);

ctx.scale(SCALE, SCALE);

// --- mark: two ascending chevrons (both amber) ---
function chevron(a, b, c) {
  ctx.lineWidth = 15;
  ctx.strokeStyle = AMBER;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  ctx.moveTo(cx - (130 - a[0]), a[1]);
  ctx.lineTo(cx - (130 - b[0]), b[1]);
  ctx.lineTo(cx - (130 - c[0]), c[1]);
  ctx.stroke();
}
chevron([108, 96], [130, 66], [152, 96]); // lower
chevron([114, 76], [130, 46], [146, 76]); // upper

// --- wordmark ---
ctx.fillStyle = NAVY;
ctx.font = `${WORD_SIZE}px ArchivoExtraBold`;
const ww = ctx.measureText('AB - FABIA').width;
ctx.fillText('AB - FABIA', cx - ww / 2, WORD_Y);

// --- subtitle (letter-spaced) ---
ctx.fillStyle = STEEL;
ctx.font = `${SUB_SIZE}px InterSemiBold`;
const chars = [...'SERVICE LIMITED'];
let x = cx - subW / 2;
for (const ch of chars) {
  ctx.fillText(ch, x, SUB_Y);
  x += ctx.measureText(ch).width + SUB_TRACK;
}

require('fs').writeFileSync(OUT, canvas.toBuffer('image/png'));
console.log(`Logo PNG written: ${OUT}`);
console.log(`Canvas: ${W} x ${H} px | wordW=${wordW.toFixed(1)} | subW=${subW.toFixed(1)}`);
