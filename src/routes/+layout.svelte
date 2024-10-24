<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { ComponentType } from 'svelte';
	import { Fragment } from '@master/css.svelte';
	import type { CSSRuntimeProvider as CSSProviderType } from '@master/css.svelte';
	import { writable } from 'svelte/store';
	import Navbar from './nav/Navbar.svelte';

	import '@master/normal.css';
	import './main.css';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let CSSRuntimeProvider: ComponentType<CSSProviderType> = Fragment as any;

	onMount(async () => {
		CSSRuntimeProvider = (await import('@master/css.svelte'))
			.CSSRuntimeProvider;
	});

	export let data;

	const user = writable();
	$: user.set(data.user);

	setContext('user', user);
</script>

<svelte:component this={CSSRuntimeProvider} config={import('../../master.css')}>
	<Navbar />
	<slot />
</svelte:component>
