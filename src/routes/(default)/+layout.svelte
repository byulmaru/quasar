<script lang="ts">
	import Navbar from './Navbar.svelte';

	const { children, data } = $props();
</script>

<Navbar account={data.account} boxes={data.boxes} />
<div class="margin:20px|auto max-width:800px width:100%">
	{@render children()}
</div>
