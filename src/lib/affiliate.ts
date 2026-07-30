// Amazon Associates configuration.
export const AMAZON_TAG = 'txtwizard-20';

// Required by the Amazon Associates Operating Agreement — this exact phrase
// must stay visible near affiliate links.
export const AMAZON_DISCLOSURE =
	'As an Amazon Associate, TxtWizard earns from qualifying purchases.';

// Build an Amazon link that carries the affiliate tag.
//
// Search links work immediately and need no product ASIN. For higher
// conversion, replace an item's `url` with a specific product link generated
// from Amazon SiteStripe (it already includes ?tag=txtwizard-20), e.g.
//   https://www.amazon.com/dp/<ASIN>?tag=txtwizard-20
export function amazonSearch(keywords: string): string {
	return `https://www.amazon.com/s?k=${encodeURIComponent(keywords)}&tag=${AMAZON_TAG}`;
}

export type AffiliateItem = {
	label: string;
	url: string;
	note?: string;
};
