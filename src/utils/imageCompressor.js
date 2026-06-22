export const compressImage = (file, maxSizeMB = 1) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxWidth = 1200;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.8;
      const compress = () => {
        canvas.toBlob((blob) => {
          if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compress();
          } else {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, 'image/jpeg', quality);
      };
      compress();
    };

    img.src = URL.createObjectURL(file);
  });
};