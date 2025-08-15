import { env } from './env';

type AnyRecord = Record<string, any>;

declare global {
	// eslint-disable-next-line no-var
	var dataLayer: AnyRecord[] | undefined;
	interface Window {
		gtag?: (...args: any[]) => void;
		ym?: (id: number | string, method: string, ...args: any[]) => void;
	}
}

const UTM_STORAGE_KEY = 'texex_utm_params';

export const captureUtmParams = (): void => {
	try {
		const url = new URL(window.location.href);
		const utm: AnyRecord = {};
		['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
			const v = url.searchParams.get(k);
			if (v) utm[k] = v;
		});
		if (Object.keys(utm).length) {
			localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
		}
	} catch {}
};

const getUtmParams = (): AnyRecord => {
	try {
		const raw = localStorage.getItem(UTM_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

export const initAnalytics = (): void => {
	// Capture UTM early
	captureUtmParams();

	// Google Analytics 4
	if (env.GA_ID && !window.gtag) {
		window.dataLayer = window.dataLayer || [];
		function gtag(...args: any[]) {
			window.dataLayer!.push(args);
		}
		window.gtag = gtag as any;
		const s = document.createElement('script');
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtag/js?id=${env.GA_ID}`;
		document.head.appendChild(s);
		gtag('js', new Date());
		gtag('config', env.GA_ID, { send_page_view: true });
	}

	// Yandex Metrika (если ID указан)
	if (env.YM_ID && !(window as any).ym) {
		(function(m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
			m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
			m[i].l = 1 * new Date();
			k = e.createElement(t), a = e.getElementsByTagName(t)[0];
			k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
		})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
		window.ym?.(Number(env.YM_ID), 'init', {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
		});
	}
};

const withUtm = (params: AnyRecord = {}): AnyRecord => ({ ...params, utm: getUtmParams() });

export const track = (eventName: string, params: AnyRecord = {}): void => {
	const payload = withUtm(params);
	if (window.gtag && env.GA_ID) {
		window.gtag('event', eventName, payload);
	}
	if (window.ym && env.YM_ID) {
		window.ym(Number(env.YM_ID), 'reachGoal', eventName, payload);
	}
};

export const trackViewItem = (params: AnyRecord = {}): void => {
	track('view_item', params);
};

export const trackAddToCart = (params: AnyRecord = {}): void => {
	track('add_to_cart', params);
};

export const trackBeginCheckout = (params: AnyRecord = {}): void => {
	track('begin_checkout', params);
};


