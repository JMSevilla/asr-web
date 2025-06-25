export const formatResourceExternalLink = (url: string) => {
  const urlObj = new URL(url);
  if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname.includes('/embed')) {
    return `https://www.youtube.com/watch?v=${urlObj.pathname.replace('/embed/', '')}`;
  }
  return url;
};
