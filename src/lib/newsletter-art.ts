/**
 * Newsletter illustration: an open envelope with a letter, in front of royal-blue rays
 * that fade to white. One SVG used twice: inline on the confirm / unsubscribe pages,
 * and as a PNG (rendered by /api/email/hero) at the top of emails, since most email
 * apps don't display SVG.
 */

export const ART_WIDTH = 560;
export const ART_HEIGHT = 280;

/** Light rays fanning out from below the envelope. */
function rays() {
  const cx = ART_WIDTH / 2;
  const cy = 300;
  const parts: string[] = [];
  for (let i = 0; i < 13; i++) {
    const a = Math.PI + (i / 12) * Math.PI; // from left to right across the top
    const b = a + Math.PI / 30;
    const r = 520;
    const p = (angle: number) =>
      `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    parts.push(`<polygon points="${cx},${cy} ${p(a)} ${p(b)}" fill="#ffffff" opacity="0.13"/>`);
  }
  return parts.join("");
}

export const envelopeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ART_WIDTH} ${ART_HEIGHT}" width="${ART_WIDTH}" height="${ART_HEIGHT}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4169e1"/>
    <stop offset="0.55" stop-color="#9db3f5"/>
    <stop offset="1" stop-color="#ffffff"/>
  </linearGradient>
  <linearGradient id="front" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="1" stop-color="#eef2fd"/>
  </linearGradient>
  <linearGradient id="back" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9e2fb"/>
    <stop offset="1" stop-color="#c7d4f7"/>
  </linearGradient>
</defs>
<rect width="${ART_WIDTH}" height="${ART_HEIGHT}" fill="url(#sky)"/>
${rays()}
<circle cx="120" cy="70" r="3" fill="#ffffff" opacity="0.7"/>
<circle cx="452" cy="96" r="4" fill="#ffffff" opacity="0.6"/>
<circle cx="408" cy="44" r="2.5" fill="#ffffff" opacity="0.8"/>
<circle cx="150" cy="150" r="2" fill="#ffffff" opacity="0.7"/>
<ellipse cx="280" cy="268" rx="128" ry="7" fill="#0a0a0a" opacity="0.07"/>
<path d="M164 134 L280 58 L396 134 Z" fill="url(#back)"/>
<rect x="164" y="134" width="232" height="130" rx="12" fill="url(#back)"/>
<rect x="194" y="84" width="172" height="152" rx="10" fill="#0a0a0a" opacity="0.06"/>
<rect x="192" y="78" width="176" height="152" rx="10" fill="#ffffff"/>
<circle cx="216" cy="102" r="9" fill="#4169e1"/>
<rect x="234" y="94" width="84" height="7" rx="3.5" fill="#c9d4f6"/>
<rect x="234" y="106" width="52" height="6" rx="3" fill="#e3e9fb"/>
<rect x="208" y="128" width="144" height="6" rx="3" fill="#e3e9fb"/>
<rect x="208" y="142" width="144" height="6" rx="3" fill="#e3e9fb"/>
<rect x="208" y="156" width="104" height="6" rx="3" fill="#e3e9fb"/>
<path d="M164 146 L280 214 L396 146 L396 252 Q396 264 384 264 L176 264 Q164 264 164 252 Z" fill="url(#front)"/>
<path d="M164 258 L262 196 M396 258 L298 196" stroke="#dbe3fa" stroke-width="2" fill="none"/>
<path d="M164 146 L280 214 L396 146" stroke="#e3e9fb" stroke-width="2" fill="none"/>
</svg>`;

export const envelopeDataUri = `data:image/svg+xml;base64,${
  typeof Buffer !== "undefined" ? Buffer.from(envelopeSvg).toString("base64") : btoa(envelopeSvg)
}`;
