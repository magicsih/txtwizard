import { t } from 'svelte-i18n';

		name="description"
		content="Merge multiple text strings into one. Easy-to-use online text merger tool."
		name="keywords"
		content="merge text, combine text, text merger, online text, combine strings"
<h2>{$t('merge-text')} {$t('tool')}</h2>
	let textInputs: string[] = ['',''];
	let mergedText: string = '';
	const handleInputChange = (index: number, event: Event) => {
		const target = event.target as HTMLTextAreaElement;
		textInputs[index] = target.value;
		
	};

	const mergeText = () => {
		mergedText = textInputs.join('');
	};


	<!-- Input Text Areas -->
	<div class="input-areas">
		{#each textInputs as input, index}
			<div class="form-group">
				<label for="input-{index}">{$t('text')} {index + 1}</label>
				<textarea
					id="input-{index}"
					bind:value={input}
					on:input={(event) => handleInputChange(index, event)}
					rows="4"
					placeholder="{$t('enter-text')}"
				></textarea>
			</div>
		{/each}
	</div>

	<!-- Merge Button -->
	<div class="form-group">
		<button on:click={mergeText}>{$t('merge-button')}</button>
	</div>
	<!-- Merged Text Output -->
	<div class="form-group">
		<label for="mergedText">{$t('merged-text')}</label>
		<textarea id="mergedText" bind:value={mergedText} rows="4" readonly placeholder="Merged text will appear here"></textarea>
	</div>
.input-areas {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}
