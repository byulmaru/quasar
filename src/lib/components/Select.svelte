<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';

	type Props = {
		name: string;
		options: {
			text: string;
			value: string;
		}[];
		label?: string;
		description?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		superform?: SuperForm<any>;
	} & HTMLSelectAttributes;

	let { name, options, label, description, superform, ...restProps }: Props =
		$props();
	const { form, errors } = superform ?? {};
</script>

<label class="my:8">
	{label}
	<select
		{...restProps}
		{name}
		class="block b:1|gray-20 p:8 w:100%"
		aria-invalid={$errors?.[name] ? 'true' : undefined}
		bind:value={$form[name]}
	>
		{#each options as option}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
	{#if $errors?.[name]}
		<p class="color:red font:.75em">{$errors[name]}</p>
	{/if}
	{#if description}
		<p class="color:#666 font:.75em">{description}</p>
	{/if}
</label>
