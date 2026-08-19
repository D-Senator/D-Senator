// Shared design system for AB - FABIA brand documents.
const path = require('path');

const FONTS = path.join(__dirname, '..', 'assets', 'fonts');

// ---------------------------------------------------------------- palette
const C = {
  navy: '#0B1F3A',
  navyDeep: '#071727',
  steel: '#6B7A8D',
  steelLight: '#E8ECF1',
  amber: '#F5A623',
  amberTint: '#FBF0DE',
  white: '#FFFFFF',
  offwhite: '#F6F8FA',
  ink: '#202A35',
  body: '#3B4652',
  subtle: '#5A6B7C',
  line: '#DCE3EA'
};

// ---------------------------------------------------------------- fonts
const FONT_MAP = {
  Inter: 'Inter-Regular.ttf',
  InterRegular: 'Inter-Regular.ttf',
  InterMedium: 'Inter-Medium.ttf',
  InterSemiBold: 'Inter-SemiBold.ttf',
  InterBold: 'Inter-Bold.ttf',
  ArchivoMedium: 'Archivo-Medium.ttf',
  ArchivoSemiBold: 'Archivo-SemiBold.ttf',
  ArchivoBold: 'Archivo-Bold.ttf',
  ArchivoExtraBold: 'Archivo-ExtraBold.ttf',
  ArchivoBlack: 'Archivo-Black.ttf'
};

function registerFonts(doc) {
  for (const [name, file] of Object.entries(FONT_MAP)) {
    doc.registerFont(name, path.join(FONTS, file));
  }
}

// ---------------------------------------------------------------- page
const A4 = { width: 595.28, height: 841.89 };
const MX = 50;                    // side margin
const CW = A4.width - MX * 2;     // content width

let pageCount = 0;
function getPage() { return pageCount; }

function newPage(doc, { bg } = {}) {
  if (pageCount === 0) {
    // pdfkit creates the first page implicitly; drawing an explicit addPage()
    // here would leave a blank page 1. So on the very first page we just draw.
  } else {
    doc.addPage({ size: 'A4', margin: 0 });
  }
  pageCount += 1;
  if (bg) {
    doc.rect(0, 0, A4.width, A4.height).fill(bg);
  }
  return pageCount;
}

// ---------------------------------------------------------------- logo (vector)
// Concept B: two ascending chevron beams in safety amber, above the wordmark.
function logoMark(doc, cx, topY, scale, color) {
  const s = scale;
  const sw = 15 * s;
  doc.save()
    .lineWidth(sw).lineCap('butt').lineJoin('miter').strokeColor(color)
    // lower chevron
    .moveTo(cx - 22 * s, topY + 30 * s)
    .lineTo(cx, topY + 2 * s)
    .lineTo(cx + 22 * s, topY + 30 * s)
    // upper (ascending) chevron
    .moveTo(cx - 16 * s, topY + 8 * s)
    .lineTo(cx, topY - 20 * s)
    .lineTo(cx + 16 * s, topY + 8 * s)
    .stroke()
    .restore();
}

function logoStacked(doc, cx, topY, scale, onDark) {
  const s = scale;
  const navy = onDark ? C.white : C.navy;
  const sub = onDark ? '#9FB0C2' : C.steel;

  logoMark(doc, cx, topY, s, C.amber);

  const wordSize = 44 * s;
  doc.font('ArchivoExtraBold').fontSize(wordSize).fillColor(navy);
  const wordW = doc.widthOfString('AB - FABIA');
  doc.text('AB - FABIA', cx - wordW / 2, topY + 74 * s, { lineBreak: false });

  doc.font('InterSemiBold').fontSize(14 * s).fillColor(sub);
  doc.text('SERVICE LIMITED', cx - 200 * s, topY + 116 * s, {
    lineBreak: false,
    width: 400 * s,
    align: 'center',
    characterSpacing: 5 * s
  });
  return topY + 116 * s + 18 * s; // bottom
}

// Horizontal lockup for page headers: small amber chevrons + wordmark inline.
function logoHorizontal(doc, x, y, scale, onDark) {
  const s = scale;
  const navy = onDark ? C.white : C.navy;
  const markX = x + 8 * s, markTop = y + 2 * s;
  const sw = 6 * s;
  doc.save()
    .lineWidth(sw).lineCap('butt').lineJoin('miter').strokeColor(C.amber)
    .moveTo(markX - 8 * s, markTop + 8 * s).lineTo(markX, markTop).lineTo(markX + 8 * s, markTop + 8 * s)
    .moveTo(markX - 5.5 * s, markTop - 1 * s).lineTo(markX, markTop - 9 * s).lineTo(markX + 5.5 * s, markTop - 1 * s)
    .stroke()
    .restore();

  doc.font('ArchivoBold').fontSize(13 * s).fillColor(navy);
  doc.text('AB - FABIA', x + 22 * s, y - 2 * s, { lineBreak: false });
  doc.font('InterMedium').fontSize(7.5 * s).fillColor(onDark ? '#9FB0C2' : C.steel);
  doc.text('SERVICE LIMITED', x + 22 * s, y + 12 * s, {
    lineBreak: false,
    characterSpacing: 1.6 * s
  });
  return x + 22 * s + doc.widthOfString('AB - FABIA');
}

// ---------------------------------------------------------------- header / footer
function header(doc, sectionLabel, page) {
  const y = 34;
  logoHorizontal(doc, MX, y, 1, false);
  doc.font('InterSemiBold').fontSize(8.5).fillColor(C.steel);
  const w = doc.widthOfString(sectionLabel);
  doc.text(sectionLabel.toUpperCase(), A4.width - MX - w, y + 2, {
    lineBreak: false,
    characterSpacing: 1.6
  });
  doc.save().moveTo(MX, 64).lineTo(A4.width - MX, 64)
    .lineWidth(1).strokeColor(C.line).stroke().restore();
}

function footer(doc, page) {
  const y = A4.height - 40;
  doc.save().moveTo(MX, y).lineTo(A4.width - MX, y)
    .lineWidth(1).strokeColor(C.line).stroke().restore();
  doc.font('InterMedium').fontSize(7.5).fillColor(C.subtle);
  doc.text('AB - FABIA SERVICE LIMITED', MX, y + 8, { lineBreak: false });
  doc.text('Precision. Procurement. Performance.', A4.width - MX - 200, y + 8, {
    lineBreak: false, width: 200, align: 'right'
  });
  doc.font('InterSemiBold').fontSize(9).fillColor(C.navy);
  doc.text(String(page).padStart(2, '0'), A4.width - MX - 24, y - 13, {
    lineBreak: false, width: 24, align: 'right'
  });
  // amber tick next to page number
  doc.save().rect(A4.width - MX - 30, y - 11, 3, 8).fill(C.amber).restore();
}

// ---------------------------------------------------------------- section divider
function sectionDivider(doc, number, title, lede) {
  newPage(doc, { bg: C.navy });
  // subtle ascending chevrons watermark (right side)
  doc.save();
  doc.lineCap('butt').lineJoin('miter');
  const baseX = A4.width - 110, baseY = 430;
  const beams = [
    { off: 0, w: 340, s: 60, c: 'rgba(255,255,255,0.05)' },
    { off: 120, w: 250, s: 44, c: 'rgba(255,255,255,0.07)' },
    { off: 210, w: 170, s: 30, c: 'rgba(245,166,35,0.16)' }
  ];
  for (const b of beams) {
    doc.lineWidth(b.s).strokeColor(b.c)
      .moveTo(baseX - b.w / 2, baseY - b.off)
      .lineTo(baseX, baseY - b.off - b.w / 2)
      .lineTo(baseX + b.w / 2, baseY - b.off)
      .stroke();
  }
  doc.restore();

  // amber bar
  doc.rect(MX, 150, 64, 6).fill(C.amber);
  // number
  doc.font('ArchivoBlack').fontSize(150).fillColor('rgba(255,255,255,0.12)');
  doc.text(number, MX - 8, 176, { lineBreak: false });
  // title — size auto-fitted to a single line
  let titleSize = 52;
  doc.font('ArchivoExtraBold').fontSize(titleSize);
  while (doc.widthOfString(title) > CW && titleSize > 30) {
    titleSize -= 2;
    doc.font('ArchivoExtraBold').fontSize(titleSize);
  }
  doc.fillColor(C.white);
  doc.text(title, MX, 336, { width: CW, lineBreak: false });
  // lede
  if (lede) {
    doc.font('InterRegular').fontSize(11.5).fillColor('#B9C6D4');
    doc.text(lede, MX, 430, { width: 400, lineBreak: true, lineGap: 6 });
  }
  // tagline bottom-left
  doc.font('InterSemiBold').fontSize(8).fillColor('#7E8FA3');
  doc.text('AB - FABIA SERVICE LIMITED  /  PRECISION. PROCUREMENT. PERFORMANCE.',
    MX, A4.height - 70, { lineBreak: false, characterSpacing: 1.4 });
}

module.exports = {
  C, FONT_MAP, FONTS, A4, MX, CW, getPage,
  registerFonts, newPage, logoStacked, logoHorizontal, header, footer, sectionDivider
};
