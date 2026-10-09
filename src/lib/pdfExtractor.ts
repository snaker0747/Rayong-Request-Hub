/**
 * Extracts embedded image and text from a PDF file using pdfjs-dist and HTML5 Canvas.
 * Directly decodes embedded image XObjects and converts them to Data URL.
 */

export async function extractImageFromPdf(file: File): Promise<string> {
  // Only execute in browser environment where window & document are available
  if (typeof window === 'undefined') return '';

  try {
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const extractedImages: { dataUrl: string; width: number; height: number; area: number }[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const ops = await page.getOperatorList();

      for (let j = 0; j < ops.fnArray.length; j++) {
        // Look for embedded image XObjects
        if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
          const objId = ops.argsArray[j][0];

          await new Promise<void>((resolve) => {
            page.objs.get(objId, (img: any) => {
              if (img && img.width > 50 && img.height > 50 && img.data) {
                try {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');

                  if (ctx) {
                    let clamped: Uint8ClampedArray;

                    if (img.kind === 3 && img.data.length === img.width * img.height * 4) {
                      // RGBA 32-bit
                      clamped = new Uint8ClampedArray(img.data);
                    } else if (img.kind === 2 && img.data.length === img.width * img.height * 3) {
                      // RGB 24-bit -> convert to RGBA
                      clamped = new Uint8ClampedArray(img.width * img.height * 4);
                      for (let k = 0, p = 0; k < img.data.length; k += 3, p += 4) {
                        clamped[p] = img.data[k];
                        clamped[p + 1] = img.data[k + 1];
                        clamped[p + 2] = img.data[k + 2];
                        clamped[p + 3] = 255;
                      }
                    } else if (img.kind === 1 && img.data.length === img.width * img.height) {
                      // Grayscale 8-bit -> convert to RGBA
                      clamped = new Uint8ClampedArray(img.width * img.height * 4);
                      for (let k = 0, p = 0; k < img.data.length; k++, p += 4) {
                        const g = img.data[k];
                        clamped[p] = g;
                        clamped[p + 1] = g;
                        clamped[p + 2] = g;
                        clamped[p + 3] = 255;
                      }
                    } else {
                      clamped = new Uint8ClampedArray(img.data);
                    }

                    const imgData = ctx.createImageData(img.width, img.height);
                    imgData.data.set(clamped);
                    ctx.putImageData(imgData, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

                    extractedImages.push({
                      dataUrl,
                      width: img.width,
                      height: img.height,
                      area: img.width * img.height,
                    });
                  }
                } catch (canvasErr) {
                  console.error('Error drawing image onto canvas:', canvasErr);
                }
              }
              resolve();
            });
          });
        }
      }
    }

    // Sort by largest resolution area to pick the actual scene/complaint photo
    if (extractedImages.length > 0) {
      extractedImages.sort((a, b) => b.area - a.area);
      return extractedImages[0].dataUrl;
    }
  } catch (err) {
    console.error('Error in extractImageFromPdf with pdfjs-dist:', err);
  }

  // Fallback: Scan raw JPEG streams
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.length - 3; i++) {
      if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8 && bytes[i + 2] === 0xFF) {
        for (let j = i + 3; j < bytes.length - 1; j++) {
          if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
            const length = j + 2 - i;
            if (length > 10240) {
              const blob = new Blob([bytes.slice(i, j + 2)], { type: 'image/jpeg' });
              return await blobToDataUrl(blob);
            }
            i = j + 2;
            break;
          }
        }
      }
    }
  } catch {}

  // DO NOT return any fake or sample image!
  return '';
}

export function normalizeThaiPdfText(text: string): string {
  return text
    // Replace Thai Private Use Area (PUA) characters with standard Thai Unicode
    .replace(/\uF700/g, '\u0E10') // ฐ
    .replace(/\uF701/g, '\u0E14') // ฎ
    .replace(/\uF705/g, '\u0E34') // สระอิ
    .replace(/\uF706/g, '\u0E35') // สระอี
    .replace(/\uF707/g, '\u0E36') // สระอึ
    .replace(/\uF708/g, '\u0E37') // สระอือ
    .replace(/\uF70A/g, '\u0E48') // ไม้เอก
    .replace(/\uF70B/g, '\u0E49') // ไม้โท
    .replace(/\uF70C/g, '\u0E4A') // ไม้ตรี
    .replace(/\uF70D/g, '\u0E4B') // ไม้จัตวา
    .replace(/\uF70E/g, '\u0E4C') // การันต์
    .replace(/\uF710/g, '\u0E31') // ไม้หันอากาศ
    .replace(/\uF711/g, '\u0E34')
    .replace(/\uF712/g, '\u0E35')
    .replace(/\uF713/g, '\u0E48')
    .replace(/\uF714/g, '\u0E49')
    .replace(/\u0E4D\u0E32/g, '\u0E33') // นิคหิต + สระอา -> สระอำ
    .replace(/ต\s*ํา/g, 'ตำ')
    .replace(/อ\s*ํา/g, 'อำ')
    .replace(/ส\s*ํา/g, 'สำ')
    .replace(/ช\s*ํา/g, 'ชำ')
    .replace(/ค\s*ํา/g, 'คำ')
    .replace(/บ\s*ํา/g, 'บำ')
    .replace(/ไฟฟ\u0E35าสาธารณะ/g, 'ไฟฟ้าสาธารณะ')
    .replace(/ไฟฟ\u0E49าสาธารณะ/g, 'ไฟฟ้าสาธารณะ');
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const allLines: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Group items by vertical position (Y coordinate in transform[5])
      // This reconstructs exact lines without breaking syllables or spaces
      let currentY: number | null = null;
      let currentLine = '';

      textContent.items.forEach((item: any) => {
        if (!item.str && item.str !== ' ') return;
        const y = item.transform ? Math.round(item.transform[5]) : null;

        if (currentY === null || (y !== null && Math.abs(y - currentY) > 4)) {
          if (currentLine.trim()) {
            allLines.push(currentLine.trim());
          }
          currentY = y;
          currentLine = item.str;
        } else {
          currentLine += item.str;
        }
      });

      if (currentLine.trim()) {
        allLines.push(currentLine.trim());
      }
    }

    if (allLines.length > 0) {
      const fullText = normalizeThaiPdfText(allLines.join('\n'));
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs-dist text extraction error:', err);
  }

  return '';
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
