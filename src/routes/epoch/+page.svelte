<script lang="ts">
	import { t } from 'svelte-i18n';

	let targetDate: Date | null = new Date();
	let epochValue: number | null = null;
	let dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	let errorMessage = '';

	function updateEpoch() {
		errorMessage = '';
		let timestamp: number;
		console.log('targetDate', targetDate);
		console.log('targetDate type', typeof targetDate);

		if (targetDate) {
			const date = new Date(targetDate);
			console.log('date', date);

			timestamp = date.getTime();
			console.log('timestamp', timestamp);

			const epochValueTemp = Math.floor(timestamp / 1000);
			console.log('epochValueTemp', epochValueTemp);

			// Check if the result is a valid number
			if (Number.isNaN(epochValueTemp)) {
				console.error('epochValueTemp is NaN');
				errorMessage = 'Invalid Date';
				epochValue = null;
			} else {
				console.log('epochValueTemp is valid');
				epochValue = epochValueTemp;
			}

			//epochValue = epochValueTemp;

			console.log('epochValue', epochValue);
		} else {
			epochValue = null;
		}
	}

	// Trigger the function initially and whenever targetDate changes
	$: updateEpoch();


	//$: {
	//	  console.log('targetDate', targetDate)
	//	  //updateEpoch();
	//}
</script>

<head>
	<title>TxtWizard | Epoch Converter</title>
	<meta name="keywords" content="epoch, converter, unix timestamp, date, time" />
	<meta name="description" content="Epoch Converter, convert date and time to Unix timestamp" />
</head>

<h2>{$t('epoch')} {$t('tool')}</h2>

<div class="container">
	<div class="form-group">
		<label for="dateTime">{$t('date-time')}</label>
		<input type="datetime-local" id="dateTime" bind:value={targetDate} />
	</div>

	<div class="form-group">
		<label for="result">{$t('result')}</label>
		<input type="text" id="result" value={epochValue === null ? '' : epochValue} readonly />
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
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
		font-weight: bold;
		display: block;
		margin-bottom: 8px;
	}

	input,button {
		width: 100%;
		padding: 10px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		cursor: pointer;
	}

	input[readonly] {
		background-color: #f0f0f0;
	}

	.error {
		color: red;
		margin-top: 5px;
	}
</style>
