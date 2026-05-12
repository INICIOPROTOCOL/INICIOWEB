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
let gaLoaderPromise: Promise<void> | null = null;

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

/** Logs estructurados solo en DEV o con ?ga_debug=true / localStorage ga_debug. Sin PII. */
const gaDiag = (phase: string, detail: Record<string, unknown> = {}) => {
  if (!import.meta.env.DEV && !isDebugMode()) return;
  console.debug('[ga-diag]', phase, detail);
};

const logGa = (message: string) => {
  if (import.meta.env.DEV || isDebugMode()) {
    console.debug(`[GA] ${message}`);
  }
};

const getGtagLoaderScript = (measurementId: string): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[src*="googletagmanager.com/gtag/js"]'
  );
  for (const s of scripts) {
    if (s.src.includes(encodeURIComponent(measurementId)) || s.src.includes(measurementId)) {
      return s;
    }
  }
  return null;
};

const ensureGtagQueue = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      // Equivalente al snippet oficial (arguments): un elemento por invocación, array-like.
      window.dataLayer!.push(args);
    } as GtagFunction;
  }
};

const loadGtagScript = (measurementId: string): Promise<void> => {
  if (gaLoaderPromise) return gaLoaderPromise;

  gaLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = getGtagLoaderScript(measurementId);
    if (existingScript?.dataset.loaded === 'true') {
      logGa('gtag/js already loaded');
      resolve();
      return;
    }

    const script = existingScript || document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => {
      script.dataset.loaded = 'true';
      logGa('gtag/js loader loaded');
      resolve();
    };
    script.onerror = () => {
      gaLoaderPromise = null;
      gaBootstrapDone = false;
      gaDiag('gtag/js loader error', { measurementId });
      reject(new Error('Failed to load gtag/js'));
    };

    if (!existingScript) {
      document.head.appendChild(script);
      logGa('inserted gtag/js loader');
    } else {
      logGa('gtag/js already present, waiting for load');
    }
  });

  return gaLoaderPromise;
};

/**
 * Carga gtag/js si falta, inicializa dataLayer/gtag y envía un único config inicial
 * (page_path + page_title). Idempotente por flag de módulo y por script existente.
 */
export const ensureGoogleAnalytics = () => {
  gaDiag('ensureGoogleAnalytics called', {
    hasBrowser: isBrowser(),
    hasMeasurementId: Boolean(GA_MEASUREMENT_ID),
    gtagBeforeQueue: isBrowser() ? typeof window.gtag : 'n/a',
  });

  if (!isBrowser() || !GA_MEASUREMENT_ID) {
    gaDiag('ensureGoogleAnalytics exit', { reason: !isBrowser() ? 'no_browser' : 'no_measurement_id' });
    return;
  }

  if (gaBootstrapDone) {
    gaDiag('ensureGoogleAnalytics exit', { reason: 'already_bootstrapped' });
    return;
  }
  gaBootstrapDone = true;

  ensureGtagQueue();

  const id = GA_MEASUREMENT_ID;
  gaDiag('ensureGoogleAnalytics bootstrap', {
    measurementId: id,
    gtagAfterQueue: typeof window.gtag,
  });

  loadGtagScript(id)
    .then(() => {
      window.gtag!('js', new Date());

      const pagePath = `${window.location.pathname}${window.location.search}`;
      window.gtag!('config', id, {
        page_path: pagePath,
        page_title: document.title,
        ...getDebugParams(),
      });

      logGa('initial config sent');
      gaDiag('ensureGoogleAnalytics gtag config dispatched', {
        measurementId: id,
        gtagExists: typeof window.gtag === 'function',
        debugMode: isDebugMode(),
        pagePathLength: pagePath.length,
        hasSearch: window.location.search.length > 0,
      });
    })
    .catch((error) => {
      gaDiag('ensureGoogleAnalytics loader failed', {
        measurementId: id,
        message: error instanceof Error ? error.message : String(error),
      });
    });
};

export const initGoogleAnalytics = () => {
  ensureGoogleAnalytics();
};

export const trackGaPageView = (path: string, title?: string) => {
  gaDiag('trackGaPageView called', {
    pathLength: path.length,
    hasSearch: path.includes('?'),
    hasGtag: isBrowser() && typeof window.gtag === 'function',
    hasMeasurementId: Boolean(GA_MEASUREMENT_ID),
  });

  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) {
    gaDiag('trackGaPageView exit', {
      reason: !isBrowser()
        ? 'no_browser'
        : !GA_MEASUREMENT_ID
          ? 'no_measurement_id'
          : 'no_gtag',
    });
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
    ...getDebugParams(),
  });

  gaDiag('trackGaPageView gtag config dispatched', {
    measurementId: GA_MEASUREMENT_ID,
    gtagExists: true,
    debugMode: isDebugMode(),
  });
};

export const trackGaEvent = (eventName: string, params: GtagParams = {}) => {
  gaDiag('trackGaEvent called', {
    eventName,
    paramKeyCount: Object.keys(params).length,
    hasGtag: isBrowser() && typeof window.gtag === 'function',
    hasMeasurementId: Boolean(GA_MEASUREMENT_ID),
  });

  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) {
    gaDiag('trackGaEvent exit', {
      eventName,
      reason: !isBrowser()
        ? 'no_browser'
        : !GA_MEASUREMENT_ID
          ? 'no_measurement_id'
          : 'no_gtag',
    });
    return;
  }

  window.gtag('event', eventName, {
    ...params,
    ...getDebugParams(),
  });

  gaDiag('trackGaEvent gtag event dispatched', {
    eventName,
    measurementId: GA_MEASUREMENT_ID,
    gtagExists: true,
    debugMode: isDebugMode(),
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
