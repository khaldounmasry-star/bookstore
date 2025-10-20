export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);

    if (!/^https?:$/.test(parsed.protocol)) return false;

    const host = parsed.hostname.toLowerCase();
    const allowedDomains = [
      'picsum.photos',
      'unsplash.com',
      'images.unsplash.com',
      'cdn.',
      'static.',
      'placekitten.com',
      'placebear.com'
    ];

    if (allowedDomains.some(domain => host.includes(domain))) return true;

    if (/\/(img|image|photo|pic|media)\//i.test(parsed.pathname)) return true;

    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(parsed.pathname)) return true;

    return false;
  } catch {
    return false;
  }
};
