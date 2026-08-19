// Layout QA: extracts positioned text items and flags any that fall outside
// the intended content frame (excluding the footer band and full-bleed covers).
// Usage: node layout-qa.js [pdfPath]
const path = require('path');
const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const PDF_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'ab-fabia-company-profile-print.pdf');

const MX = 54, RIGHT = 595.28 - 54, FOOTER_TOP = 795;   // footer band starts ~795
const FOOTER_TEXTS = [
  'AB-FABIA SERVICE LIMITED', 'Precision. Procurement. Performance.'
];

(async () => {
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, disableFontFace: true }).promise;
  const problems = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const tc = await page.getTextContent();
    const items = tc.items.filter(i => i.str && i.str.trim());
    // page number: shortest numeric item near bottom right
    for (const it of items) {
      const [a, b, c, d, e, f] = it.transform;
      const x = e, yTop = f, yBot = f - it.height;
      const x2 = x + it.width;
      const isFooter = yBot >= FOOTER_TOP;
      const str = it.str.trim();
      if (/^\d{2}$/.test(str) && yBot >= FOOTER_TOP - 4) continue;  // page number
      if (n === 1) continue; // cover: intentional full-page composition
      if (x < MX - 1.5) problems.push(`p${n} LEFT   ${JSON.stringify(str).slice(0, 40)} x=${x.toFixed(1)}`);
      if (!isFooter && x2 > RIGHT + 1.5) problems.push(`p${n} RIGHT  ${JSON.stringify(str).slice(0, 40)} x2=${x2.toFixed(1)}`);
      if (!isFooter && yBot > FOOTER_TOP + 2) problems.push(`p${n} BOTTOM ${JSON.stringify(str).slice(0, 40)} yBot=${yBot.toFixed(1)}`);
      if (yTop > 841.89 - 6) problems.push(`p${n} TOP    ${JSON.stringify(str).slice(0, 40)} yTop=${yTop.toFixed(1)}`);
    }
    // per-page lowest content (non-footer) text for density check
    let maxBot = 0;
    for (const it of items) {
      const yBot = it.transform[5] - it.height;
      if (yBot < FOOTER_TOP - 4) maxBot = Math.max(maxBot, yBot);
    }
    console.log(`page ${String(n).padStart(2, '0')}: lowest content text y=${maxBot.toFixed(0)} (frame ends 792)`);
  }
  console.log('---');
  if (problems.length) {
    console.log('PROBLEMS:');
    problems.forEach(p => console.log(' ', p));
    process.exit(1);
  }
  console.log('LAYOUT OK — no text outside the content frame');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
