/**
 * Client-Side Image Compressor using HTML5 Canvas
 * Reduces 5-10 MB smartphone photos down to ~150-250 KB
 * Preserves crisp text on street signs and street poles.
 */
export async function compressImage(file: File, maxDimension: number = 1600, quality: number = 0.8): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG with quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);

        resolve({ dataUrl, sizeKb });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
