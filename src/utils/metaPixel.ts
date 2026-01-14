type FbqFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

export const trackPageView = () => {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !window.fbq) return;
  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
};
