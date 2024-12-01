<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { dataValidation } from '$lib/validation';

	let { data } = $props();

	const superform = superForm(data.form);
	let { form } = superform;

	let lastSucceedInstance = $state('');

	onMount(() => {
		lastSucceedInstance =
			localStorage.getItem('lastSucceedInstance') || 'planet.moe';
	});

	async function loginWithMastodon() {
		$form.instance ||= lastSucceedInstance;
		const parseResult = dataValidation.instance.safeParse($form.instance);

		if (parseResult.success) {
			$form.instance = parseResult.data;
		} else {
			return;
		}

		await goto(`/login/mastodon/${$form.instance}`);
	}
</script>

<Card>
	<h1>로그인</h1>
	<InputField
		name="instance"
		inputmode="url"
		label="서버 주소"
		placeholder={lastSucceedInstance}
		{superform}
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
