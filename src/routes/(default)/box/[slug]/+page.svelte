<script lang="ts">
	const { data } = $props();
</script>

<div
	class="background:white border-radius:5 display:flex gap:10 padding:10 width:100%"
>
	<div>
		<h1>{data.box.name}</h1>
		<div>{data.box.description}</div>
	</div>
</div>
