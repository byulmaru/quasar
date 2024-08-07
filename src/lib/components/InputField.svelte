<script lang="ts">
	import TextInput from './TextInput.svelte';

	export let name: string;
	export let label: string | undefined = undefined;
	export let value: HTMLInputElement['value'] | undefined = undefined;
	export let description: string | undefined = undefined;
</script>

<div class="my:16">
	{#if label}
		<label class="block mb:4" for={`form-input-${name}`}>{label}</label>
	{/if}
	<TextInput {...$$restProps} {name} bind:value />
	{#if description}
		<p class="color:#666 font:12 mt:4">{description}</p>
	{/if}
</div>
