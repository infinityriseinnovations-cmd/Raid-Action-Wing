import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Specifications matching official Photoshop card print specification:
 * - Pixel Dimensions: 2133 x 659 Pixels (4.02 MB buffer)
 * - Document Size: 18.06 cm x 5.58 cm (180.6 mm x 55.8 mm)
 * - Resolution: 300 Pixels/Inch (DPI)
 * - Format: Side-by-side Dual Card Spread (Front on left: 1066.5 x 659, Back on right: 1066.5 x 659)
 */
export const ID_CARD_SPEC = {
  PIXEL_WIDTH: 2133,
  PIXEL_HEIGHT: 659,
  CM_WIDTH: 18.06,
  CM_HEIGHT: 5.58,
  MM_WIDTH: 180.6,
  MM_HEIGHT: 55.8,
  DPI: 300,
  HALF_PIXEL_WIDTH: 1066.5
};

/**
 * Helper to load an image from a data URL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Generates an official 2133 x 659 pixel @ 300 DPI dual-side card spread canvas.
 * Exactly corresponds to 18.06 cm width x 5.58 cm height document size.
 */
export async function generateIdCardSpreadCanvas(
  frontId = 'rawf-card-front',
  backId = 'rawf-card-back'
): Promise<{ canvas: HTMLCanvasElement; dataUrl: string }> {
  let frontEl = document.getElementById(frontId);
  let backEl = document.getElementById(backId);

  // If active elements are not found (e.g. user is in single-side view mode),
  // attempt to look for fallback or master elements
  if (!frontEl) {
    frontEl = document.getElementById(`master-${frontId}`) || document.querySelector('[data-card-side="front"]');
  }
  if (!backEl) {
    backEl = document.getElementById(`master-${backId}`) || document.querySelector('[data-card-side="back"]');
  }

  if (!frontEl && !backEl) {
    throw new Error('No ID card elements found in the document to generate spread.');
  }

  // Create standard canvas sized at exactly 2133 x 659 pixels
  const canvas = document.createElement('canvas');
  canvas.width = ID_CARD_SPEC.PIXEL_WIDTH;
  canvas.height = ID_CARD_SPEC.PIXEL_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create canvas 2D context.');
  }

  // High-quality image rendering settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill canvas with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ID_CARD_SPEC.PIXEL_WIDTH, ID_CARD_SPEC.PIXEL_HEIGHT);

  // Capture Front side if available
  let frontImg: HTMLImageElement | null = null;
  if (frontEl) {
    const frontDataUrl = await toPng(frontEl, {
      pixelRatio: 2.8,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true,
      quality: 1.0
    });
    frontImg = await loadImage(frontDataUrl);
  }

  // Capture Back side if available
  let backImg: HTMLImageElement | null = null;
  if (backEl) {
    const backDataUrl = await toPng(backEl, {
      pixelRatio: 2.8,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true,
      quality: 1.0
    });
    backImg = await loadImage(backDataUrl);
  }

  const halfWidth = ID_CARD_SPEC.HALF_PIXEL_WIDTH;
  const height = ID_CARD_SPEC.PIXEL_HEIGHT;

  if (frontImg && backImg) {
    // Both cards: Front on left (0 to 1066), Back on right (1067 to 2133)
    ctx.drawImage(frontImg, 0, 0, Math.floor(halfWidth), height);
    ctx.drawImage(backImg, Math.ceil(halfWidth), 0, Math.floor(halfWidth), height);

    // Subtle faint dividing guideline at center for precision cutting/folding
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, height);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (frontImg) {
    // Only front: draw centered on left half or full canvas
    ctx.drawImage(frontImg, 0, 0, Math.floor(halfWidth), height);
  } else if (backImg) {
    // Only back: draw on right half
    ctx.drawImage(backImg, Math.ceil(halfWidth), 0, Math.floor(halfWidth), height);
  }

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  return { canvas, dataUrl };
}

/**
 * Downloads the official ID Card as a PDF with exact document size:
 * - Width: 18.06 Centimeters (180.6 mm)
 * - Height: 5.58 Centimeters (55.8 mm)
 * - Resolution: 300 Pixels/Inch (2133 x 659 Pixels)
 */
export async function downloadCardAsPdf(
  frontId = 'rawf-card-front',
  backId = 'rawf-card-back',
  officerName = 'Officer_ID'
): Promise<boolean> {
  try {
    const { dataUrl } = await generateIdCardSpreadCanvas(frontId, backId);

    // Create PDF with exact 18.06 cm x 5.58 cm dimensions (orientation: landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'cm',
      format: [ID_CARD_SPEC.CM_WIDTH, ID_CARD_SPEC.CM_HEIGHT]
    });

    // Add high-resolution 300 DPI rasterized card spread covering the entire page
    pdf.addImage(
      dataUrl,
      'PNG',
      0,
      0,
      ID_CARD_SPEC.CM_WIDTH,
      ID_CARD_SPEC.CM_HEIGHT,
      undefined,
      'FAST'
    );

    pdf.setProperties({
      title: `RAWF Official ID Card - ${officerName}`,
      subject: 'Official Officer Accreditation Card (18.06 x 5.58 cm @ 300 DPI)',
      author: 'Raid Action Wing Foundation',
      creator: 'RAWF National Command Registry IFA 760'
    });

    const safeName = officerName.replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`RAWF_ID_${safeName}_18.06x5.58cm_300DPI.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
}

/**
 * Downloads a DOM element as a high-resolution PNG image
 */
export async function downloadCardAsPng(elementId: string, filename: string): Promise<boolean> {
  try {
    const el = document.getElementById(elementId);
    if (!el) {
      console.error(`Element with id "${elementId}" not found`);
      return false;
    }

    const dataUrl = await toPng(el, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true,
      quality: 1.0,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      }
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download PNG:', err);
    return false;
  }
}

/**
 * Downloads the full Dual-Side Card Spread (2133 x 659 Pixels @ 300 DPI) as a PNG image
 */
export async function downloadCardSpreadAsPng(
  frontId = 'rawf-card-front',
  backId = 'rawf-card-back',
  officerName = 'Officer_ID'
): Promise<boolean> {
  try {
    const { dataUrl } = await generateIdCardSpreadCanvas(frontId, backId);
    const link = document.createElement('a');
    const safeName = officerName.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `RAWF_ID_Spread_${safeName}_2133x659_300DPI.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download spread PNG:', err);
    return false;
  }
}

/**
 * High-reliability print method:
 * Mounts the official ID Card spread in the main document, activates print mode,
 * and opens the native print dialog at exact physical dimensions (18.06 cm x 5.58 cm @ 300 DPI).
 */
export async function triggerPrintIdCard(
  frontId = 'rawf-card-front',
  backId = 'rawf-card-back'
): Promise<boolean> {
  try {
    // Generate high-resolution spread canvas
    const { dataUrl } = await generateIdCardSpreadCanvas(frontId, backId);

    // Look for existing mount or create one in the main document
    let printMount = document.getElementById('rawf-print-studio-mount');
    if (!printMount) {
      printMount = document.createElement('div');
      printMount.id = 'rawf-print-studio-mount';
      document.body.appendChild(printMount);
    }

    printMount.innerHTML = `
      <div class="rawf-print-sheet-inner">
        <img src="${dataUrl}" class="rawf-print-spread-img" alt="RAWF ID Card Spread" />
      </div>
    `;

    document.body.classList.add('rawf-is-printing');

    // Wait a brief moment to ensure image is decoded in DOM
    await new Promise<void>((resolve) => {
      const img = printMount?.querySelector('img');
      if (img && !img.complete) {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      } else {
        resolve();
      }
    });

    const cleanup = () => {
      document.body.classList.remove('rawf-is-printing');
      if (printMount && printMount.parentNode) {
        printMount.parentNode.removeChild(printMount);
      }
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    // Trigger system print
    window.print();

    // Fallback cleanup timer in case afterprint event is delayed or not supported
    setTimeout(cleanup, 2500);

    return true;
  } catch (err) {
    console.warn('High-res canvas print preparation error, falling back to direct window.print():', err);
    try {
      window.print();
      return true;
    } catch (fallbackErr) {
      console.error('System print failed entirely:', fallbackErr);
      return false;
    }
  }
}
