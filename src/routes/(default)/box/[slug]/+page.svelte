<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import TextArea from '$lib/components/TextArea.svelte';

	const { data } = $props();

	const superform = superForm(data.form);
</script>

<div
	class="flex background:white border-radius:5 flex-direction:column gap:10 padding:10 width:100%"
>
	<div>
		<h1>{data.box.name}</h1>
		<div>{data.box.description}</div>
	</div>

	<form method="POST" use:superform.enhance>
		<TextArea name="question" {superform} />
		<button type="submit">질문하기</button>
	</form>
</div>
