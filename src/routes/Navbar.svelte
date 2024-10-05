<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { AccountSession } from '$lib/types/session';

	const user = getContext<Writable<AccountSession>>('user');
</script>

<nav class="flex bb:1|gray-10 bg:white justify-content:center w:100%">
	<div
		class="flex align-items:center background-color:gray-10>a:hover gap:24 h:48 max-w:1200 p:16>a w:100%"
	>
		<a class="font-weight:bold" href="/">Quasar</a>
		<div class="flex:1"></div>
		{#if $user}
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="#">{$user.name}</a>
		{:else}
			<a href="/login">로그인</a>
		{/if}
	</div>
</nav>
