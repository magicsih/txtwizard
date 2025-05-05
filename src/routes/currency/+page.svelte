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
			exchangeRate = data.rates[outputCurrency];
			updateTime = dayjs.unix(data.time_last_updated).format('YYYY-MM-DD HH:mm:ss'); // 유닉스 타임스탬프를 읽기 쉬운 시간으로 변환
			timeAgo = dayjs().to(dayjs.unix(data.time_last_updated)); // 상대적 시간 업데이트
			convertCurrency();
		} catch (error) {
			console.error('Error fetching exchange rate:', error);
		}
	}

	function convertCurrency() {
		outputAmount = (inputAmount * exchangeRate).toFixed(2);
	}

	$: {
		convertCurrency();
	}

	// 일정 시간마다 자동 갱신
	setInterval(() => {
		getExchangeRate();
	}, 60000); // 60초마다 환율 갱신
</script>

<head>
	<title>{$t('currency')} {$t('tool')}</title>
	<meta name="description" content={$t('currency-intro')} />
</head>

<div class="container">
	<h2>{$t('currency')} {$t('tool')}</h2>

	<!-- Input Currency Selection -->
	<div class="form-group">
		<label for="inputCurrency">From Currency</label>
		<select id="inputCurrency" bind:value={inputCurrency} on:change={getExchangeRate}>
			{#each currencies as currency}
				<option value={currency}>{currency}</option>
			{/each}
		</select>
	</div>

	<!-- Output Currency Selection -->
	<div class="form-group">
		<label for="outputCurrency">To Currency</label>
		<select id="outputCurrency" bind:value={outputCurrency} on:change={getExchangeRate}>
			{#each currencies as currency}
				<option value={currency}>{currency}</option>
			{/each}
		</select>
	</div>

	<!-- Input Amount -->
	<div class="form-group">
		<label for="inputAmount">Amount</label>
		<input
			type="number"
			id="inputAmount"
			bind:value={inputAmount}
			on:input={convertCurrency}
			placeholder="Enter amount"
		/>
	</div>

	<!-- Output Amount with Unit Conversion -->
	<div class="form-group">
		<h3>Converted Amount</h3>
		<p>{outputAmount} {outputCurrency} (1 {inputCurrency} = {exchangeRate} {outputCurrency})</p>
	</div>

	<!-- Last Updated with Relative Time -->
	<div class="form-group">
		<h3>Last Updated</h3>
		<p>{updateTime} ({timeAgo})</p>
	</div>
</div>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-weight: bold;
		margin-bottom: 8px;
	}

	input,
	select {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	p {
		font-size: 1.2em;
		margin-top: 10px;
	}
</style>
