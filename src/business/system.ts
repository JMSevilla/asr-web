export function getUserPlatform() {
  const platform = navigator.platform;
  const userAgent = navigator.userAgent;

  if (/Win/.test(userAgent)) {
    return 'Windows';
  }

  if (/iPhone/.test(userAgent) || /iPad/.test(userAgent) || isIOS() || isIpadOS()) {
    return 'iPhone';
  }

  if (/Mac/.test(userAgent)) {
    return 'Mac';
  }

  if (/Android/.test(userAgent)) {
    return 'Android';
  }

  return platform;
}

export function getUserBrowser() {
  const userAgent = navigator.userAgent;

  if (/Firefox/.test(userAgent)) {
    return 'Firefox';
  }

  if (/Opera/.test(userAgent) || /OPR/.test(userAgent)) {
    return 'Opera';
  }

  if (/Edge/.test(userAgent) || /Edg/.test(userAgent)) {
    return 'Microsoft Edge';
  }

  if (/Chrome/.test(userAgent)) {
    return 'Chrome';
  }

  if (/Safari/.test(userAgent)) {
    return 'Safari';
  }

  if (/Trident/.test(userAgent)) {
    return 'Internet Explorer';
  }

  return 'Unknown';
}

function isIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  } else {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  }
}

function isIpadOS() {
  return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
}
