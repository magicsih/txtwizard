<script lang="ts">
	import { t } from 'svelte-i18n';
	import dayjs from 'dayjs'; // dayjs 추가
	import relativeTime from 'dayjs/plugin/relativeTime'; // 상대 시간 표현을 위한 플러그인 추가
	dayjs.extend(relativeTime); // 플러그인 활성화

	let inputCurrency = 'USD';
	let outputCurrency = 'EUR';
	let inputAmount = 1;
	let outputAmount = '';
	let exchangeRate = 1;
	let updateTime = ''; // 마지막 업데이트된 시간 (유닉스 타임스탬프)
	let timeAgo = ''; // 업데이트된 시간에 대한 상대적 표현

	const currencies = [
		'USD',
		'EUR',
		'KRW',
		'GBP',
		'JPY',
		'CAD',
		'AUD',
		'INR',
		'CNY',
		'AED',
		'AFN',
		'ALL',
		'AMD',
		'AOA',
		'ARS',
		'AZN',
		'BAM',
		'BDT',
		'BGN',
		'BHD',
		'BIF',
		'BND',
		'BOB',
		'BRL',
		'BSD',
		'BTC',
		'CHF',
		'CLP',
		'COP',
		'CZK'
	];

	async function getExchangeRate() {
		try {
			const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${inputCurrency}`);
			const data = await response.json();
			exchangeRate = data.rates[outputCurren