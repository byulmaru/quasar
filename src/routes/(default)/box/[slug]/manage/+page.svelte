<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/components/Button.svelte';
	import Select from '$lib/components/Select.svelte'; //TODO
	import InputField from '$lib/components/InputField.svelte';

	const { data } = $props();
	const superform = superForm(data.form);
	let { form } = superform;

    onMount(()=> {
        $form.name = data.box.name;
        $form.slug = data.box.slug;

    })

    let slugUrl = $state(`${location.host}/box/${data.box.slug}`)

    async function updateSlugUrl() {
        slugUrl = `${location.host}/box/${document.querySelector('#slugurl')?.value}`
    }

</script>

<div
	class="flex background:white border-radius:5 flex-direction:column gap:10 padding:10 width:100%"
>
    <form method="POST" use:superform.enhance class="flex flex-direction:column">
        <InputField value={data.box.name} name="name" label="질문상자 이름" {superform}/>
        <InputField value={data.box.slug} id="slugurl" name="slug" label="질문상자 주소" oninput={updateSlugUrl} description={slugUrl} {superform}/>
        <Select name="allowanonym" label="익명 질문을" options="true:허용합니다|false:허용하지 않습니다" {superform}/>
		<Button class="bg:#6364FF bg:#563ACC:hover color:white flex:1" theme="none" type="submit">수정</Button>
    </form>

</div>
