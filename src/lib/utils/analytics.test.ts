import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetModules();
});

describe('analytics events', () => {
	it('adds the traffic-quality flag to custom events', async () => {
		const gtag = vi.fn();
		vi.stubGlobal('window', { gtag });
		vi.stubGlobal('navigator', { webdriver: false, userAgent: 'Mozilla/5.0' });

		const { trackAnalyticsEvent } = await import('./analytics');
		trackAnalyticsEvent('affiliate_click', {
			placement: 'tool_recommendations',
			transport_type: 'beacon'
		});

		expect(gtag).toHaveBeenCalledWith('event', 'affiliate_click', {
			placement: 'tool_recommendations',
			transport_type: 'beacon',
			automated: 0
		});
	});

	it('keeps the existing tools_usage event contract', async () => {
		const gtag = vi.fn();
		vi.stubGlobal('window', { gtag });
		vi.stubGlobal('navigator', { webdriver: true, userAgent: 'Mozilla/5.0' });

		const { trackToolsUsageEvent } = await import('./analytics');
		trackToolsUsageEvent('compression', 'related_tool_click', {
			target_tool: '/encoding-decoding'
		});

		expect(gtag).toHaveBeenCalledWith('event', 'tools_usage', {
			tool_name: 'compression',
			event_name: 'related_tool_click',
			target_tool: '/encoding-decoding',
			automated: 1
		});
	});
});
