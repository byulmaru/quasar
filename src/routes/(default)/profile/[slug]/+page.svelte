<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import { page } from '$app/stores';
	export let data;
</script>

<div>
	<h1 class="margin-bottom:1rem">{data.account.name} 님의 프로필</h1>
	<div class="width:100% padding:10 display:flex gap:10 background:white border-radius:5">
		<img
		alt={`${data.account.name} 의 프로필 이미지`}
		src={data.account.avatarUrl}
		class="max-width:256px"
		/>
		<div>
			<h1>{data.account.name}</h1>
			<div>{$page.params.slug}</div>
		</div>
	</div>
</div>
