<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import type { Accounts, Boxes } from '$lib/database/schema';

	type Props = {
		account: typeof Accounts.$inferSelect | undefined;
		boxes: (typeof Boxes.$inferSelect)[] | undefined;
	};

	const { account, boxes }: Props = $props();

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
		{#if account}
			<button
				class="background-color:gray-10:hover min-width:140 p:16"
				use:melt={$trigger}
			>
				{account.name}
			</button>
			<div
				class="align-items:center bg:white border-radius:0|0|5|5 box-shadow:2|2|3|#c7c7c722 display:flex flex-direction:column top:3rem! width:140"
				use:melt={$menu}
			>
				{#each boxes! as box}
					<div
						class="bg:rgb(239|238|240):hover padding:10 text-align:center width:140"
						use:melt={$item}
					>
						<a href={`/box/${box.slug}`}>{box.name}</a>
					</div>
				{/each}
				<div
					class="bg:rgb(239|238|240):hover padding:10 text-align:center width:140"
					use:melt={$item}
				>
					<button>새 질문상자 만들기</button>
				</div>
				<div
					class="bg:rgb(239|238|240):hover padding:10 text-align:center width:140"
					use:melt={$item}
				>
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
