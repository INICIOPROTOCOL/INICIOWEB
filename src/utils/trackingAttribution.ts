const TRACKING_STORAGE_KEY = 'inicio_tracking_attribution';

const TRACKING_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const;

export type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

export type TrackingAttribution = Partial<Record<TrackingParamKey, string>> & {
  landing_page?: string;
  referrer?: string;
};

export type LeadTrackingContext = {
  property_id?: string | number | null;
  property_title?: string | null;
  lead_type?: string;
};

export type LeadTrackingPayload = TrackingAttribution & {
  current_page?: string;
  property_id?: string | number;
  property_title?: string;
  lead_type?: string;
};

const isBrowser = () => typeof window !== 'undefined';

const readStoredAttribution = (): TrackingAttribution => {
  if (!isBrowser()) return {};

  try {
    const raw = window.sessionStorage.getItem(TRACKING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStoredAttribution = (attribution: TrackingAttribution) => {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Tracking is useful but should never block core UX.
  }
};

export const captureTrackingAttribution = () => {
  if (!isBrowser()) return;

  const params = new URLSearchParams(window.location.search);
  const trackingParams = TRACKING_PARAM_KEYS.reduce<TrackingAttribution>((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  const hasTrackingParams = Object.keys(trackingParams).length > 0;
  const stored = readStoredAttribution();

  if (!stored.landing_page) {
    stored.landing_page = window.location.href;
  }

  if (!stored.referrer && document.referrer) {
    stored.referrer = document.referrer;
  }

  if (hasTrackingParams) {
    writeStoredAttribution({
      ...stored,
      ...trackingParams,
      landing_page: stored.landing_page || window.location.href,
      referrer: stored.referrer || document.referrer || undefined,
    });
    return;
  }

  if (!readStoredAttribution().landing_page) {
    writeStoredAttribution(stored);
  }
};

export const buildLeadTrackingPayload = (
  context: LeadTrackingContext = {}
): LeadTrackingPayload => {
  if (!isBrowser()) return {};

  const attribution = readStoredAttribution();
  const payload: LeadTrackingPayload = {
    ...attribution,
    current_page: window.location.href,
    landing_page: attribution.landing_page || window.location.href,
    referrer: attribution.referrer || document.referrer || undefined,
  };

  if (context.property_id !== undefined && context.property_id !== null) {
    payload.property_id = context.property_id;
  }

  if (context.property_title) {
    payload.property_title = context.property_title;
  }

  if (context.lead_type) {
    payload.lead_type = context.lead_type;
  }

  return payload;
};
