<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { dataValidation } from '$lib/validation';

	let lastSucceedInstance: string;
	let instance = '';

	onMount(() => {
		lastSucceedInstance =
			localStorage.getItem('lastSucceedInstance') || 'planet.moe';
	});

	async function loginWithMastodon() {
		instance ||= lastSucceedInstance;
		const parseResult = dataValidation.instance.safeParse(instance);

		if (parseResult.success) {
			instance = parseResult.data;
		} else {
			return;
		}

		await goto(`/login/mastodon/${instance}`);
	}
</script>

<Card>
	<h1>로그인</h1>
	<InputField
		name="instance"
		inputmode="url"
		label="서버 주소"
		placeholder={lastSucceedInstance}
		bind:value={instance}
	/>
	<div class="flex gap:8">
		<Button
			class="bg:#6364FF bg:#563ACC:hover color:white flex:1"
			theme="none"
			on:click={loginWithMastodon}
		>
			Mastodon으로 로그인
		</Button>
		<!-- <Button class="flex:1" theme="secondary">Misskey로 로그인</Button> -->
	</div>
</Card>
