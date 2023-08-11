<script>
	import MediaQuery from 'src/hooks/UseMediaQuery.svelte';
	import AuthorName from './AuthorName.svelte';
	export let authors;
</script>

<MediaQuery query="(min-width: 1115px)" let:matches>
	{#if matches}
		<div class="multiple-speakers-list">
			{#each authors as author}
				<AuthorName {author} />
			{/each}
		</div>
	{:else}
		<div class="multiple-speakers-list-mobile">
			{#each authors as author}
				<AuthorName {author} />
			{/each}
		</div>
	{/if}
</MediaQuery>

<style>
	.multiple-speakers-list {
		position: absolute;
		display: none;
		flex-direction: column;
		top: 100%;
		left: 0;
		width: 100%;
		height: fit-content;
		z-index: 5;
		background-color: var(--white);
		padding: var(--gap-s);
		border-radius: var(--border-radius-xl);
		gap: var(--gap-s);
		animation: dropdown-fade-in 0.35s;
		border: 1px solid white;
		-webkit-filter: drop-shadow(var(--multiple-avatar-shadow));
		box-shadow: var(--multiple-avatar-shadow);
		filter: drop-shadow(var(--multiple-avatar-shadow));
	}

	.multiple-speakers-list:after,
	.multiple-speakers-list:before {
		bottom: 100%;
		border: solid transparent;
		content: ' ';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

	.multiple-speakers-list:after {
		border-color: transparent;
		border-bottom-color: var(--white);
		border-width: 10px;
		left: 30%;
		margin-left: -10px;
	}

	.multiple-speakers-list:before {
		border-color: transparent;
		border-width: 10px;
		left: 30%;
		margin-left: -10px;
	}

	@media screen and (max-width: 1115px) {
		.multiple-speakers-list-mobile {
			display: flex;
			flex-direction: column;
			background-color: var(--white);
			border-radius: var(--border-radius);
			gap: var(--gap-s);
			padding: var(--gap-s);
			border-top: 2px solid var(--grey-500);
			position: absolute;
			top: 100%;
			width: 100%;
			z-index: 2;
			margin-top: var(--gap-s);
		}

		.multiple-speakers-list:after {
			left: 19.5%;
		}

		.multiple-speakers-list:before {
			left: 19.5%;
		}
	}
</style>