<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import type { AccountSession } from '$lib/types/session';

	const user = getContext<Writable<AccountSession>>('user');

	const {
		elements: { menu, item, trigger },
	} = createDropdownMenu({});
</script>

<nav class="flex bb:1|gray-10 bg:white justify-content:center w:100%">
	<div
		class="flex align-items:center background-color:gray-10>a:hover background-color:gray-10>button:hover gap:24 h:48 max-w:1200 p:16>a p:16>button w:100%"
	>
		<a class="font-weight:bold" href="/">Quasar</a>
		<div class="flex:1"></div>
		{#if $user}
			<button use:melt={$trigger}>{$user.name}</button>
			<div use:melt={$menu}>
				<div use:melt={$item}>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#">프로필</a>
				</div>
				<div use:melt={$item}>
					<a href="/login">로그아웃</a>
				</div>
			</div>
		{:else}
			<a href="/login">로그인</a>
		{/if}
	</div>
</nav>
