// Client-side analytics helpers.
//
// Two jobs:
//   1. Send `tools_usage` custom events (tool_name / event_name + params) to GA4.
//   2. Flag automated (headless / driver-controlled) sessions so they can be
//      segmented out of GA4 reports and excluded from manual ad units.
//
// Why (2): the first week of BigQuery data showed ~44% of users producing zero
// engagement time and zero `user_engagement` events — a single-city, single
// browser, direct-traffic pattern. GA4's built-in IAB bot list did not catch
// it. Detection here is deliberately conservative: only signals that are
// unambiguous for automation are used, so no real visitor gets dropped.
// Cleverly disguised bots will still slip through client-side detection; the
// BigQuery-side engagement filter is the backstop for analysis.

const BOT_UA_PATTERN = /bot|crawl|spider|headless|phantomjs|puppeteer|playwright|selenium/i;

let cachedAutomated: boolean | null = null;

export function isLikelyAutomated(): boolean {
	if (typeof navigator === 'undefined') return false;
	if (cachedAutomated !== null) return cachedAutomated;

	const nav = navigator as Navigator & { webdriver?: boolean };
	cachedAutomated = nav.webdriver === true || BOT_UA_PATTERN.test(nav.userAgent ?? '');

	return cachedAutomated;
}

// Tag the session once so GA4 explorations and BigQuery can segment on it.
// Runs from the root layout on mount.
export function initTrafficQuality() {
	if (typeof window === 'undefined' || !window.gtag) return;

	window.gtag('set', 'user_properties', {
		traffic_quality: isLikelyAutomated() ? 'automated' : 'human'
	});
}

export function trackAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}) {
	if (typeof window === 'undefined' || !window.gtag) return;

	window.gtag('event', eventName, {
		...params,
		automated: isLikelyAutomated() ? 1 : 0
	});
}

export function trackToolsUsageEvent(
	toolName: string,
	eventName: string,
	params: Record<string, unknown> = {}
) {
	trackAnalyticsEvent('tools_usage', {
		tool_name: toolName,
		event_name: eventName,
		...params
	});
}

// Fire at most one event per `wait` ms per key. Used by tools that produce
// results reactively while typing (analyzer, encoding-decoding, jwt) so a
// single edit session does not emit hundreds of events.
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function trackToolsUsageDebounced(
	toolName: string,
	eventName: string,
	params: Record<string, unknown> = {},
	wait = 1500
) {
	if (typeof window === 'undefined') return;

	const key = `${toolName}:${eventName}`;
	const existing = debounceTimers.get(key);
	if (existing) clearTimeout(existing);

	debounceTimers.set(
		key,
		setTimeout(() => {
			debounceTimers.delete(key);
			trackToolsUsageEvent(toolName, eventName, params);
		}, wait)
	);
}
