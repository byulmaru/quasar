<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import type { AccountSession } from '$lib/types/session';

	const user = getContext<Writable<AccountSession | undefined>>('user');

	const {
		elements: { menu, item, trigger },
	} = createDropdownMenu({});
</script>

<nav class="flex bb:1|gray-10 bg:white justify-content:center w:100%">
	<div class="flex align-items:center gap:24 h:48 max-w:1200 w:100%">
		<a class="background-color:gray-10:hover font-weight:bold p:16" href="/">
			Quasar
		</a>
		<div class="flex:1"></div>
		{#if $user}
			<button class="min-width:140 background-color:gray-10:hover p:16" use:melt={$trigger}>
				{$user.name}
			</button>
			<div use:melt={$menu} class="width:140 bg:white top:3rem! display:flex flex-direction:column align-items:center border-radius:0|0|5|5 box-shadow:2|2|3|#c7c7c722">
				<div use:melt={$item} class="padding:10 width:140 text-align:center bg:rgb(239|238|240):hover">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#">프로필</a>
				</div>
				<div use:melt={$item} class="padding:10 width:140 text-align:center bg:rgb(239|238|240):hover">
					<form action="/logout" method="post">
						<button type="submit">로그아웃</button>
					</form>
				</div>
			</div>
		{:else}
			<a href="/login">로그인</a>
		{/if}
	</div>
</nav>