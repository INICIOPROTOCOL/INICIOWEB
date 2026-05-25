type FbqFunction = (...args: unknown[]) => void;
type FbqOptions = { eventID?: string };

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

let metaPixelInitialized = false;

const isBrowser = () => typeof window !== "undefined";

const isAdminPath = () => (
  isBrowser() && window.location.pathname.startsWith("/admin")
);

/**
 * Initialize Meta Pixel if VITE_META_PIXEL_ID is configured
 * This should be called once in App.tsx or main.tsx
 */
export const initializeMetaPixel = () => {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  
  if (!isBrowser() || isAdminPath() || metaPixelInitialized || window.fbq) {
    return false;
  }

  if (!pixelId) {
    console.debug("Meta Pixel ID not configured, skipping initialization");
    return false;
  }

  metaPixelInitialized = true;

  // Load Meta Pixel script
  const script = document.createElement("script");
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
  `;
  document.head.appendChild(script);

  // Track initial page view
  if (window.fbq) {
    window.fbq("track", "PageView");
  }

  return true;
};

export const trackPageView = () => {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  options?: FbqOptions
) => {
  if (typeof window === "undefined" || !window.fbq) return;
  if (params && options) {
    window.fbq("track", eventName, params, options);
  } else if (options) {
    window.fbq("track", eventName, {}, options);
  } else if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
};

export const createEventId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const getMetaCookies = () => {
  if (typeof document === "undefined") return { fbp: undefined, fbc: undefined };
  const getCookie = (name: string) => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : undefined;
  };
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };
};
