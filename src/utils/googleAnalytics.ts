type GtagCommand = 'js' | 'config' | 'event';
type GtagParams = Record<string, unknown>;
type GtagFunction = (
  command: GtagCommand,
  target: Date | string,
  params?: GtagParams
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

const isBrowser = () => typeof window !== 'undefined';

export const isGoogleAnalyticsEnabled = () => Boolean(GA_MEASUREMENT_ID);

const isDebugMode = () => {
  if (!isBrowser()) return false;

  const params = new URLSearchParams(window.location.search);
  return (
    params.get('ga_debug') === 'true' ||
    window.localStorage.getItem('ga_debug') === 'true'
  );
};

const getDebugParams = (): GtagParams => (
  isDebugMode() ? { debug_mode: true } : {}
);

export const initGoogleAnalytics = () => {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) return;

  if (isDebugMode()) {
    window.gtag('config', GA_MEASUREMENT_ID, getDebugParams());
  }
};

export const trackGaPageView = (path: string, title?: string) => {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
    ...getDebugParams(),
  });
};

export const trackGaEvent = (eventName: string, params: GtagParams = {}) => {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, {
    ...params,
    ...getDebugParams(),
  });
};

export const trackViewProperty = (params: {
  property_id: string | number;
  property_title?: string;
  property_type?: string;
  operation_type?: string;
  value?: number;
  currency?: string;
}) => {
  trackGaEvent('view_property', params);
};

export const trackGenerateLead = (params: {
  lead_type?: string;
  property_id?: string | number;
  property_title?: string;
}) => {
  trackGaEvent('generate_lead', params);
};

export const trackClickWhatsApp = (params: {
  location: string;
  property_id?: string | number;
  property_title?: string;
}) => {
  trackGaEvent('click_whatsapp', params);
};
