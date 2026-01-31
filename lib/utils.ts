export const BASE_PATH = '';

export const getBasePath = () => {
  return BASE_PATH;
};

export const getImagePath = (src: string) => {
  if (src.startsWith('http')) return src;
  // Ensure src starts with /
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
  return normalizedSrc;
};
