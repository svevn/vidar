<script>
	import Box from './Box.svelte';
	import avatarPlaceholder from '$lib/images/avatar_placeholder.svg';
	import MediaQuery from 'src/hooks/UseMediaQuery.svelte';
	import deleteIcon from '$lib/images/delete.svg';

	export let author;
	export let mw = false;
	export let disableRedirect = false;
	export let filterSpeaker = false;
	export let deleteSpeakerFromFilter = () => {};
</script>

<MediaQuery query="(min-width: 1115px)" let:matches>
	{#if matches}
		<Box
			mw={mw ? '250px' : 'unset'}
			className="author-name"
			padding={mw ? 'unset' : 'var(--gap-s)'}
			ch
			height="fit-content"
			gap="var(--gap-s)"
		>
			{#if filterSpeaker}
				<div>
					<img class:filterSpeaker src={author.avatar_photo || avatarPlaceholder} alt="author" />
					<span
						class="span-color"
						class:disableRedirect
						on:keyup={deleteSpeakerFromFilter}
						on:click={deleteSpeakerFromFilter}>{author.name}</span
					>
					<img
						class="delete"
						src={deleteIcon}
						on:keyup={deleteSpeakerFromFilter}
						alt="delete"
						on:click={deleteSpeakerFromFilter}
					/>
				</div>
			{:else if disableRedirect}
				<img src={author.avatar_photo || avatarPlaceholder} alt="author" />
				<span class:disableRedirect>{author.name}</span>
			{:else}
				<img src={author.avatar_photo || avatarPlaceholder} alt="author" />
				<a href={`/author/${author.id}/`}><span>{author.name}</span></a>
			{/if}
		</Box>
	{:else}
		<Box
			className="author-name"
			padding="var(--gap-xs) var(--gap-s)"
			ch
			height="fit-content"
			gap="var(--gap-s)"
		>
			{#if filterSpeaker}
				<div>
					<img class:filterSpeaker src={author.avatar_photo || avatarPlaceholder} alt="author" />
					<span
						class="span-color"
						class:disableRedirect
						on:keyup={deleteSpeakerFromFilter}
						on:click={deleteSpeakerFromFilter}>{author.name}</span
					>
					<img
						class="delete"
						src={deleteIcon}
						on:keyup={deleteSpeakerFromFilter}
						alt="delete"
						on:click={deleteSpeakerFromFilter}
					/>
				</div>
			{:else if disableRedirect}
				<img src={author.avatar_photo || avatarPlaceholder} alt="author" />
				<span class:disableRedirect>{author.name}</span>
			{:else}
				<img src={author.avatar_photo || avatarPlaceholder} alt="author" />
				<a href={`/author/${author.id}/`}><span>{author.name}</span></a>
			{/if}
		</Box>
	{/if}
</MediaQuery>

<style>
	div {
		padding: var(--gap-xs);
		cursor: pointer;
		background: var(--aubergine);
		display: flex;
		gap: var(--gap-s);
		align-items: center;
		border-radius: var(--border-radius-xl);
	}

	div:hover {
		background: var(--grey-700);
	}

	div:hover > span {
		color: var(--white);
	}

	div > span {
		font-size: var(--font-s);
		color: white !important;
	}

	img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	span {
		font-size: var(--font-m);
		color: var(--red);
	}

	.disableRedirect {
		color: var(--aubergine);
	}

	.filterSpeaker {
		width: 22px;
		height: 22px;
	}

	.span-color {
		color: var(--white) !important;
	}

	.delete {
		width: 9px;
		height: 9px;
	}
</style>
