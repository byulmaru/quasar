<script lang="ts">
    import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import TextArea from '$lib/components/TextArea.svelte';

	const { data } = $props();

	const superform = superForm(data.form);

	//TODO: 자기 자신일 때만
	const myBox = true
</script>

<div
	class="flex background:white border-radius:5 flex-direction:column gap:10 padding:10 width:100%"
>
	<div>
		<h1>{data.box.name}</h1>
		<div>{data.box.description}</div>
		{#if myBox}
		<div><a href={`${$page.params.slug}/manage`}>질문상자 관리</a></div>
		{/if}
	</div>

	<form method="POST" use:superform.enhance>
		<TextArea name="question" {superform} />
		<button type="submit">질문하기</button>
	</form>
</div>
