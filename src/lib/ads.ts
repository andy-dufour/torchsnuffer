const ENABLE_ADS = false;

let adsLoaded = false;

export function loadAdSense() {
  if (!ENABLE_ADS || adsLoaded) return;
  adsLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

export function isAdsEnabled(): boolean {
  return ENABLE_ADS;
}
