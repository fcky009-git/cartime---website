/**
 * Builds the Travel Pass as a real PDF in the browser, with no print dialog involved, so it also works
 * on phones and in in-app browsers. The page is drawn on a canvas first: the browser's own fonts cover
 * all eight languages, including Arabic and Chinese, without embedding fonts in the file.
 */

const encoder = new TextEncoder();

/** Wraps one JPEG as a single A4 page. */
export function jpegToPdf(jpeg: Uint8Array, width: number, height: number): Uint8Array {
  const pageW = 595.28, pageH = 841.89;
  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Pass Do Q`;
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: () => void) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    body();
    push("\nendobj\n");
  };
  push("%PDF-1.4\n");
  object(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
  object(2, () => push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"));
  object(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Pass 4 0 R >> >> /Contents 5 0 R >>`));
  object(4, () => {
    push(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg);
    push("\nendstream");
  });
  object(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
  const start = length;
  push("xref\n0 6\n0000000000 65535 f \n");
  for (let id = 1; id <= 5; id++) push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`);
  const out = new Uint8Array(length);
  let at = 0;
  for (const part of parts) { out.set(part, at); at += part.length; }
  return out;
}

export type TravelPassSheet = {
  rtl: boolean;
  displayFont: string;
  bodyFont: string;
  logo: string;
  carImage?: string;
  qr?: string;
  reference: string;
  status: string;
  carName: string;
  year: number;
  guest: string;
  pickup: { label: string; date: string; time: string; place: string };
  dropoff: { label: string; date: string; time: string; place: string };
  zone: string;
  amountLabel: string;
  amount: string;
  days: string;
  deposit: string;
  codeLabel: string;
  code: string;
  privacy: string;
  notes: { title: string; text: string }[];
  contact: string;
  hint: string;
};

const WIDTH = 1240, HEIGHT = 1754, MARGIN = 72;

const loadImage = (src: string) => new Promise<HTMLImageElement | null>((resolve) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => resolve(null);
  image.src = src;
});

function wrapLines(ctx: CanvasRenderingContext2D, text: string, width: number, limit: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\n+/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= width) { line = next; continue; }
      if (line) lines.push(line);
      line = word;
      // Chinese and Korean text and long words have no spaces to break on.
      while (ctx.measureText(line).width > width && line.length > 1) {
        let cut = line.length - 1;
        while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > width) cut--;
        lines.push(line.slice(0, cut));
        line = line.slice(cut);
      }
    }
    if (line) lines.push(line);
  }
  if (lines.length <= limit) return lines;
  const kept = lines.slice(0, limit);
  kept[limit - 1] = `${kept[limit - 1].slice(0, -1)}…`;
  return kept;
}

export async function renderTravelPass(sheet: TravelPassSheet): Promise<{ preview: Blob; pdf: Blob }> {
  const fonts = document.fonts;
  if (fonts) {
    await Promise.all([
      fonts.load(`800 72px ${sheet.displayFont}`, sheet.carName),
      fonts.load(`400 30px ${sheet.bodyFont}`, sheet.guest),
      fonts.load(`600 30px ${sheet.bodyFont}`, sheet.guest),
    ]).catch(() => undefined);
  }
  const [logo, car, qr] = await Promise.all([
    loadImage(sheet.logo),
    sheet.carImage ? loadImage(sheet.carImage) : Promise.resolve(null),
    sheet.qr ? loadImage(sheet.qr) : Promise.resolve(null),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");

  const ink = "#0a1630", muted = "#46587a", accent = "#125cf4", line = "#d2dfee";
  const x = (value: number) => (sheet.rtl ? WIDTH - value : value);
  const box = (left: number, w: number) => (sheet.rtl ? WIDTH - left - w : left);
  ctx.direction = sheet.rtl ? "rtl" : "ltr";
  ctx.textBaseline = "alphabetic";
  const text = (value: string, from: number, y: number, font: string, color: string, align: CanvasTextAlign = "start") => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(value, x(from), y);
  };

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header band with the logo
  const band = ctx.createLinearGradient(0, 0, WIDTH, 200);
  band.addColorStop(0, "#060d1f");
  band.addColorStop(1, "#12234a");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, WIDTH, 170);
  if (logo) {
    const w = 300, h = (logo.height / logo.width) * w;
    ctx.drawImage(logo, box(MARGIN, w), 85 - h / 2, w, h);
  }
  text("TRAVEL PASS", WIDTH - MARGIN, 76, `600 24px ${sheet.bodyFont}`, "#bfe0ff", "end");
  text(sheet.reference, WIDTH - MARGIN, 118, `800 38px ${sheet.displayFont}`, "#fff", "end");

  // Car under a showroom light
  const stage = ctx.createRadialGradient(WIDTH / 2, 420, 60, WIDTH / 2, 420, 640);
  stage.addColorStop(0, "#ffffff");
  stage.addColorStop(.55, "#e6effa");
  stage.addColorStop(1, "#bdd0e8");
  ctx.fillStyle = stage;
  ctx.fillRect(0, 170, WIDTH, 470);
  if (car) {
    const scale = Math.min(860 / car.width, 430 / car.height);
    const w = car.width * scale, h = car.height * scale;
    ctx.drawImage(car, (WIDTH - w) / 2, 190 + (430 - h) / 2, w, h);
  }

  // Name and status
  let y = 730;
  const nameFont = `800 84px ${sheet.displayFont}`;
  ctx.font = nameFont;
  const name = `${sheet.carName} ${sheet.year}`;
  const nameUpper = sheet.rtl ? name : name.toLocaleUpperCase();
  text(nameUpper, MARGIN, y, nameFont, ink);
  y += 52;
  text(sheet.guest, MARGIN, y, `400 30px ${sheet.bodyFont}`, muted);
  const statusFont = `600 26px ${sheet.bodyFont}`;
  ctx.font = statusFont;
  const pill = ctx.measureText(sheet.status).width + 48;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(box(WIDTH - MARGIN - pill, pill), y - 34, pill, 48, 24);
  ctx.fill();
  text(sheet.status, WIDTH - MARGIN - pill / 2, y - 1, statusFont, "#fff", "center");

  // Route
  y += 70;
  const column = (WIDTH - MARGIN * 2 - 40) / 2;
  const side = (stop: TravelPassSheet["pickup"], from: number) => {
    text(stop.label, from, y, `500 26px ${sheet.bodyFont}`, muted);
    text(stop.date, from, y + 46, `600 32px ${sheet.bodyFont}`, ink);
    text(stop.time, from, y + 118, `800 72px ${sheet.displayFont}`, ink);
    ctx.font = `400 26px ${sheet.bodyFont}`;
    wrapLines(ctx, stop.place, column, 2).forEach((part, index) => text(part, from, y + 162 + index * 34, `400 26px ${sheet.bodyFont}`, muted));
  };
  side(sheet.pickup, MARGIN);
  side(sheet.dropoff, MARGIN + column + 40);
  y += 240;
  text(sheet.zone, MARGIN, y, `400 24px ${sheet.bodyFont}`, muted);

  // Perforation
  y += 34;
  ctx.strokeStyle = line;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(MARGIN, y);
  ctx.lineTo(WIDTH - MARGIN, y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Price, code and QR
  y += 56;
  const blockTop = y;
  text(sheet.amountLabel, MARGIN, y, `500 26px ${sheet.bodyFont}`, muted);
  text(sheet.amount, MARGIN, y + 84, `800 92px ${sheet.displayFont}`, accent);
  text(sheet.days, MARGIN, y + 132, `500 28px ${sheet.bodyFont}`, ink);
  text(sheet.deposit, MARGIN, y + 174, `400 26px ${sheet.bodyFont}`, muted);
  text(sheet.codeLabel, MARGIN, y + 226, `500 26px ${sheet.bodyFont}`, muted);
  ctx.save();
  ctx.direction = "ltr";
  ctx.font = `800 54px ${sheet.displayFont}`;
  ctx.fillStyle = ink;
  ctx.textAlign = sheet.rtl ? "right" : "left";
  ctx.fillText(sheet.code, x(MARGIN), y + 280);
  ctx.restore();
  if (qr) ctx.drawImage(qr, box(WIDTH - MARGIN - 270, 270), blockTop - 14, 270, 270);

  // Manager's notes
  y = blockTop + 330;
  for (const note of sheet.notes) {
    if (y > HEIGHT - 300) break;
    text(note.title, MARGIN, y, `600 28px ${sheet.bodyFont}`, ink);
    y += 38;
    ctx.font = `400 26px ${sheet.bodyFont}`;
    for (const part of wrapLines(ctx, note.text, WIDTH - MARGIN * 2, 3)) {
      text(part, MARGIN, y, `400 26px ${sheet.bodyFont}`, muted);
      y += 34;
    }
    y += 14;
  }

  // Footer
  ctx.fillStyle = "#eef4fb";
  ctx.fillRect(0, HEIGHT - 210, WIDTH, 210);
  let foot = HEIGHT - 170;
  ctx.font = `400 22px ${sheet.bodyFont}`;
  for (const part of [...wrapLines(ctx, sheet.privacy, WIDTH - MARGIN * 2, 2), ...wrapLines(ctx, sheet.hint, WIDTH - MARGIN * 2, 2)]) {
    text(part, MARGIN, foot, `400 22px ${sheet.bodyFont}`, muted);
    foot += 30;
  }
  text(sheet.contact, MARGIN, HEIGHT - 28, `600 24px ${sheet.bodyFont}`, ink);

  const jpeg = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not draw the pass"))), "image/jpeg", .9));
  const pdf = jpegToPdf(new Uint8Array(await jpeg.arrayBuffer()), WIDTH, HEIGHT);
  return { preview: jpeg, pdf: new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" }) };
}
