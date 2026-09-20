// Client-only. Converts any uploaded image to WebP in the browser before it
// ever reaches Supabase storage — smaller files, faster page loads, no
// server-side image processing needed. Downscales oversized images too.
export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export async function convertToWebP(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<File> {
  if (!isImageFile(file)) return file;
  // Browser-native WebP encoding: SVGs won't benefit and animated GIFs would
  // lose their animation, so leave those formats alone.
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fall back to the original rather than failing the upload
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.[^./\\]+$/, "") + ".webp";
            resolve(new File([blob], newName, { type: "image/webp" }));
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
