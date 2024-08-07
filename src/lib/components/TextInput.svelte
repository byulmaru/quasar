<script lang="ts">
	export let name: string;
	export let value: HTMLInputElement['value'] | undefined = undefined;

	const id = name ? `form-input-${name}` : null;
</script>

<input
	{...$$restProps}
	{id}
	{name}
	class="block b:1|gray-20 p:8 w:100%"
	bind:value
/>
