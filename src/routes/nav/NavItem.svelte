<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import type { MeltElement } from '@melt-ui/svelte/internal/helpers';

	export let tag: 'a' | 'button' = 'button';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let meltElement: MeltElement<any, any, any, any> | null = null;

	export { meltElement as melt };
</script>

<svelte:element
	this={tag}
	{...$$restProps}
	class={`background-color:gray-10:hover p:16 ${$$props.class}`}
	use:melt={meltElement}
>
	<slot />
</svelte:element>
