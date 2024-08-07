<script lang="ts">
	export let tag: 'button' | 'a' = 'button';
	export let theme: 'primary' | 'secondary' | 'danger' | 'none' = 'secondary';

	const themeClasses = {
		primary: 'bg:purple-50 bg:purple-60:hover text:white',
		secondary: 'bg:gray-20 bg:gray-30:hover text:black',
		danger: 'bg:red-50 text:white',
		none: '',
	};
</script>

{#if tag === 'button'}
	<button
		on:click
		{...$$restProps}
		class={`${$$restProps.class} ${themeClasses[theme]} border:gray-10 p:12|20 cursor:pointer box-shadow:0|4|16|gray-10 box-shadow:none:active`}
	>
		<slot />
	</button>
{:else if tag === 'a'}
	<a
		{...$$restProps}
		class={`${$$restProps.class} border-radius:4 border:gray-10 p:12|20 cursor:pointer`}
		href={$$restProps.href}
	>
		<slot />
	</a>
{/if}
