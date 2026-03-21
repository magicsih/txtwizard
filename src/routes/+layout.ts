import '$lib/i18n'; // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import buildInfo from '../build-info.json';
import { browser } from '$app/environment';

export const load: LayoutLoad = async () => {
	locale.set(browser ? window.navigator.language : 'en');
	await waitLocale();
	return {
		buildInfo
	};
};

export const prerender = true;
