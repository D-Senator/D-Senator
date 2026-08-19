// Builds brand/ab-fabia-brand-board.pdf — one-page visual identity summary.
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const D = require('./design');

const OUT = path.join(__dirname, '..', '..', 'brand', 'ab-fabia-brand-board.pdf');

const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: 'AB - FABIA Brand Board' } });
doc.pipe(fs.createWriteStream(OUT));
D.registerFonts(doc);

const { C, A4, MX, CW } = D;
const cx = A4.width / 2;

// ---- header band
doc.rect(0, 0, A4.width, 90).fill(C.navy);
doc.font('ArchivoExtraBold').fontSize(15).fillColor(C.white);
doc.text('BRAND BOARD', MX, 34, { lineBreak: false, characterSpacing: 2 });
doc.font('InterMedium').fontSize(9).fillColor('#9FB0C2');
doc.text('AB - FABIA SERVICE LIMITED  ·  COMPANY IDENTITY  ·  V1.0', MX, 55, { lineBreak: false });

// ---- logo
D.logoStacked(doc, cx, 132, 1.15, false);

// ---- tagline strip
const tlY = 358;
doc.font('InterSemiBold').fontSize(13).fillColor(C.navy);
const tl = 'PRECISION. PROCUREMENT. PERFORMANCE.';
doc.text(tl, cx - CW / 2, tlY, { width: CW, align: 'center', lineBreak: false, characterSpacing: 2 });
doc.save().moveTo(cx - 80, tlY - 12).lineTo(cx + 80, tlY - 12)
  .lineWidth(2).strokeColor(C.amber).stroke().restore();

// ---- color palette
const palY = 402;
doc.font('ArchivoSemiBold').fontSize(11).fillColor(C.navy);
doc.text('COLOR SYSTEM', MX, palY, { lineBreak: false });
const swatches = [
  { n: 'NAVY', h: '#0B1F3A', c: C.navy, light: true },
  { n: 'NAVY DEEP', h: '#071727', c: C.navyDeep, light: true },
  { n: 'AMBER', h: '#F5A623', c: C.amber, light: true },
  { n: 'STEEL', h: '#6B7A8D', c: C.steel, light: true },
  { n: 'AMBER TINT', h: '#FBF0DE', c: C.amberTint, light: false },
  { n: 'LIGHT STEEL', h: '#E8ECF1', c: C.steelLight, light: false },
  { n: 'OFF WHITE', h: '#F6F8FA', c: C.offwhite, light: false },
  { n: 'WHITE', h: '#FFFFFF', c: C.white, light: false }
];
const sw = 110, sh = 62, gap = 15;
swatches.forEach((s, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = MX + col * (sw + gap), y = palY + 22 + row * (sh + 40);
  doc.rect(x, y, sw, sh).fill(s.c);
  if (!s.light) doc.rect(x, y, sw, sh).stroke(C.line);
  doc.font('InterSemiBold').fontSize(7.5).fillColor(C.ink);
  doc.text(s.n, x, y + sh + 8, { lineBreak: false });
  doc.font('InterRegular').fontSize(7.5).fillColor(C.subtle);
  doc.text(s.h, x, y + sh + 20, { lineBreak: false });
});

// ---- typography
const typY = 560;
doc.font('ArchivoSemiBold').fontSize(11).fillColor(C.navy);
doc.text('TYPOGRAPHY', MX, typY, { lineBreak: false });

// display sample
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Aa Bb Cc 0123456789', MX, typY + 26, { lineBreak: false });
doc.font('ArchivoSemiBold').fontSize(9).fillColor(C.subtle);
doc.text('ARCHIVO — DISPLAY / HEADINGS', MX, typY + 62, { lineBreak: false, characterSpacing: 1 });

// body sample
doc.font('InterRegular').fontSize(11.5).fillColor(C.body);
doc.text('Inter is used for body copy: clean, legible and modern. Engineering confidence, stated simply.',
  MX, typY + 92, { width: 300, lineGap: 4 });
doc.font('ArchivoSemiBold').fontSize(9).fillColor(C.subtle);
doc.text('INTER — BODY / CAPTIONS / DATA', MX, typY + 148, { lineBreak: false, characterSpacing: 1 });

// ---- usage note
doc.font('InterMedium').fontSize(8.5).fillColor(C.subtle);
doc.text('Clear space: keep an area equal to the chevron height around the logo. ' +
  'Primary backgrounds: White, Off White, Navy. The amber beam always remains amber.',
  MX, typY + 180, { width: CW, lineGap: 4 });

doc.end();
console.log('Brand board written:', OUT);
