const isAbsoluteURL = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export const urlUtils = {
  isAbsoluteURL,
  isValidUrl,
};
