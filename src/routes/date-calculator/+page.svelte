<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from 'svelte-i18n';
	import {
		addOrSubtractDays as calculateShiftedDate,
		calculateDateDifference as getDateDifference
	} from '$lib/utils/date-calculator';

	let startDate = '';
	let endDate = '';
	let dayDifference = 0;

	let baseDate = '';
	let daysToAdd = 0;
	let calculatedDate = '';

	function calculateDateDifference() {
		const result = getDateDifference(startDate, endDate);
		if (result === null) {
			dayDifference = 0;
			alert($t('invalid_date_format'));
			return;
		}

		dayDifference = result;
	}

	function addOrSubtractDays() {
		const result = calculateShiftedDate(baseDate, daysToAdd);
		if (result === null) {
			calculatedDate = '';
			alert($t('invalid_date_format'));
			return;
		}

		calculatedDate = result;
	}

	const pageTitle = 'TxtWizard | Date Calculator Tool';
	const pageDescription =
		'Calculate day differences between dates or add and subtract days from a selected date in your browser.';
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/date-calculator" />

<header>
	<h1>{$t('date-calculator')} {$t('tool')}</h1>
</header>

<main>
	<section class="container" aria-label="Date Calculator Tool">
		<div class="tab">
			<h2>{$t('date_difference')}</h2>
			<div class="form-group">
				<label for="startDate">{$t('start_date')}</label>
				<input type="date" id="startDate" bind:value={startDate} />
			</div>
			<div class="form-group">
				<label for="endDate">{$t('end_date')}</label>
				<input type="date" id="endDate" bind:value={endDate} />
			</div>
			<button on:click={calculateDateDifference}>{$t('calculate_difference')}</button>
			{#if dayDifference}
				<div class="result">
					{$t('difference_is')} {dayDifference} {$t('days')}
				</div>
			{/if}
		</div>

		<div class="tab">
			<h2>{$t('add_subtract_days')}</h2>
			<div class="form-group">
				<label for="baseDate">{$t('base_date')}</label>
				<input type="date" id="baseDate" bind:value={baseDate} />
			</div>
			<div class="form-group">
				<label for="daysToAdd">{$t('days_to_add')}</label>
				<input type="number" id="daysToAdd" bind:value={daysToAdd} />
			</div>
			<button on:click={addOrSubtractDays}>{$t('calculate_new_date')}</button>
			{#if calculatedDate}
				<div class="result">
					{$t('calculated_date_is')} {calculatedDate}
				</div>
			{/if}
		</div>
	</section>
</main>

<style>
	.container {
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.tab {
		margin-bottom: 20px;
		padding: 15px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: #fff;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}

	input[type='date'],
	input[type='number'] {
		width: 100%;
		padding: 8px;
		font-size: 1em;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	button {
		background-color: #4caf50;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1em;
	}

	button:hover {
		background-color: #3e8e41;
	}

	.result {
		margin-top: 15px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f0f0f0;
		font-weight: bold;
	}
</style>
