// Builds ab-fabia-company-profile-print.pdf — Master Build v1.0 (17 pages, A4).
// All content derives from content/master-content.js (single source of truth).
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const D = require('./design');
const M = require('../content/master-content');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile-print.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title: 'AB-FABIA Service Limited — Corporate Profile v1.0',
    Author: 'AB-FABIA Service Limited',
    Subject: 'Integrated EPC & Energy Services — Corporate Capability Profile'
  }
});
doc.pipe(fs.createWriteStream(OUT));
D.registerFonts(doc);

const { C, A4 } = D;
const MX = 54;                        // 19mm side margins (spec: 18–22mm)
const CW = A4.width - MX * 2;
const cx = A4.width / 2;

// ---------------------------------------------------------------- helpers
function para(text, x, y, w, o = {}) {
  const { font = 'InterRegular', size = 10, color = C.body, lineGap = 4.5,
    align = 'left', ellipsis = false } = o;
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(text, x, y, { width: w, align, lineGap, lineBreak: true, ellipsis });
  return y + doc.heightOfString(text, { width: w, align, lineGap });
}

function h1(text, o = {}) {
  const y = o.y || 96;
  doc.font('ArchivoExtraBold').fontSize(o.size || 26).fillColor(o.color || C.navy);
  doc.text(text, MX, y, { width: CW, lineBreak: false });
  const wy = y + (o.size || 26) + 10;
  doc.save().moveTo(MX, wy).lineTo(MX + (o.barW || 52), wy)
    .lineWidth(4).strokeColor(C.amber).stroke().restore();
  return wy + 8;
}

function kicker(text, y, o = {}) {
  doc.font('InterSemiBold').fontSize(8).fillColor(o.color || C.steel);
  doc.text(text.toUpperCase(), MX, y, { lineBreak: false, characterSpacing: 2.4 });
}

function contentPage(sectionNum, sectionLabel) {
  D.newPage(doc);
  const p = D.getPage();
  // header
  D.logoHorizontal(doc, MX, 36, 0.92, false);
  const label = (sectionNum ? sectionNum + '  ·  ' : '') + sectionLabel.toUpperCase();
  doc.font('InterSemiBold').fontSize(8).fillColor(C.steel);
  doc.text(label, MX, 40, { width: CW, align: 'right', lineBreak: false, characterSpacing: 1.8 });
  doc.save().moveTo(MX, 64).lineTo(A4.width - MX, 64)
    .lineWidth(1).strokeColor(C.line).stroke().restore();
  // footer (auto page number)
  const fy = A4.height - 46;
  doc.save().moveTo(MX, fy).lineTo(A4.width - MX, fy)
    .lineWidth(1).strokeColor(C.line).stroke().restore();
  doc.font('InterMedium').fontSize(7.5).fillColor(C.subtle);
  doc.text('AB-FABIA SERVICE LIMITED', MX, fy + 8, { lineBreak: false });
  doc.text('Precision. Procurement. Performance.', MX, fy + 8, {
    width: CW, align: 'right', lineBreak: false
  });
  doc.save().rect(A4.width - MX - 34, fy + 6.5, 3, 9).fill(C.amber).restore();
  doc.font('ArchivoBold').fontSize(10).fillColor(C.navy);
  doc.text(String(p).padStart(2, '0'), A4.width - MX - 26, fy + 6, { lineBreak: false });
  return p;
}

function statementBand(y, text, o = {}) {
  const h = o.h || 44;
  doc.save().rect(MX, y, CW, h).fill(o.bg || C.navy).restore();
  doc.save().rect(MX, y, 5, h).fill(C.amber).restore();
  doc.font(o.font || 'ArchivoSemiBold').fontSize(o.size || 12).fillColor(o.color || C.white);
  doc.text(text, MX + 22, y + (h - doc.heightOfString(text, { width: CW - 44 })) / 2, {
    width: CW - 44, align: o.align || 'left', lineGap: 4
  });
  return y + h;
}

function chip(text, x, y, o = {}) {
  const padX = 9, h = o.h || 21;
  doc.font(o.font || 'InterSemiBold').fontSize(o.size || 8.5);
  const w = doc.widthOfString(text) + padX * 2;
  doc.save().roundedRect(x, y, w, h, 2).fill(o.bg || C.steelLight).restore();
  if (o.accent) doc.save().rect(x, y, 2.5, h).fill(C.amber).restore();
  doc.fillColor(o.color || C.navy).text(text, x + padX, y + (h - o.size - 2.5) / 2 + 1, { lineBreak: false });
  return w;
}

function chipRow(items, x, y, maxW, o = {}) {
  let cxp = x, cy = y;
  const rowH = (o.h || 21) + 7;
  for (const it of items) {
    doc.font(o.font || 'InterSemiBold').fontSize(o.size || 8.5);
    const w = doc.widthOfString(it) + 18;
    if (cxp + w > x + maxW) { cxp = x; cy += rowH; }
    chip(it, cxp, cy, o);
    cxp += w + 7;
  }
  return cy + (o.h || 21);
}

function bullet(text, x, y, w, o = {}) {
  doc.save().rect(x, y + 3.5, 5, 5).fill(o.marker || C.amber).restore();
  return para(text, x + 14, y, w - 14, { size: o.size || 9.5, color: o.color || C.body, font: o.font || 'InterRegular', lineGap: o.lineGap || 3 });
}

function chevronField(bx, by, beams, alpha) {
  doc.save().lineCap('butt').lineJoin('miter');
  for (const b of beams) {
    doc.lineWidth(b.s).strokeColor(b.c)
      .moveTo(bx - b.w / 2, by - b.o).lineTo(bx, by - b.o - b.w / 2)
      .lineTo(bx + b.w / 2, by - b.o).stroke();
  }
  doc.restore();
}

// ============================================================== PAGE 01 — COVER
D.newPage(doc, { bg: C.navyDeep });
chevronField(A4.width - 105, 430, [
  { o: 0, w: 360, s: 58, c: 'rgba(255,255,255,0.045)' },
  { o: 120, w: 265, s: 44, c: 'rgba(255,255,255,0.06)' },
  { o: 208, w: 180, s: 28, c: 'rgba(245,166,35,0.14)' }
]);
// faint engineering grid, left field
doc.save();
doc.lineWidth(0.5).strokeColor('rgba(255,255,255,0.05)');
for (let gx = -200; gx < 200; gx += 46) {
  doc.moveTo(gx, 0).lineTo(gx + 500, A4.height).stroke();
}
doc.restore();

D.logoStacked(doc, cx, 96, 1.42, true);

// amber accent beam
doc.save().rect(MX, 372, 150, 7).fill(C.amber).restore();

doc.font('ArchivoExtraBold').fontSize(37).fillColor(C.white);
doc.text('INTEGRATED EPC', MX, 402, { width: CW, align: 'center', lineBreak: false });
doc.text('& ENERGY SERVICES', MX, 446, { width: CW, align: 'center', lineBreak: false });

doc.font('InterMedium').fontSize(11.5).fillColor('#B9C6D4');
doc.text('Engineering • Procurement • Construction • Energy Services',
  MX, 512, { width: CW, align: 'center', lineBreak: false });

doc.save().moveTo(cx - 40, 552).lineTo(cx + 40, 552).lineWidth(1.5).strokeColor(C.amber).stroke().restore();

doc.font('InterSemiBold').fontSize(10.5).fillColor('#D7DFE8');
doc.text('Precision. Procurement. Performance.', MX, 572, { width: CW, align: 'center', lineBreak: false });

doc.font('InterSemiBold').fontSize(8.5).fillColor('#7E8FA3');
doc.text('EST. 2002', MX, 726, { width: CW, align: 'center', lineBreak: false, characterSpacing: 3 });
doc.font('InterRegular').fontSize(8.5).fillColor('#7E8FA3');
doc.text('PORT HARCOURT, RIVERS STATE, NIGERIA', MX, 744, { width: CW, align: 'center', lineBreak: false, characterSpacing: 3 });

// ============================================================== PAGE 02 — CONTENTS
contentPage(null, 'Contents');
h1('CONTENTS', { y: 92 });
kicker('CORPORATE CAPABILITY PROFILE  ·  VERSION 1.0', 150);

const colW = (CW - 40) / 2;
const rowH = 46;
M.contents.forEach((it, i) => {
  const col = i < 8 ? 0 : 1;
  const page = i + 3;                       // auto: cover=1, contents=2, sections start at 3
  const x = MX + col * (colW + 40);
  const y = 196 + (col === 0 ? i : i - 8) * rowH;
  doc.font('ArchivoBlack').fontSize(12).fillColor(C.amber);
  doc.text(it.num, x, y + 2, { lineBreak: false });
  doc.font('ArchivoSemiBold').fontSize(11.5).fillColor(C.navy);
  doc.text(it.label, x + 30, y, { width: colW - 64, lineBreak: true, lineGap: 2 });
  const lastW = doc.widthOfString(it.label.split(' ').pop());
  doc.font('InterRegular').fontSize(9.5).fillColor(C.steel);
  doc.text(String(page).padStart(2, '0'), x + colW - 20, y + 1, {
    width: 20, align: 'right', lineBreak: false
  });
  doc.save().moveTo(x + 30, y + 26).lineTo(x + colW, y + 26)
    .lineWidth(0.7).strokeColor(C.line).stroke().restore();
});

// ============================================================== PAGE 03 — WHO WE ARE
contentPage('01', 'Who We Are');
h1('WHO WE ARE', { y: 92 });
let y3 = para(M.whoWeAre.lead, MX, 158, CW - 60, { font: 'InterSemiBold', size: 12.5, color: C.navy, lineGap: 5.5 });
y3 = para(M.whoWeAre.body[0], MX, y3 + 12, CW - 60, { size: 10, lineGap: 5 });
y3 = para(M.whoWeAre.body[1], MX, y3 + 8, CW - 60, { size: 10, lineGap: 5 });

// principles row
let py = y3 + 14;
M.whoWeAre.principles.forEach((p, i) => {
  const labels = ['ONE ORGANIZATION', 'MULTIPLE TECHNICAL CAPABILITIES', 'INTEGRATED DELIVERY'];
  chip(labels[i], MX + (i === 0 ? 0 : 0), py, { accent: true, bg: C.amberTint, size: 8 });
});
{ // lay the three principle chips on one row
  let cxp = MX;
  const labels = ['ONE ORGANIZATION', 'MULTIPLE TECHNICAL CAPABILITIES', 'INTEGRATED DELIVERY'];
  labels.forEach(l => {
    doc.font('InterSemiBold').fontSize(8);
    const w = doc.widthOfString(l) + 18;
    chip(l, cxp, py, { accent: true, bg: C.amberTint, size: 8 });
    cxp += w + 8;
  });
}

// capability diagram
const dg = { top: py + 44, rootH: 40, branchTop: 0 };
doc.save().roundedRect(cx - 90, dg.top, 180, dg.rootH, 3).fill(C.navy).restore();
doc.font('ArchivoBold').fontSize(14).fillColor(C.white);
doc.text('AB-FABIA', cx - 90, dg.top + (dg.rootH - 16) / 2, { width: 180, align: 'center', lineBreak: false });

const bTop = dg.top + dg.rootH + 34;
const bw = 150, gap = (CW - 3 * bw) / 2;
// connectors
doc.save().strokeColor(C.steel).lineWidth(1);
doc.moveTo(cx, dg.top + dg.rootH).lineTo(cx, dg.top + dg.rootH + 16).stroke();
doc.moveTo(MX + gap + bw / 2, bTop - 18).lineTo(A4.width - MX - gap - bw / 2, bTop - 18).stroke();
[0, 1, 2].forEach(i => {
  const bxc = MX + gap + i * (bw + gap) + bw / 2;
  doc.moveTo(bxc, bTop - 18).lineTo(bxc, bTop - 2).stroke();
});
doc.restore();

M.whoWeAre.diagram.branches.forEach((b, i) => {
  const bx = MX + gap + i * (bw + gap);
  const nameH = 34;
  doc.save().roundedRect(bx, bTop, bw, nameH, 2).fill(C.steelLight).restore();
  doc.save().rect(bx, bTop, bw, 2.5).fill(C.amber).restore();
  doc.font('ArchivoBold').fontSize(b.name.length > 12 ? 9.5 : 11.5).fillColor(C.navy);
  doc.text(b.name, bx + 8, bTop + (nameH - 12) / 2, { width: bw - 16, align: 'center', lineGap: 2 });
  let iy = bTop + nameH + 12;
  b.items.forEach(itm => {
    doc.save().rect(bx + 4, iy + 3, 4, 4).fill(C.amber).restore();
    doc.font('InterMedium').fontSize(8.5).fillColor(C.body);
    doc.text(itm, bx + 14, iy, { width: bw - 16, lineBreak: false });
    iy += 14.5;
  });
});

statementBand(700, M.whoWeAre.bottomStatement, { align: 'center', h: 42, size: 11.5 });

// ============================================================== PAGE 04 — OUR STORY
contentPage('02', 'Our Story');
h1('OUR STORY', { y: 92 });
kicker('FROM SPECIALIST EXPERTISE TO INTEGRATED DELIVERY', 150);

{
  const colWt = (CW - 44) / 2;
  const rowHt = 158;
  M.story.milestones.forEach((ms, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MX + col * (colWt + 44);
    const yv = 196 + row * rowHt;
    // timeline spine in each column
    doc.save().moveTo(x + 5, yv - 6).lineTo(x + 5, yv + rowHt - 42)
      .lineWidth(1.2).strokeColor(C.steelLight).stroke().restore();
    doc.save().circle(x + 5, yv + 2, 4.5).fill(C.amber).restore();
    // fit phase/year heading to column width
    let psz = 15;
    doc.font('ArchivoBlack');
    while (psz > 8) {
      doc.fontSize(psz);
      if (doc.widthOfString(ms.year) <= colWt - 20) break;
      psz -= 0.5;
    }
    doc.fontSize(psz).fillColor(C.navy);
    doc.text(ms.year, x + 18, yv - 4, { lineBreak: false });
    // fit milestone label to column width (auto-shrink incl. letter-spacing)
    let lsz = 8;
    doc.font('InterSemiBold');
    const maxLw = colWt - 20;
    const spacedW = (s, sz) => doc.widthOfString(s, { size: sz }) + Math.max(0, s.length - 1) * 1;
    while (lsz > 5.5 && spacedW(ms.label, lsz) > maxLw) lsz -= 0.25;
    doc.fontSize(lsz).fillColor(C.steel);
    doc.text(ms.label, x + 18, yv + 16, { width: maxLw, lineBreak: false, characterSpacing: 1 });
    para(ms.text, x + 18, yv + 32, colWt - 18, { size: 9.5, lineGap: 4 });
  });
}

// ============================================================== PAGE 05 — OUR CAPABILITIES
contentPage('03', 'Our Capabilities');
h1('OUR CAPABILITIES', { y: 92 });
para(M.capabilities.intro, MX, 150, CW - 120, { size: 10, lineGap: 4.5, color: C.body });

{
  let by = 196;
  const bandH = 92;
  M.capabilities.families.forEach(f => {
    doc.save().roundedRect(MX, by, CW, bandH - 10, 3).fill(C.offwhite).restore();
    doc.save().rect(MX, by, 4, bandH - 10).fill(C.amber).restore();
    doc.font('ArchivoBlack').fontSize(16).fillColor(C.amber);
    doc.text(f.num, MX + 18, by + 12, { lineBreak: false });
    doc.font('ArchivoBold').fontSize(12).fillColor(C.navy);
    doc.text(f.name, MX + 52, by + 13, { lineBreak: false });
    doc.font('InterMedium').fontSize(8.5).fillColor(C.steel);
    doc.text(f.descriptor, A4.width - MX - 220, by + 15, { width: 210, align: 'right', lineBreak: false });
    // items as two inline columns of text
    const half = Math.ceil(f.items.length / 2);
    const colA = f.items.slice(0, half), colB = f.items.slice(half);
    const itemsLine = (arr, xo) => {
      let yy = by + 40;
      arr.forEach(itm => {
        doc.save().rect(MX + xo, yy + 2.5, 3.5, 3.5).fill(C.steel).restore();
        doc.font('InterRegular').fontSize(9).fillColor(C.body);
        doc.text(itm, MX + xo + 11, yy, { lineBreak: false });
        yy += 14;
      });
    };
    itemsLine(colA, 18);
    itemsLine(colB, 18 + (CW - 40) / 2);
    by += bandH;
  });
}

// ============================================================== PAGE 06 — ENERGY & OILFIELD SERVICES
contentPage('04', 'Energy & Oilfield Services');
h1('ENERGY & OILFIELD SERVICES', { y: 92, size: 23 });
para(M.energy.lead, MX, 146, CW - 80, { font: 'InterSemiBold', size: 11, color: C.navy, lineGap: 4.5 });

{
  const colWf = (CW - 24) / 2;
  const cardH = 88;
  const spots = [
    [MX, 204], [MX + colWf + 24, 204],
    [MX, 204 + cardH + 14], [MX + colWf + 24, 204 + cardH + 14],
    [MX, 204 + (cardH + 14) * 2]
  ];
  M.energy.subsections.forEach((s, i) => {
    const [x, yv] = spots[i];
    doc.save().roundedRect(x, yv, colWf, cardH, 3).fill(C.offwhite).restore();
    doc.save().rect(x, yv, colWf, 2.5).fill(C.amber).restore();
    doc.font('ArchivoSemiBold').fontSize(9.5).fillColor(C.navy);
    doc.text(s.name, x + 14, yv + 13, { width: colWf - 28, lineBreak: false });
    para(s.text, x + 14, yv + 32, colWf - 28, { size: 8.8, lineGap: 3.5 });
  });
  // facilities note fills slot 6
  {
    const [x, yv] = [MX + colWf + 24, 204 + (cardH + 14) * 2];
    doc.save().roundedRect(x, yv, colWf, cardH, 3).fill(C.navy).restore();
    doc.font('InterSemiBold').fontSize(7.5).fillColor('#9FB0C2');
    doc.text('SUPPORTING FACILITIES', x + 14, yv + 13, { lineBreak: false, characterSpacing: 1.5 });
    para(M.energy.facilitiesNote, x + 14, yv + 30, colWf - 28, { size: 8.6, color: '#C4CFDB', lineGap: 3.8 });
  }
}
statementBand(660, M.energy.bottomMessage, { align: 'center', h: 42, size: 11 });

// ============================================================== PAGE 07 — EPC
contentPage('05', 'Engineering, Procurement & Construction');
h1('ENGINEERING, PROCUREMENT & CONSTRUCTION', { y: 92, size: 21 });
para(M.epc.intro, MX, 146, CW - 60, { size: 10, lineGap: 4.5 });

{
  const colWg = (CW - 3 * 16) / 4;
  M.epc.columns.forEach((c, i) => {
    const x = MX + i * (colWg + 16);
    const yv = 216;
    doc.font('ArchivoBold').fontSize(10).fillColor(C.navy);
    doc.text(c.name, x, yv, { width: colWg, lineBreak: false });
    doc.save().moveTo(x, yv + 16).lineTo(x + 30, yv + 16).lineWidth(2.5).strokeColor(C.amber).stroke().restore();
    let iy = yv + 30;
    c.items.forEach(itm => {
      doc.save().rect(x, iy + 3, 4, 4).fill(C.amber).restore();
      doc.font('InterRegular').fontSize(9).fillColor(C.body);
      const lines = Math.max(1, Math.ceil(doc.widthOfString(itm) / (colWg - 13)));
      doc.text(itm, x + 12, iy, { width: colWg - 13, lineGap: 2 });
      iy += 13.5 * lines + 4;
    });
  });
}
statementBand(672, M.epc.keyMessage, { h: 52, size: 11 });

// ============================================================== PAGE 08 — CIVIL, INFRASTRUCTURE & MARINE
contentPage('06', 'Civil, Infrastructure & Marine');
h1('CIVIL, INFRASTRUCTURE & MARINE', { y: 92, size: 23 });
kicker('LAND-BASED, INDUSTRIAL AND MARINE ENVIRONMENTS', 148);

{
  const colWm = (CW - 24) / 2;
  M.civilMarine.groups.forEach((g, gi) => {
    const x = MX + gi * (colWm + 24);
    const yv = 196;
    const hgt = 400;
    doc.save().roundedRect(x, yv, colWm, hgt, 3).fill(gi === 0 ? C.offwhite : C.navy).restore();
    doc.save().rect(x, yv, colWm, 3).fill(C.amber).restore();
    doc.font('ArchivoBold').fontSize(12).fillColor(gi === 0 ? C.navy : C.white);
    doc.text(g.name, x + 18, yv + 20, { width: colWm - 36, lineBreak: false });
    // items in 2 sub-columns
    const half = Math.ceil(g.items.length / 2);
    const sub = [g.items.slice(0, half), g.items.slice(half)];
    sub.forEach((arr, sc) => {
      let iy = yv + 56;
      const xo = x + 18 + sc * (colWm - 36) / 2;
      arr.forEach(itm => {
        doc.save().rect(xo, iy + 3, 4, 4).fill(C.amber).restore();
        doc.font('InterRegular').fontSize(9.2).fillColor(gi === 0 ? C.body : '#C4CFDB');
        doc.text(itm, xo + 12, iy, { width: (colWm - 36) / 2 - 14, lineGap: 2.5 });
        iy += 22;
      });
    });
    // footer mark inside panel
    doc.font('InterSemiBold').fontSize(7).fillColor(gi === 0 ? C.steel : '#7E8FA3');
    const tag = gi === 0 ? 'CAPABILITY FAMILY 03' : 'CAPABILITY FAMILY 04';
    doc.text(tag, x + 18, yv + hgt - 24, { lineBreak: false, characterSpacing: 1.5 });
  });
}
statementBand(646, M.civilMarine.keyMessage, { h: 58, size: 10.5, font: 'InterSemiBold' });

// ============================================================== PAGE 09 — SURVEYING & GEOMATICS
contentPage('07', 'Surveying & Geomatics');
h1('SURVEYING & GEOMATICS', { y: 92 });
para(M.surveying.intro, MX, 150, CW - 70, { size: 10, lineGap: 4.5 });
chip('CURRENT ACTIVE SERVICE LINE', MX, 212, { accent: true, bg: C.amberTint, size: 8 });

{
  const colWs = (CW - 24) / 2;
  const panels = [
    { name: 'CAPABILITIES', items: M.surveying.capabilities, dark: true },
    { name: 'APPLICATIONS', items: M.surveying.applications, dark: false }
  ];
  panels.forEach((p, i) => {
    const x = MX + i * (colWs + 24);
    const yv = 252, hgt = 330;
    doc.save().roundedRect(x, yv, colWs, hgt, 3).fill(p.dark ? C.navy : C.offwhite).restore();
    doc.save().rect(x, yv, colWs, 2.5).fill(C.amber).restore();
    doc.font('ArchivoBold').fontSize(11.5).fillColor(p.dark ? C.white : C.navy);
    doc.text(p.name, x + 18, yv + 20, { lineBreak: false });
    let iy = yv + 54;
    p.items.forEach(itm => {
      doc.save().rect(x + 18, iy + 3.5, 4.5, 4.5).fill(C.amber).restore();
      doc.font('InterMedium').fontSize(9.5).fillColor(p.dark ? '#C4CFDB' : C.body);
      doc.text(itm, x + 32, iy, { lineBreak: false });
      iy += 30;
    });
  });
}
statementBand(614, 'Field information that connects planning, design and execution.', { h: 42, align: 'center', size: 11 });

// ============================================================== PAGE 10 — DRILLING FLUIDS & TECHNICAL PRODUCTS
contentPage('08', 'Drilling Fluids & Technical Products');
h1('DRILLING FLUIDS & TECHNICAL PRODUCTS', { y: 92, size: 21 });
para(M.drillingFluids.lead, MX, 146, CW - 70, { font: 'InterSemiBold', size: 11, color: C.navy, lineGap: 4.5 });
kicker('PRODUCT FAMILIES', 196);

chipRow(M.drillingFluids.families, MX, 216, CW, { h: 26, size: 9, bg: C.offwhite, accent: true });

// cross-reference band
{
  const yv = 360;
  doc.save().roundedRect(MX, yv, CW, 74, 3).fill(C.amberTint).restore();
  doc.save().rect(MX, yv, 4, 74).fill(C.amber).restore();
  doc.font('InterSemiBold').fontSize(7.5).fillColor('#8A5E14');
  doc.text('TECHNICAL DOCUMENTATION', MX + 22, yv + 14, { lineBreak: false, characterSpacing: 1.5 });
  para(M.drillingFluids.crossReference, MX + 22, yv + 30, CW - 44, { size: 9.5, color: '#6E4E16', lineGap: 4 });
}
// specialist strength framing
statementBand(660, 'Specialist strength within an integrated EPC and energy-services company.', { h: 46, align: 'center', size: 11 });

// ============================================================== PAGE 11 — HOW WE DELIVER
contentPage('09', 'How We Deliver');
h1('HOW WE DELIVER', { y: 92 });

{
  const x0 = MX + 8, y0 = 162, rowHl = 62;
  doc.save().moveTo(x0, y0 + 6).lineTo(x0, y0 + rowHl * 6 + 26)
    .lineWidth(2).strokeColor(C.amber).stroke().restore();
  M.delivery.steps.forEach((s, i) => {
    const yv = y0 + i * rowHl;
    doc.save().circle(x0, yv + 6, 8.5).fill(C.navy).restore();
    doc.save().circle(x0, yv + 6, 3.2).fill(C.amber).restore();
    doc.font('ArchivoBlack').fontSize(11).fillColor(C.amber);
    doc.text(s.num, x0 + 26, yv - 1, { lineBreak: false });
    doc.font('ArchivoBold').fontSize(12.5).fillColor(C.navy);
    doc.text(s.name, x0 + 52, yv - 2, { lineBreak: false, characterSpacing: 0.5 });
    para(s.text, x0 + 52, yv + 17, CW - 80, { size: 9.5, lineGap: 3 });
  });
}
statementBand(668, M.delivery.keyMessage, { h: 46, font: 'InterSemiBold', size: 10.5 });

// ============================================================== PAGE 12 — HSE, QUALITY & FIELD ASSURANCE
contentPage('10', 'HSE, Quality & Field Assurance');
h1('HSE, QUALITY & FIELD ASSURANCE', { y: 92, size: 22 });
para(M.hse.intro, MX, 148, CW - 70, { size: 10, lineGap: 4.5 });

{
  const colWh = (CW - 24) / 2;
  const panels = [
    { name: 'HSE', items: M.hse.hse, dark: false },
    { name: 'QUALITY', items: M.hse.quality, dark: false }
  ];
  panels.forEach((p, i) => {
    const x = MX + i * (colWh + 24);
    const yv = 200, hgt = 218;
    doc.save().roundedRect(x, yv, colWh, hgt, 3).fill(C.offwhite).restore();
    doc.save().rect(x, yv, 4, hgt).fill(i === 0 ? C.navy : C.amber).restore();
    doc.font('ArchivoBold').fontSize(12).fillColor(C.navy);
    doc.text(p.name, x + 20, yv + 16, { lineBreak: false });
    let iy = yv + 46;
    p.items.forEach(itm => {
      doc.save().rect(x + 20, iy + 3.5, 4, 4).fill(C.amber).restore();
      doc.font('InterRegular').fontSize(9.3).fillColor(C.body);
      doc.text(itm, x + 32, iy, { lineBreak: false });
      iy += 26;
    });
  });
}
// field assurance statement
{
  const yv = 442;
  doc.save().roundedRect(MX, yv, CW, 64, 3).fill(C.navyDeep).restore();
  doc.font('InterSemiBold').fontSize(7.5).fillColor('#9FB0C2');
  doc.text('FIELD ASSURANCE', MX + 22, yv + 13, { lineBreak: false, characterSpacing: 1.5 });
  doc.font('ArchivoSemiBold').fontSize(11.5).fillColor(C.white);
  doc.text('"' + M.hse.fieldAssurance + '"', MX + 22, yv + 30, { width: CW - 44, lineBreak: false });
}
// certification note
{
  const yv = 532;
  doc.font('InterSemiBold').fontSize(7.5).fillColor(C.steel);
  doc.text('CERTIFICATIONS & REGISTRATIONS', MX, yv, { lineBreak: false, characterSpacing: 1.5 });
  para(M.hse.certificationNote, MX, yv + 16, CW - 80, { size: 9.5, color: C.subtle, lineGap: 4 });
  para(
    'The company operates to defined internal standards for safety, quality and field ' +
    'verification, reinforced by continuous training and supervision on every engagement.',
    MX, yv + 48, CW - 80, { size: 9.5, color: C.subtle, lineGap: 4 });
}

// ============================================================== PAGE 13 — OUR PEOPLE
contentPage('11', 'Our People');
h1('OUR PEOPLE', { y: 92 });
kicker(M.people.principle.toUpperCase(), 148);
para(M.people.lead, MX, 166, CW - 70, { size: 9.5, lineGap: 4 });

{
  let ly = 216;
  const leadershipRows = M.people.leadership;
  leadershipRows.forEach(l => {
    const rowH = 58;
    doc.save().roundedRect(MX, ly, CW, rowH, 3).fill(C.offwhite).restore();
    doc.save().rect(MX + 12, ly + 11, 36, 36).fill(C.navy).restore();
    doc.font('ArchivoBold').fontSize(11).fillColor(C.white);
    doc.text(l.initials, MX + 12, ly + 22, { width: 36, align: 'center', lineBreak: false });
    doc.font('ArchivoSemiBold').fontSize(10.5).fillColor(C.navy);
    doc.text(l.name, MX + 60, ly + 11, { lineBreak: false });
    doc.font('InterSemiBold').fontSize(7.2).fillColor(C.steel);
    doc.text(l.role.toUpperCase(), MX + 60, ly + 26, { lineBreak: false, characterSpacing: 1.2 });
    para(l.summary, MX + 218, ly + 10, CW - 236, { size: 7.8, lineGap: 2.6, ellipsis: true });
    ly += rowH + 7;
  });
  const sy = ly + 8;
  doc.font('InterSemiBold').fontSize(7.5).fillColor(C.steel);
  doc.text('TECHNICAL & PROFESSIONAL STRENGTH', MX, sy, { lineBreak: false, characterSpacing: 1.5 });
  const strengthBottom = chipRow(M.people.strengths, MX, sy + 16, CW, { h: 19, size: 8, bg: C.steelLight });
  para(M.people.integrationNote, MX, strengthBottom + 10, CW - 60, { size: 8.5, color: C.subtle, lineGap: 3.5 });
}

// ============================================================== PAGE 14 — SELECTED DELIVERY EXPERIENCE
contentPage('12', 'Selected Delivery Experience');
h1('SELECTED DELIVERY EXPERIENCE', { y: 92, size: 23 });
para(M.experience.intro, MX, 148, CW - 60, { size: 9.5, lineGap: 4 });

{
  let yy = 190;
  for (const cat of M.experience.categories) {
    doc.font('ArchivoBlack').fontSize(10).fillColor(C.amber);
    doc.text(cat.key, MX, yy, { lineBreak: false });
    doc.font('ArchivoSemiBold').fontSize(9).fillColor(C.navy);
    doc.text(cat.name, MX + 16, yy + 1, { lineBreak: false, characterSpacing: 1 });
    doc.save().moveTo(MX + 16 + doc.widthOfString(cat.name) + 80, yy + 6)
      .lineTo(A4.width - MX, yy + 6).lineWidth(0.7).strokeColor(C.line).stroke().restore();
    yy += 16;
    for (const pr of cat.projects) {
      const meta = [pr.client, pr.relationship, pr.location, pr.period]
        .filter(Boolean).join('   ·   ');
      doc.font('ArchivoSemiBold').fontSize(10.5).fillColor(C.navy);
      doc.text(pr.name, MX + 16, yy + 4, { width: CW - 32, lineBreak: false });
      doc.font('InterMedium').fontSize(7.6).fillColor(C.steel);
      doc.text(meta.toUpperCase(), MX + 16, yy + 19, { width: CW - 32, lineBreak: false, characterSpacing: 0.5 });
      const scopeY = yy + 34;
      const scopeH = doc.heightOfString(pr.scope, { width: CW - 220, lineGap: 2.8 });
      doc.font('InterRegular').fontSize(8.2).fillColor(C.body);
      doc.text(pr.scope, MX + 16, scopeY, { width: CW - 220, lineGap: 2.8 });
      if (pr.outcome) {
        const ocX = A4.width - MX - 190;
        doc.save().rect(ocX, scopeY + 2, 3.5, 3.5).fill(C.amber).restore();
        doc.font('InterSemiBold').fontSize(7).fillColor(C.navy);
        doc.text('OUTCOME', ocX + 10, scopeY, { lineBreak: false, characterSpacing: 1 });
        doc.font('InterRegular').fontSize(8).fillColor(C.subtle);
        doc.text(pr.outcome, ocX + 10, scopeY + 12, { width: 180, lineGap: 2.8 });
      }
      const cardH = Math.max(scopeH, pr.outcome ? 34 : 0) + 46;
      yy += cardH;
      doc.save().moveTo(MX + 16, yy).lineTo(A4.width - MX, yy)
        .lineWidth(0.7).strokeColor(C.line).stroke().restore();
      yy += 12;
    }
    yy += 6;
  }
}

// ============================================================== PAGE 15 — CLIENTS & INDUSTRY RELATIONSHIPS
contentPage('13', 'Clients & Industry Relationships');
h1('CLIENTS & INDUSTRY RELATIONSHIPS', { y: 92, size: 22 });
para(M.clients.intro, MX, 148, CW - 70, { size: 10, lineGap: 4.5 });

{
  let yy = 200;
  for (const g of M.clients.groups) {
    doc.font('InterSemiBold').fontSize(7.5).fillColor(C.steel);
    doc.text(g.name, MX, yy, { lineBreak: false, characterSpacing: 1.8 });
    doc.save().moveTo(MX, yy + 13).lineTo(A4.width - MX, yy + 13)
      .lineWidth(1).strokeColor(C.line).stroke().restore();
    yy += 24;
    for (const it of g.items) {
      doc.save().rect(MX, yy + 4, 5, 5).fill(C.amber).restore();
      doc.font('ArchivoSemiBold').fontSize(11).fillColor(C.navy);
      doc.text(it.name, MX + 16, yy, { lineBreak: false });
      doc.font('InterRegular').fontSize(9).fillColor(C.subtle);
      doc.text(it.note, MX + 250, yy + 2, { width: CW - 250, align: 'right', lineBreak: false });
      yy += 26;
    }
    yy += 16;
  }
  para('Relationships are stated as direct or through intermediaries exactly as the delivery record supports.',
    MX, yy + 6, CW - 80, { size: 8.5, color: C.subtle, lineGap: 3.5 });
}

// ============================================================== PAGE 16 — WHY AB-FABIA
contentPage('14', 'Why AB-FABIA');
h1('WHY AB-FABIA', { y: 92 });

{
  const colWq = (CW - 44) / 2;
  M.why.reasons.forEach((r, i) => {
    const col = i < 4 ? 0 : 1;
    const row = col === 0 ? i : i - 4;
    const x = MX + col * (colWq + 44);
    const yv = 168 + row * 132;
    doc.font('ArchivoBlack').fontSize(30).fillColor(C.steelLight);
    doc.text(r.num, x, yv, { lineBreak: false });
    doc.font('ArchivoSemiBold').fontSize(10.5).fillColor(C.navy);
    doc.text(r.name, x, yv + 40, { width: colWq, lineBreak: false, characterSpacing: 0.4 });
    para(r.text, x, yv + 58, colWq - 14, { size: 9, lineGap: 3.5 });
  });
  // amber spine between columns
  doc.save().rect(cx - 1.25, 168, 2.5, 500).fill(C.amber).restore();
}

// ============================================================== PAGE 17 — CORPORATE INFORMATION
contentPage('15', 'Corporate Information');
h1('CORPORATE INFORMATION', { y: 92 });

{
  const colL = 300, colR = CW - colL - 24;
  // left: identity block
  const xL = MX;
  doc.font('ArchivoExtraBold').fontSize(15).fillColor(C.navy);
  doc.text('AB-FABIA SERVICE LIMITED', xL, 156, { width: colL, lineBreak: false });
  const kv = [
    ['ESTABLISHED', M.corporate.established],
    ['HEAD OFFICE', M.corporate.headOffice],
    ['CORE POSITIONING', M.corporate.corePositioning],
    ['SPECIALIST STRENGTH', M.corporate.specialistStrength]
  ];
  let ky = 192;
  kv.forEach(([k, v]) => {
    doc.font('InterSemiBold').fontSize(7.2).fillColor(C.steel);
    doc.text(k, xL, ky, { lineBreak: false, characterSpacing: 1.4 });
    doc.font('InterSemiBold').fontSize(10).fillColor(C.navy);
    doc.text(v, xL, ky + 14, { width: colL, lineGap: 3 });
    ky += 44;
  });
  doc.font('InterRegular').fontSize(8.5).fillColor(C.subtle);
  doc.text(M.corporate.registration, xL, ky, { width: colL, lineGap: 3 });

  // right: services
  const xR = MX + colL + 24;
  doc.font('InterSemiBold').fontSize(7.5).fillColor(C.steel);
  doc.text('SERVICES', xR, 158, { lineBreak: false, characterSpacing: 1.8 });
  chipRow(M.corporate.services, xR, 176, colR, { h: 22, size: 8.5, bg: C.offwhite, accent: true });

  doc.font('InterSemiBold').fontSize(7.5).fillColor(C.steel);
  doc.text('CERTIFICATIONS', xR, 316, { lineBreak: false, characterSpacing: 1.8 });
  para(M.corporate.certification, xR, 332, colR, { size: 8.8, color: C.subtle, lineGap: 3.5 });
}
// contact band
{
  const yv = 470;
  doc.save().rect(MX, yv, CW, 150).fill(C.navyDeep).restore();
  doc.save().rect(MX, yv, CW, 4).fill(C.amber).restore();
  doc.font('InterSemiBold').fontSize(7.5).fillColor('#9FB0C2');
  doc.text('CONTACT', MX + 24, yv + 18, { lineBreak: false, characterSpacing: 2 });
  doc.font('ArchivoSemiBold').fontSize(13).fillColor(C.white);
  doc.text('AB-FABIA SERVICE LIMITED', MX + 24, yv + 34, { lineBreak: false });

  const rows = [
    ['ADDRESS', M.corporate.address],
    ['PHONE', M.corporate.contact.phone],
    ['EMAIL', M.corporate.contact.email],
    ['WEBSITE', M.corporate.contact.website]
  ];
  let ry = yv + 60;
  rows.forEach(([k, v]) => {
    doc.font('InterSemiBold').fontSize(7).fillColor('#9FB0C2');
    doc.text(k, MX + 24, ry + 2, { lineBreak: false, characterSpacing: 1.2 });
    doc.font('InterMedium').fontSize(9).fillColor('#E8ECF1');
    doc.text(v, MX + 110, ry, { width: CW - 140, lineGap: 2.5 });
    ry += k === 'ADDRESS' ? 24 : 15;
  });
}
// closing brand line
doc.font('ArchivoSemiBold').fontSize(13).fillColor(C.navy);
doc.text(M.corporate.footer, MX, 660, { width: CW, align: 'center', lineBreak: false });
doc.save().moveTo(cx - 30, 684).lineTo(cx + 30, 684).lineWidth(2.5).strokeColor(C.amber).stroke().restore();

// ============================================================== finalize
if (D.getPage() !== 17) {
  console.error('PAGE COUNT ERROR: expected 17, got ' + D.getPage());
  process.exit(1);
}
doc.end();
console.log('OK — wrote', OUT, '(' + D.getPage() + ' pages)');
