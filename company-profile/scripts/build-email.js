// Builds ab-fabia-company-profile-email.html — email-safe condensed profile.
// Tables + inline CSS only. No JS, no web-font dependencies (Arial fallbacks).
const fs = require('fs');
const path = require('path');
const M = require('../content/master-content');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile-email.html');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const NAVY = '#0B1F3A', NAVYD = '#071727', AMBER = '#F5A623', STEEL = '#6B7A8D',
  LSTEEL = '#E8ECF1', OFF = '#F6F8FA', BODY = '#3B4652', SUBTLE = '#5A6B7C',
  LINE = '#DCE3EA', TINT = '#FBF0DE';
const SANS = "'Inter','Segoe UI',Arial,Helvetica,sans-serif";
const HEAD = "'Archivo','Segoe UI',Arial,Helvetica,sans-serif";

const td = (html, o = {}) => `<td style="${o.style || ''}">${html}</td>`;

function row(cells, o = {}) {
  return `<tr role="presentation">${cells.map(c => typeof c === 'string' ? td(c, o) : td(c.html, c)).join('')}</tr>`;
}

const capFamilies = M.capabilities.families.map(f =>
  `<tr role="presentation"><td style="padding:0 0 14px 0;">
    <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:14px;letter-spacing:.5px;">${esc(f.num)} · ${esc(f.name)}</div>
    <div style="font-family:${SANS};color:${SUBTLE};font-size:12px;padding:2px 0 6px 0;">${esc(f.descriptor)}</div>
    <div style="font-family:${SANS};color:${BODY};font-size:12px;line-height:1.7;">${esc(f.items.join(' · '))}</div>
  </td></tr>`).join('');

const projectRows = [];
for (const cat of M.experience.categories) {
  for (const pr of cat.projects) {
    const meta = [pr.client, pr.relationship, pr.location, pr.period].filter(Boolean).join(' · ');
    projectRows.push(`<tr role="presentation"><td style="padding:0 0 12px 0;border-left:4px solid ${AMBER};padding-left:14px;">
      <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:14px;">${esc(pr.name)}</div>
      <div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.5px;color:${SUBTLE};text-transform:uppercase;padding:3px 0;">${esc(meta)}</div>
      <div style="font-family:${SANS};font-size:12.5px;color:${BODY};line-height:1.6;">${esc(pr.scope)}</div>
      ${pr.outcome ? `<div style="font-family:${SANS};font-size:12px;color:${SUBTLE};padding-top:5px;"><span style="color:${NAVY};font-weight:700;font-size:10.5px;letter-spacing:1px;">OUTCOME</span> ${esc(pr.outcome)}</div>` : ''}
    </td></tr>`);
  }
}

const whyTop3 = [M.why.reasons[0], M.why.reasons[1], M.why.reasons[2]];

const whyRows = whyTop3.map(r =>
  `<tr role="presentation"><td style="padding:0 0 14px 0;">
    <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:16px;">${esc(r.num)}</div>
    <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:13.5px;letter-spacing:.6px;padding:2px 0;">${esc(r.name)}</div>
    <div style="font-family:${SANS};font-size:12.5px;color:${BODY};line-height:1.6;">${esc(r.text)}</div>
  </td></tr>`).join('\n      ');

const html = `<!DOCTYPE html>
<!-- =====================================================================
  AB-FABIA SERVICE LIMITED — email profile (condensed)
  SUBJECT:    AB-FABIA SERVICE LIMITED | Integrated EPC & Energy Services
  PREHEADER:  Engineering, procurement, construction and specialist energy services.
  Email-safe HTML: tables + inline CSS, no JavaScript. Best viewed with images on.
  Derived from the master content source v1.0.
====================================================================== -->
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>AB-FABIA SERVICE LIMITED | Integrated EPC &amp; Energy Services</title>
</head>
<body style="margin:0;padding:0;background-color:${OFF};">
<div style="display:none;font-size:1px;color:${OFF};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Engineering, procurement, construction and specialist energy services.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${OFF};">
  <tr role="presentation"><td align="center" style="padding:24px 12px;">

    <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;background-color:#FFFFFF;">

      <!-- ===== COVER BAND ===== -->
      <tr role="presentation"><td style="background-color:${NAVYD};padding:46px 44px 40px 44px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr role="presentation"><td><div style="width:96px;height:6px;background-color:${AMBER};font-size:0;line-height:0;">&nbsp;</div></td></tr>
          <tr role="presentation"><td style="padding-top:26px;">
            <div style="font-family:${HEAD};font-weight:900;color:#FFFFFF;font-size:30px;line-height:1.1;letter-spacing:.5px;">AB - FABIA<br>SERVICE LIMITED</div>
            <div style="width:96px;height:2px;background-color:${AMBER};font-size:0;line-height:0;margin-top:14px;">&nbsp;</div>
          </td></tr>
          <tr role="presentation"><td style="padding-top:30px;">
            <div style="font-family:${HEAD};font-weight:800;color:#FFFFFF;font-size:21px;line-height:1.3;">INTEGRATED EPC &amp; ENERGY SERVICES</div>
            <div style="font-family:${SANS};color:#B9C6D4;font-size:13px;padding-top:8px;">${esc(M.cover.positioningLine)}</div>
          </td></tr>
          <tr role="presentation"><td style="padding-top:28px;">
            <div style="font-family:${SANS};font-weight:600;color:#D7DFE8;font-size:13px;">${esc(M.cover.brandLine)}</div>
            <div style="font-family:${SANS};color:#7E8FA3;font-size:11px;letter-spacing:2.5px;padding-top:18px;">EST. 2002 &nbsp;·&nbsp; ${esc(M.cover.placeLine)}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- ===== WHO WE ARE ===== -->
      <tr role="presentation"><td style="padding:38px 44px 6px 44px;">
        <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:12px;letter-spacing:2px;">01</div>
        <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:20px;letter-spacing:.5px;text-transform:uppercase;">WHO WE ARE</div>
        <div style="width:44px;height:4px;background-color:${AMBER};font-size:0;line-height:0;margin:10px 0 16px 0;">&nbsp;</div>
        <div style="font-family:${SANS};font-weight:600;color:${NAVY};font-size:14px;line-height:1.6;">${esc(M.whoWeAre.lead)}</div>
        <div style="font-family:${SANS};color:${BODY};font-size:13px;line-height:1.7;padding-top:12px;">${esc(M.whoWeAre.body[1])}</div>
        <div style="font-family:${SANS};font-weight:700;color:${NAVY};font-size:12px;letter-spacing:1px;padding-top:14px;">ONE ORGANIZATION &nbsp;·&nbsp; MULTIPLE TECHNICAL CAPABILITIES &nbsp;·&nbsp; INTEGRATED DELIVERY</div>
      </td></tr>

      <!-- ===== CORE CAPABILITIES ===== -->
      <tr role="presentation"><td style="padding:34px 44px 4px 44px;">
        <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:12px;letter-spacing:2px;">02</div>
        <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:20px;letter-spacing:.5px;text-transform:uppercase;">CORE CAPABILITIES</div>
        <div style="width:44px;height:4px;background-color:${AMBER};font-size:0;line-height:0;margin:10px 0 18px 0;">&nbsp;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${capFamilies}</table>
      </td></tr>

      <!-- ===== DRILLING FLUIDS (SPECIALIST STRENGTH) ===== -->
      <tr role="presentation"><td style="padding:30px 44px 10px 44px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${TINT};">
          <tr role="presentation"><td style="padding:22px 24px;border-left:4px solid ${AMBER};">
            <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:12px;letter-spacing:2px;">03</div>
            <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:18px;text-transform:uppercase;letter-spacing:.5px;padding:2px 0 8px 0;">${esc(M.drillingFluids.title)}</div>
            <div style="font-family:${SANS};font-weight:600;color:${NAVY};font-size:13px;line-height:1.6;">${esc(M.drillingFluids.lead)}</div>
            <div style="font-family:${SANS};color:${BODY};font-size:12.5px;line-height:1.8;padding-top:10px;">${esc(M.drillingFluids.families.join(' · '))}</div>
            <div style="font-family:${SANS};color:#6E4E16;font-size:12px;line-height:1.6;padding-top:12px;">${esc(M.drillingFluids.crossReference)}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- ===== SELECTED DELIVERY EXPERIENCE ===== -->
      <tr role="presentation"><td style="padding:34px 44px 4px 44px;">
        <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:12px;letter-spacing:2px;">04</div>
        <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:20px;text-transform:uppercase;letter-spacing:.5px;">SELECTED DELIVERY EXPERIENCE</div>
        <div style="width:44px;height:4px;background-color:${AMBER};font-size:0;line-height:0;margin:10px 0 16px 0;">&nbsp;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          ${projectRows.join('\n          ')}
        </table>
      </td></tr>

      <!-- ===== WHY AB-FABIA ===== -->
      <tr role="presentation"><td style="padding:30px 44px 6px 44px;">
        <div style="font-family:${HEAD};font-weight:800;color:${AMBER};font-size:12px;letter-spacing:2px;">05</div>
        <div style="font-family:${HEAD};font-weight:800;color:${NAVY};font-size:20px;text-transform:uppercase;letter-spacing:.5px;">WHY AB-FABIA</div>
        <div style="width:44px;height:4px;background-color:${AMBER};font-size:0;line-height:0;margin:10px 0 14px 0;">&nbsp;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${whyRows}
        </table>
        <div style="font-family:${SANS};color:${SUBTLE};font-size:12px;padding-top:4px;">+ four more reasons in the full corporate profile.</div>
      </td></tr>

      <!-- ===== CONTACT ===== -->
      <tr role="presentation"><td style="padding:30px 44px 40px 44px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${NAVYD};">
          <tr role="presentation"><td style="padding:24px 26px;border-top:4px solid ${AMBER};">
            <div style="font-family:${SANS};font-weight:700;color:#9FB0C2;font-size:11px;letter-spacing:2px;">CONTACT</div>
            <div style="font-family:${HEAD};font-weight:800;color:#FFFFFF;font-size:17px;padding:4px 0 12px 0;">AB-FABIA SERVICE LIMITED</div>
            <div style="font-family:${SANS};color:#C4CFDB;font-size:12.5px;line-height:1.8;">
              <strong style="color:#9FB0C2;font-size:10.5px;letter-spacing:1.2px;">ADDRESS</strong><br>${esc(M.corporate.address)}<br><br>
              <strong style="color:#9FB0C2;font-size:10.5px;letter-spacing:1.2px;">PHONE</strong>&nbsp;&nbsp;${esc(M.corporate.contact.phone)}<br>
              <strong style="color:#9FB0C2;font-size:10.5px;letter-spacing:1.2px;">EMAIL</strong>&nbsp;&nbsp;${esc(M.company.emails.join(' · '))}<br>
              <strong style="color:#9FB0C2;font-size:10.5px;letter-spacing:1.2px;">WEB</strong>&nbsp;&nbsp;&nbsp;${esc(M.corporate.contact.website)}
            </div>
            <div style="font-family:${HEAD};font-weight:700;color:#D7DFE8;font-size:13px;letter-spacing:1px;padding-top:16px;">${esc(M.corporate.footer)}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- ===== FOOTER ===== -->
      <tr role="presentation"><td style="background-color:${OFF};padding:18px 44px;border-top:1px solid ${LINE};">
        <div style="font-family:${SANS};color:${SUBTLE};font-size:11px;line-height:1.6;text-align:center;">
          AB-FABIA SERVICE LIMITED · Integrated EPC &amp; Energy Services · Est. 2002, Port Harcourt, Nigeria<br>
          This is a corporate capability introduction. A full profile and technical documentation are available on request.
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.log('OK — wrote', OUT, '(' + (html.length / 1024).toFixed(1) + ' KB)');
