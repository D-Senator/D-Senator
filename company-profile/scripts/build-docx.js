// Builds ab-fabia-company-profile-editable.docx — fully editable Word version
// of the corporate profile v1.0, derived from the master content source.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, TableOfContents,
  PageBreak, VerticalAlign, Header, Footer, PageNumber, ImageRun, TabStopType
} = require('docx');
const M = require('../content/master-content');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile-editable.docx');
const LOGO = path.join(__dirname, '..', '..', 'brand', 'logo', 'ab-fabia-logo.png');

const NAVY = '0B1F3A', NAVYD = '071727', AMBER = 'F5A623', STEEL = '6B7A8D',
  LSTEEL = 'E8ECF1', OFF = 'F6F8FA', BODY = '3B4652', SUBTLE = '5A6B7C',
  LINE = 'DCE3EA', TINT = 'FBF0DE';
const HEAD_FONT = 'Archivo Display';
const BODY_FONT = 'Inter';

// ---------------------------------------------------------------- helpers
const H1 = HeadingLevel.HEADING_1, H2 = HeadingLevel.HEADING_2;

function h1(num, text) {
  return new Paragraph({
    heading: H1,
    pageBreakBefore: true,
    spacing: { before: 120, after: 60 },
    border: { bottom: { color: AMBER, size: 16, space: 6, style: BorderStyle.SINGLE } },
    children: [
      new TextRun({ text: num + '   ', bold: true, color: AMBER, font: HEAD_FONT, size: 40 }),
      new TextRun({ text, bold: true, color: NAVY, font: HEAD_FONT, size: 40 })
    ]
  });
}

function h2(text) {
  return new Paragraph({
    heading: H2,
    spacing: { before: 220, after: 80 },
    children: [new TextRun({ text, bold: true, color: NAVY, font: HEAD_FONT, size: 28 })]
  });
}

function p(text, o = {}) {
  return new Paragraph({
    alignment: o.align || AlignmentType.LEFT,
    spacing: { after: o.after ?? 140, line: 300 },
    children: [new TextRun({
      text, color: o.color || BODY, font: o.font || BODY_FONT,
      size: o.size || 22, bold: o.bold, italics: o.italics
    })]
  });
}

function lead(text) {
  return new Paragraph({
    spacing: { after: 160, line: 320 },
    children: [new TextRun({ text, bold: true, color: NAVY, font: BODY_FONT, size: 24 })]
  });
}

function kicker(text) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, bold: true, color: STEEL, font: BODY_FONT, size: 17, allCaps: true })]
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 70, line: 290 },
    children: [new TextRun({ text, color: BODY, font: BODY_FONT, size: 21 })]
  });
}

function statement(text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [new TableCell({
        shading: { fill: NAVY },
        margins: { top: 180, bottom: 180, left: 220, right: 220 },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          left: { style: BorderStyle.SINGLE, color: AMBER, size: 24 }
        },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, bold: true, color: 'FFFFFF', font: HEAD_FONT, size: 24 })]
        })]
      })]
    })]
  });
}

const cellBorders = {
  top: { style: BorderStyle.SINGLE, color: LINE, size: 4 },
  bottom: { style: BorderStyle.SINGLE, color: LINE, size: 4 },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
};

function kvTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([k, v]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: cellBorders, margins: { top: 80, bottom: 80, left: 0, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, color: STEEL, font: BODY_FONT, size: 17, allCaps: true })] })]
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          borders: cellBorders, margins: { top: 80, bottom: 80, left: 0, right: 0 },
          children: [new Paragraph({ children: [new TextRun({ text: v, bold: true, color: NAVY, font: BODY_FONT, size: 21 })] })]
        })
      ]
    }))
  });
}

function projectTable(pr) {
  const rows = [
    ['Client / Relationship', [pr.client, pr.relationship].filter(Boolean).join(' · ')],
    ['Location', pr.location],
    ['AB-FABIA Role', pr.role],
    ['Scope', pr.scope],
    ['Date / Period', pr.period || 'To be confirmed'],
    ['Outcome', pr.outcome || '-']
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [new TableCell({
          columnSpan: 2, shading: { fill: NAVY },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, color: AMBER, size: 16 }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: [new TextRun({ text: pr.name, bold: true, color: 'FFFFFF', font: HEAD_FONT, size: 23 })] })]
        })]
      }),
      ...rows.map(([k, v]) => new TableRow({
        children: [
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE }, borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 0, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, color: STEEL, font: BODY_FONT, size: 17, allCaps: true })] })]
          }),
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE }, borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 0, right: 0 },
            children: [new Paragraph({ children: [new TextRun({ text: v, color: BODY, font: BODY_FONT, size: 20 })] })]
          })
        ]
      }))
    ]
  });
}

// ---------------------------------------------------------------- content
const children = [];

// ---- Title page
const logoData = fs.readFileSync(LOGO);
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 1600, after: 200 },
  children: [new ImageRun({
    type: 'png',
    data: logoData,
    transformation: { width: 264, height: 224 }   // 260:220 ratio, editable object
  })]
}));
children.push(p('AB-FABIA SERVICE LIMITED', { align: AlignmentType.CENTER, font: HEAD_FONT, size: 44, color: NAVY, bold: true, after: 80 }));
children.push(p('INTEGRATED EPC & ENERGY SERVICES', { align: AlignmentType.CENTER, font: HEAD_FONT, size: 30, color: NAVY, bold: true, after: 160 }));
children.push(p('Engineering • Procurement • Construction • Energy Services', { align: AlignmentType.CENTER, size: 22, color: STEEL, after: 60 }));
children.push(p('Precision. Procurement. Performance.', { align: AlignmentType.CENTER, size: 22, color: BODY, bold: true, after: 240 }));
children.push(p('EST. 2002', { align: AlignmentType.CENTER, size: 18, color: SUBTLE, after: 40 }));
children.push(p('PORT HARCOURT, RIVERS STATE, NIGERIA', { align: AlignmentType.CENTER, size: 18, color: SUBTLE, after: 40 }));
children.push(p('CORPORATE CAPABILITY PROFILE · VERSION 1.0', { align: AlignmentType.CENTER, size: 17, color: STEEL, after: 0 }));

// ---- Contents (auto-updating field)
children.push(new Paragraph({
  heading: H1, pageBreakBefore: true,
  spacing: { before: 120, after: 120 },
  border: { bottom: { color: AMBER, size: 16, space: 6, style: BorderStyle.SINGLE } },
  children: [new TextRun({ text: 'CONTENTS', bold: true, color: NAVY, font: HEAD_FONT, size: 40 })]
}));
children.push(p('Tip: in Word, right-click the contents and choose "Update Field" to refresh page numbers after any edit.', { size: 18, color: SUBTLE, italics: true, after: 200 }));
children.push(new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }));

// ---- 01 Who We Are
children.push(h1('01', 'WHO WE ARE'));
children.push(lead(M.whoWeAre.lead));
M.whoWeAre.body.forEach(t => children.push(p(t)));
children.push(kicker('One organization · Multiple technical capabilities · Integrated delivery'));
children.push(h2('Capability Overview'));
M.whoWeAre.diagram.branches.forEach(b => {
  children.push(p(b.name, { bold: true, color: NAVY, size: 22, after: 40 }));
  children.push(p(b.items.join(' · '), { size: 21, after: 120 }));
});
children.push(statement(M.whoWeAre.bottomStatement));

// ---- 02 Our Story
children.push(h1('02', 'OUR STORY'));
children.push(kicker(M.story.subtitle));
M.story.milestones.forEach(ms => {
  children.push(p(ms.year + '  ·  ' + ms.label, { bold: true, color: NAVY, size: 22, after: 40 }));
  children.push(p(ms.text, { size: 21, after: 160 }));
});

// ---- 03 Our Capabilities
children.push(h1('03', 'OUR CAPABILITIES'));
children.push(p(M.capabilities.intro));
M.capabilities.families.forEach(f => {
  children.push(h2(f.num + ' · ' + f.name));
  children.push(p(f.descriptor, { color: STEEL, size: 20, italics: true, after: 60 }));
  f.items.forEach(i => children.push(bullet(i)));
});

// ---- 04 Energy & Oilfield Services
children.push(h1('04', 'ENERGY & OILFIELD SERVICES'));
children.push(lead(M.energy.lead));
M.energy.subsections.forEach(s => {
  children.push(h2(s.name));
  children.push(p(s.text));
});
children.push(h2('Supporting Facilities'));
children.push(p(M.energy.facilitiesNote));
children.push(statement(M.energy.bottomMessage));

// ---- 05 EPC
children.push(h1('05', 'ENGINEERING, PROCUREMENT & CONSTRUCTION'));
children.push(p(M.epc.intro));
M.epc.columns.forEach(c => {
  children.push(h2(c.name));
  c.items.forEach(i => children.push(bullet(i)));
});
children.push(statement(M.epc.keyMessage));

// ---- 06 Civil, Infrastructure & Marine
children.push(h1('06', 'CIVIL, INFRASTRUCTURE & MARINE'));
M.civilMarine.groups.forEach(g => {
  children.push(h2(g.name));
  g.items.forEach(i => children.push(bullet(i)));
});
children.push(statement(M.civilMarine.keyMessage));

// ---- 07 Surveying & Geomatics
children.push(h1('07', 'SURVEYING & GEOMATICS'));
children.push(p(M.surveying.intro));
children.push(h2('Capabilities'));
M.surveying.capabilities.forEach(i => children.push(bullet(i)));
children.push(h2('Applications'));
M.surveying.applications.forEach(i => children.push(bullet(i)));

// ---- 08 Drilling Fluids & Technical Products
children.push(h1('08', 'DRILLING FLUIDS & TECHNICAL PRODUCTS'));
children.push(lead(M.drillingFluids.lead));
children.push(h2('Product Families'));
M.drillingFluids.families.forEach(f => children.push(bullet(f)));
children.push(h2('Technical Documentation'));
children.push(p(M.drillingFluids.crossReference));

// ---- 09 How We Deliver
children.push(h1('09', 'HOW WE DELIVER'));
M.delivery.steps.forEach(s => {
  children.push(p(s.num + '  ·  ' + s.name, { bold: true, color: NAVY, size: 22, after: 40 }));
  children.push(p(s.text, { size: 21, after: 140 }));
});
children.push(statement(M.delivery.keyMessage));

// ---- 10 HSE, Quality & Field Assurance
children.push(h1('10', 'HSE, QUALITY & FIELD ASSURANCE'));
children.push(p(M.hse.intro));
children.push(h2('HSE'));
M.hse.hse.forEach(i => children.push(bullet(i)));
children.push(h2('Quality'));
M.hse.quality.forEach(i => children.push(bullet(i)));
children.push(h2('Field Assurance'));
children.push(p('"' + M.hse.fieldAssurance + '"', { color: NAVY, bold: true }));
children.push(h2('Certifications & Registrations'));
children.push(p(M.hse.certificationNote));

// ---- 11 Our People
children.push(h1('11', 'OUR PEOPLE'));
children.push(lead(M.people.lead));
children.push(kicker(M.people.principle));
children.push(h2('Executive Leadership'));
M.people.leadership.forEach(l => {
  children.push(p(l.name + '  ·  ' + l.role, { bold: true, color: NAVY, size: 22, after: 40 }));
  children.push(p(l.summary, { size: 21, after: 160 }));
});
children.push(h2('Technical & Professional Strength'));
M.people.strengths.forEach(s => children.push(bullet(s)));
children.push(h2('Integrated Experience'));
children.push(p(M.people.integrationNote));

// ---- 12 Selected Delivery Experience
children.push(h1('12', 'SELECTED DELIVERY EXPERIENCE'));
children.push(p(M.experience.intro));
M.experience.categories.forEach(cat => {
  children.push(h2(cat.key + '. ' + cat.name));
  cat.projects.forEach(pr => {
    children.push(projectTable(pr));
    children.push(p('', { after: 160, size: 8 }));
  });
});

// ---- 13 Clients & Industry Relationships
children.push(h1('13', 'CLIENTS & INDUSTRY RELATIONSHIPS'));
children.push(p(M.clients.intro));
M.clients.groups.forEach(g => {
  children.push(h2(g.name));
  g.items.forEach(it => children.push(bullet(it.name + '  ·  ' + it.note)));
});
children.push(p('Relationships are stated as direct or through intermediaries exactly as the delivery record supports.', { size: 19, color: SUBTLE, italics: true }));

// ---- 14 Why AB-FABIA
children.push(h1('14', 'WHY AB-FABIA'));
M.why.reasons.forEach(r => {
  children.push(p(r.num + '  ·  ' + r.name, { bold: true, color: NAVY, size: 22, after: 40 }));
  children.push(p(r.text, { size: 21, after: 140 }));
});

// ---- 15 Corporate Information
children.push(h1('15', 'CORPORATE INFORMATION'));
children.push(kvTable([
  ['Company', 'AB-FABIA SERVICE LIMITED'],
  ['Established', M.corporate.established],
  ['Head Office', M.corporate.headOffice],
  ['Address', M.corporate.address],
  ['Core Positioning', M.corporate.corePositioning],
  ['Specialist Strength', M.corporate.specialistStrength],
  ['Registration', M.corporate.registration],
  ['Certifications', M.corporate.certification]
]));
children.push(h2('Services'));
M.corporate.services.forEach(s => children.push(bullet(s)));
children.push(h2('Contact'));
children.push(kvTable([
  ['Phone', M.corporate.contact.phone],
  ['Email', M.corporate.contact.email],
  ['Website', M.corporate.contact.website]
]));
children.push(statement(M.corporate.footer));

// ---------------------------------------------------------------- document
const doc = new Document({
  creator: 'AB-FABIA SERVICE LIMITED',
  title: 'AB-FABIA Service Limited — Corporate Profile v1.0',
  description: 'Integrated EPC & Energy Services — Corporate Capability Profile',
  features: { updateFields: true },   // prompt Word to update TOC page numbers on open
  styles: {
    default: {
      document: { run: { font: BODY_FONT, size: 22, color: BODY } }
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: HEAD_FONT, size: 40, bold: true, color: NAVY },
        paragraph: { spacing: { before: 240, after: 120 } }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: HEAD_FONT, size: 28, bold: true, color: NAVY },
        paragraph: { spacing: { before: 220, after: 100 } }
      }
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1080, right: 1080 } } // A4, 19mm sides
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { color: LINE, size: 4, space: 4, style: BorderStyle.SINGLE } },
          children: [new TextRun({ text: 'AB-FABIA SERVICE LIMITED', bold: true, color: STEEL, font: BODY_FONT, size: 15, allCaps: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { color: LINE, size: 4, space: 4, style: BorderStyle.SINGLE } },
          children: [
            new TextRun({ text: 'Precision. Procurement. Performance.   ·   Page ', color: SUBTLE, font: BODY_FONT, size: 16 }),
            new TextRun({ children: [PageNumber.CURRENT], color: SUBTLE, font: BODY_FONT, size: 16 })
          ]
        })]
      })
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('OK — wrote', OUT, '(' + (buf.length / 1024).toFixed(1) + ' KB)');
});
