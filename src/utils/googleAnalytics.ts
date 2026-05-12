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

/** Evita doble bootstrap (p. ej. React Strict Mode) y doble inserción de script. */
let gaBootstrapDone = false;

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

const logGa = (message: string) => {
  if (import.meta.env.DEV || isDebugMode()) {
    console.debug(`[GA] ${message}`);
  }
};

const hasGtagLoaderScript = (measurementId: string): boolean => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[src*="googletagmanager.com/gtag/js"]'
  );
  for (const s of scripts) {
    if (s.src.includes(encodeURIComponent(measurementId)) || s.src.includes(measurementId)) {
      return true;
    }
  }
  return false;
};

const ensureGtagQueue = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // Patrón oficial: la cola recibe el objeto `arguments` de cada llamada.
      window.dataLayer!.push(arguments);
    } as GtagFunction;
  }
};

/**
 * Carga gtag/js si falta, inicializa dataLayer/gtag y envía un único config inicial
 * (page_path + page_title). Idempotente por flag de módulo y por script existente.
 */
export const ensureGoogleAnalytics = () => {
  if (!isBrowser() || !GA_MEASUREMENT_ID) return;

  if (gaBootstrapDone) return;
  gaBootstrapDone = true;

  ensureGtagQueue();

  const id = GA_MEASUREMENT_ID;
  if (!hasGtagLoaderScript(id)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
    logGa('inserted gtag/js loader');
  } else {
    logGa('gtag/js already present, skipping insert');
  }

  window.gtag!('js', new Date());

  const pagePath = `${window.location.pathname}${window.location.search}`;
  window.gtag!('config', id, {
    page_path: pagePath,
    page_title: document.title,
    ...getDebugParams(),
  });

  logGa('initial config sent');
};

export const initGoogleAnalytics = () => {
  ensureGoogleAnalytics();
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
