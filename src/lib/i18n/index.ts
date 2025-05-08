// place files you want to import through the `$lib` alias in this folder.
import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('ko', () => import('./locales/ko.json'));
register('es', () => import('./locales/es.json'));
register('fr', () => import('./locales/fr.json'));
register('pt', () => import('./locales/pt.json'));
register('ru', () => import('./locales/ru.json'));
register('zh', () => import('./locales/zh.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
