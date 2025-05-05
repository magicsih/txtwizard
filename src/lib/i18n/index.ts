// place files you want to import through the `$lib` alias in this folder.
import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('ko', () => import('./locales/ko.json'));
register('de', () => import('./locales/de.json'));
register('es', () => import('./locales/es.json'));
register('fr', () => import('./locales/fr.json'));
register('hi', () => import('./locales/hi.json'));
register('it', () => import('./locales/it.json'));
register('ja', () => import('./locales/ja.json'));
register('nl', () => import('./locales/nl.json'));
register('pl', () => import('./locales/pl.json'));
register('pt', () => import('./locales/pt.json'));
register('ru', () => import('./locales/ru.json'));
register('tr', () => import('./locales/tr.json'));
register('zh', () => import('./locales/zh.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
