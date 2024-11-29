<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';

	type Props = {
		name: string;
		label?: string;
		description?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		superform?: SuperForm<any>;
	};

	let { name, label, description, superform }: Props = $props();
	const { form, errors } = superform ?? {};
</script>

<div>
	<label>
		{label}
		<textarea
			{name}
			class="border:1 width:100%"
			aria-invalid={$errors?.[name] ? 'true' : undefined}
			bind:value={$form[name]}
		></textarea>
		{#if $errors?.[name]}
			<p class="color:red font:.75em" aria-live="assertive" role="alert">
				{$errors[name]}
			</p>
		{/if}
		{#if description}
			<p class="color:#666 font:.75em">{description}</p>
		{/if}
	</label>
</div>
