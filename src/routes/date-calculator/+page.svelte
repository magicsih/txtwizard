<script lang="ts">
	import { t } from 'svelte-i18n';

	let startDate = '';
	let endDate = '';
	let dayDifference = 0;

	let baseDate = '';
	let daysToAdd = 0;
	let calculatedDate = '';

	function calculateDateDifference() {
		const start = new Date(startDate);
		const end = new Date(endDate);

		// Check if the dates are valid
		 if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            dayDifference = 0;
            alert( $t('invalid_date_format') );
            return;  // Exit the function if the date is invalid
        }

		const diffInMs = Math.abs(end.getTime() - start.getTime());
		dayDifference = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
	}

	function addOrSubtractDays() {
		const base = new Date(baseDate);

		// Check if the date is valid
        if (isNaN(base.getTime())) {
            calculatedDate = '';
            alert( $t('invalid_date_format') );
            return;  // Exit if the date is invalid
        }

		const newDate = new Date(base);
		newDate.setDate(base.getDate() + daysToAdd);

		calculatedDate = newDate.toISOString().slice(0, 10);
	}
</script>

<head>
	<title>TxtWizard | Date Calculator Tool</title>
	<meta
		name="description"
		content="Free online Date Calculator tool. Calculate the number of days between two dates or add/subtract days from a date."
	/>
</head>

<header>
	<h1>{$t('date-calculator')} {$t('tool')}</h1>
</header>

<main>
	<section class="container" aria-label="Date Calculator Tool">
		<!-- Date Difference Calculator -->
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

		<!-- Add/Subtract Days from a Date -->
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

