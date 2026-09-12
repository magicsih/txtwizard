// Central AdSense configuration for manual (in-content) ad units.
//
// The AdSense loader script and the publisher id are already included globally
// in src/app.html. This file only tracks the manual ad-unit *slot ids* so the
// <AdUnit> component can render placed units at high-viewability positions
// instead of relying solely on Auto Ads.
//
// How to fill this in:
//   1. AdSense console > Ads > By ad unit > Display ads.
//   2. Create a "Display ad" (responsive) unit for each placement below.
//   3. Copy the numeric `data-ad-slot` value into the matching entry.
//
// Leave an entry as '' until you have the real slot id. Empty slots render
// nothing in production (no broken/empty <ins>), so it is safe to ship before
// the ids exist.

export const AD_CLIENT = 'ca-pub-9932778305312246';

export const AD_SLOTS = {
	// Shown directly below a tool's result area (highest viewability: users
	// look here right after clicking generate/convert). Reused across tools.
	toolResult: '8839886302',
	// Inline unit on the home page, between the hero and the tool grid.
	// GA4 (30d) shows only ~16% fill rate here because most home visitors
	// scroll past quickly on their way to a tool. Kept for the impressions
	// it does earn; see `homeFooter` for a higher-viewability alternative.
	homeInline: '7526804635',
	// Footer unit on the home page, placed below the full tool grid and
	// above the affiliate box. Users who reach this slot have scrolled past
	// every tool card, which gives much higher viewability than homeInline.
	// TODO: create a responsive Display unit in AdSense and paste its slot id.
	// Until then this renders nothing in production.
	homeFooter: '',
	// Placed inside the long-form explainer copy further down a tool page.
	// Worth having only where visitors actually read: BigQuery shows
	// /compression at ~64s per user and /decryption, /key-generation,
	// /encryption at 25-35s, versus ~8s on the home page.
	// TODO: create a responsive Display unit in AdSense and paste its slot id.
	// Until then this renders nothing in production.
	articleInline: ''
} as const;

export type AdPlacement = keyof typeof AD_SLOTS;

export function getAdSlot(placement: AdPlacement): string {
	return AD_SLOTS[placement] ?? '';
}
