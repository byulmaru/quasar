<script lang="ts">
	export let data;
</script>

<div>
	<h1>{data.account.name}</h1>
	<img
		alt={`${data.account.name} 의 프로필 이미지`}
		src={data.account.avatarUrl}
	/>
</div>
