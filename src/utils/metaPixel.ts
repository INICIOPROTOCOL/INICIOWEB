type FbqFunction = (...args: unknown[]) => void;
type FbqOptions = { eventID?: string };

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

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
