<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';

	type Props = {
		name: string;
		label?: string;
		description?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		superform?: SuperForm<any>;
	} & HTMLInputAttributes;

	let { name, label, description, superform, ...restProps }: Props = $props();
	const { form, errors } = superform ?? {};
</script>

<label class="my:8">
	{label}
	<input
		{...restProps}
		{name}
		class="block b:1|gray-20 p:8 w:100%"
		aria-invalid={$errors?.[name] ? 'true' : undefined}
		bind:value={$form[name]}
	/>
	{#if $errors?.[name]}
		<p class="color:red font:.75em">{$errors[name]}</p>
	{/if}
	{#if description}
		<p class="color:#666 font:.75em">{description}</p>
	{/if}
</label>
