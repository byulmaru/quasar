<script lang="ts">
	import { onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	import { Fragment } from '@master/css.svelte';
	import type { CSSRuntimeProvider as CSSProviderType } from '@master/css.svelte';

	import '@master/normal.css';
	import './main.css';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let CSSRuntimeProvider: ComponentType<CSSProviderType> = Fragment as any;

	onMount(async () => {
		CSSRuntimeProvider = (await import('@master/css.svelte'))
			.CSSRuntimeProvider;
	});
</script>

<svelte:component this={CSSRuntimeProvider} config={import('../../master.css')}>
	<slot />
</svelte:component>
