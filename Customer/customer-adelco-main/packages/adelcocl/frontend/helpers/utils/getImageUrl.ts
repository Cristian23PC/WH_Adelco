export const getImageUrl = (
  url: string,
  size: 'medium' | 'large' = 'medium'
) => {
  const imageFormats = ['.png', '.jpg', '.jpeg', '.webp'];
  const imageFormat = imageFormats.find((format) => url.endsWith(format));

  if (!imageFormat) {
    return url;
  }

  return url.replace(imageFormat, `-${size}${imageFormat}`);
};
