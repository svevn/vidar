<script>
	import { css, keyframes } from '@emotion/css';
	import deleteIcon from '$lib/images/delete.svg';

	export let text = '';
	export let bg = 'var(--grey-300)';
	export const hbg = 'var(--tag-hover)'; // tag hover bg color
	export const hc = 'var(--tag-font-color)'; // hover color
	export let fs = 'var(--font-s)'; // font size
	export let color = 'var(--aubergine)';
	export let ft = false; // delete tag from filters
	export let onDelete = undefined;
	export let redirect = false;

	const changeTagColorHover = keyframes`
		from {
			background-color: ${bg};
		}

		to {
			background-color: ${hbg};
		}
`;

	const tagCss = css`
		background-color: ${bg};
		font-size: ${fs};
		cursor: pointer;
		color: ${color};

		&:hover {
			background-color: ${hbg} !important;
			color: ${hc} !important;
			animation: ${changeTagColorHover} 0.75s;
		}
	`;
</script>

{#if ft}
	<span
		on:click={onDelete !== undefined ? () => onDelete(text) : () => {}}
		on:keyup={() => onDelete(text)}
		class={tagCss}
	>
		<div class:ft>
			<span>{text}</span>
			<img src={deleteIcon} alt="delete" />
		</div>
	</span>
{:else if redirect}
	<a href={`/?tags=${JSON.stringify([text])}`}>
		<span class={tagCss}>{text}</span>
	</a>
{:else}
	<span class={tagCss}>{text}</span>
{/if}

<style>
	span {
		padding: var(--gap-s);
		width: fit-content;
		max-height: 35px;
		border-radius: var(--border-radius-xl);
		display: flex;
		white-space: nowrap;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.ft {
		display: flex;
		gap: var(--gap-xs);
		align-items: center;
	}

	.ft > span {
		padding: 0;
		color: var(--white) !important;
	}

	.ft > img {
		align-self: center;
		cursor: pointer;
	}
</style>
