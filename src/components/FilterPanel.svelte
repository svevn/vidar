<script>
	import Box from './Box.svelte';
	import Button from './Button.svelte';
	import Select from './Select.svelte';
	import filter from '$lib/images/filter.svg';
	import filterWhite from '$lib/images/filter_white.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authorStore, dateRangeStore, dateTypeStore, selectedTagsStore } from 'src/stores/Data';
	import { getDayAndMonthJsDate } from 'src/utils/date';
	import AuthorName from './AuthorName.svelte';
	import Filters from './Filters.svelte';
	import MediaQuery from 'src/hooks/UseMediaQuery.svelte';
	import TagPanel from './TagPanel.svelte';
	import Tag from './Tag.svelte';
	import TagInfo from './TagInfo.svelte';

	export let tags;
	export let authors;
	const options = ['Latest', 'Earliest'];

	function findAuthorByName(authorName) {
		if (authorName) {
			return authors.find((item) => {
				return item.name === authorName;
			});
		}

		return null;
	}

	let open = false;
	let boxRef;
	let buttonRef;
	let dateFrom =
		JSON.parse($page.url.searchParams.get('date'))?.from != null
			? new Date(JSON.parse($page.url.searchParams.get('date')).from)
			: null;
	let dateTo =
		JSON.parse($page.url.searchParams.get('date'))?.to != null
			? new Date(JSON.parse($page.url.searchParams.get('date')).to)
			: null;
	let selectedTags = new Set(JSON.parse($page.url.searchParams.get('tags')));
	let params = Array.from(selectedTags);
	let author = JSON.parse($page.url.searchParams.get('speaker'));
	let period = JSON.parse($page.url.searchParams.get('period')) || 'Any Time';
	let selectedAuthor = findAuthorByName(author);

	const initSelectTags = () => {
		Object.entries(boxRef.children ? boxRef.children : []).forEach(([_, value]) => {
			if (new Set($selectedTagsStore).has(value.textContent)) {
				value.style.backgroundColor = 'var(--aubergine)';
				value.style.color = 'var(--white)';
			} else {
				value.style.backgroundColor = 'var(--grey-300)';
				value.style.color = 'var(--aubergine)';
			}
		});
	};

	const onFiltersButtonClick = () => {
		open = !open;

		if (open) {
			buttonRef.style.backgroundColor = 'var(--aubergine)';
			buttonRef.style.color = 'var(--white)';
			buttonRef.firstChild.src = filterWhite;
		} else {
			buttonRef.style.backgroundColor = 'var(--white)';
			buttonRef.style.color = 'var(--aubergine)';
			buttonRef.firstChild.src = filter;
		}
	};

	const changeSelected = (event) => {
		Object.entries(boxRef.children).forEach(([_, value]) => {
			if (value === event.target) {
				if (new Set(JSON.parse($page.url.searchParams.get('tags'))).has(value.textContent)) {
					selectedTags.delete(value.textContent);
					$selectedTagsStore = $selectedTagsStore.filter((x) => x !== value.textContent);
				} else {
					selectedTags.add(value.textContent);
					$selectedTagsStore = [...$selectedTagsStore, value.innerText];
				}

				$page.url.searchParams.set('tags', JSON.stringify($selectedTagsStore));
				goto(`?${$page.url.searchParams.toString()}`, { noScroll: true, replaceState: true });
			}
		});

		initSelectTags();
	};

	const addClickTagEvent = () => {
		Object.entries(boxRef.children).forEach(([_, value]) => {
			value.addEventListener('click', (event) => changeSelected(event));
		});
	};

	const deleteTagFromFilter = (tagName) => {
		selectedTags.delete(tagName);
		$selectedTagsStore = $selectedTagsStore.filter((x) => x !== tagName);

		if ($selectedTagsStore.length > 0) {
			$page.url.searchParams.set('tags', JSON.stringify(Array.from(selectedTags)));
		} else {
			$page.url.searchParams.delete('tags');
		}
		goto(`?${$page.url.searchParams.toString()}`, {
			noScroll: true,
			replaceState: true
		});
		initSelectTags();
	};

	onMount(() => {
		if (
			$page.url.searchParams.get('tags') &&
			Array.isArray(JSON.parse($page.url.searchParams.get('tags')))
		) {
			if (JSON.parse($page.url.searchParams.get('tags')).every((i) => typeof i === 'string')) {
				selectedTags = new Set(JSON.parse($page.url.searchParams.get('tags')));
			}
		} else {
			selectedTags = new Set();
		}

		if ($page.url.searchParams.get('date')) {
			$dateRangeStore = {
				start_date: new Date(JSON.parse($page.url.searchParams.get('date')).start_date) || null,
				end_date: new Date(JSON.parse($page.url.searchParams.get('date')).end_date) || null
			};
		}

		$selectedTagsStore = Array.from(selectedTags);
		$dateTypeStore = period;
		$authorStore = selectedAuthor?.name ? selectedAuthor.name : '';

		const subscribtion = dateRangeStore.subscribe(() => {
			if ($dateRangeStore.end_date && $dateTypeStore == 'Range') {
				$page.url.searchParams.set(
					'date',
					JSON.stringify({
						start_date: $dateRangeStore.start_date,
						end_date: $dateRangeStore.end_date
					})
				);
			} else if ($dateRangeStore.start_date) {
				$page.url.searchParams.set(
					'date',
					JSON.stringify({ start_date: $dateRangeStore.start_date })
				);
			}
			goto(`?${$page.url.searchParams.toString()}`, {
				noScroll: true,
				replaceState: true,
				keepFocus: true
			});
		});

		return () => {
			subscribtion();
		};
	});
</script>

<MediaQuery query="(min-width: 1115px)" let:matches>
	{#if matches}
		<Box df fd="column" padding="0 var(--gap-l) var(--gap-l) var(--gap-l)" gap="var(--gap-m)">
			<Box cvh jsb gap="var(--gap-m)" bottomBorder padding="0 0 var(--gap-m) 0">
				<Box width="fit-content" cvh gap="var(--gap-s)">
					<span>Sort by:</span>
					<Select {options} />
				</Box>
				<Button
					icon={filter}
					bind:ref={buttonRef}
					onClick={onFiltersButtonClick}
					text="Filters"
					bg="var(--white)"
					border="1px solid var(--grey-500)"
				/>
			</Box>

			<Box df fw gap="var(--gap-l)">
				{#if $selectedTagsStore.length > 0}
					<Box ch gap="var(--gap-m)" width="fit-content">
						<span class="select-tags">TAGS:</span>
						<Box
							bg="transparent"
							mw="calc(100vw - 120px)"
							df
							gap="var(--gap-s)"
							fd="column"
							height="fit-content"
						>
							{#key $selectedTagsStore}
								<TagPanel>
									{#each $selectedTagsStore as tag (tag)}
										<Tag ft text={tag} onDelete={deleteTagFromFilter} />
									{/each}
								</TagPanel>
							{/key}
						</Box>
					</Box>
				{/if}
				{#if author !== '' && selectedAuthor != null}
					<Box ch gap="var(--gap-m)" width="fit-content">
						<span class="select-tags">SPEAKER:</span>
						{#key author}
							<AuthorName filterSpeaker disableRedirect mw author={selectedAuthor || ''} />
						{/key}
					</Box>
				{/if}
				<Box ch gap="var(--gap-m)" width="fit-content">
					{#if $dateTypeStore === 'Last 30 days' || $dateTypeStore === 'Last 3 months'}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo text={$dateTypeStore} fp />
					{/if}

					{#if ($dateTypeStore === 'On' || $dateTypeStore === 'Before' || $dateTypeStore === 'After') && $dateRangeStore.start_date}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo
							text={`${$dateTypeStore} ${getDayAndMonthJsDate($dateRangeStore.start_date)}`}
							fp
						/>
					{/if}

					{#if $dateTypeStore === 'Range' && dateTo}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo
							text={`${$dateTypeStore} ${getDayAndMonthJsDate(dateFrom)} - ${getDayAndMonthJsDate(
								dateTo
							)}`}
							fp
						/>
					{/if}
				</Box>
			</Box>

			{#if open}
				{#key $selectedTagsStore}
					<Filters
						bind:selectedAuthor
						bind:author
						bind:boxRef
						{tags}
						{authors}
						tagClickEvent={addClickTagEvent}
						{initSelectTags}
					/>
				{/key}
			{/if}
		</Box>
	{:else}
		<Box df fd="column" padding="0 var(--gap-m) var(--gap-m) var(--gap-m)" gap="var(--gap-s)">
			<Box cvh jsb gap="var(--gap-m)">
				<Box width="fit-content" cvh gap="var(--gap-s)">
					<span>Sort by:</span>
					<Select {options} />
				</Box>
				<Button
					icon={filter}
					bind:ref={buttonRef}
					onClick={onFiltersButtonClick}
					text="Filters"
					bg="var(--white)"
					border="1px solid var(--grey-500)"
				/>
			</Box>

			<Box df fd="column" gap="var(--gap-m)">
				{#if $selectedTagsStore.length > 0}
					<Box ch gap="var(--gap-m)" width="fit-content">
						<span class="select-tags">TAGS:</span>
						<Box
							bg="transparent"
							mw="calc(100vw - 90px)"
							df
							gap="var(--gap-s)"
							fd="column"
							height="fit-content"
						>
							{#key $selectedTagsStore}
								<TagPanel>
									{#each $selectedTagsStore as tag (tag)}
										<Tag ft text={tag} onDelete={deleteTagFromFilter} />
									{/each}
								</TagPanel>
							{/key}
						</Box>
					</Box>
				{/if}
				{#if author !== '' && selectedAuthor != null}
					<Box ch gap="var(--gap-m)" width="fit-content">
						<span class="select-tags">SPEAKER:</span>
						{#key author}
							<AuthorName disableRedirect mw author={selectedAuthor || ''} />
						{/key}
					</Box>
				{/if}
				<Box ch gap="var(--gap-m)" width="fit-content">
					{#if $dateTypeStore === 'Last 30 days' || $dateTypeStore === 'Last 3 months'}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo text={$dateTypeStore} fp />
					{/if}

					{#if ($dateTypeStore === 'On' || $dateTypeStore === 'Before' || $dateTypeStore === 'After') && dateFrom}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo text={`${$dateTypeStore} ${getDayAndMonthJsDate(dateFrom)}`} fp />
					{/if}

					{#if $dateTypeStore === 'Range' && dateTo}
						<span class="select-tags">TIMEFRAME:</span>
						<TagInfo
							text={`${$dateTypeStore} ${getDayAndMonthJsDate(dateFrom)} - ${getDayAndMonthJsDate(
								dateTo
							)}`}
							fp
						/>
					{/if}
				</Box>
			</Box>

			{#if open}
				{#key $selectedTagsStore}
					<Filters
						bind:selectedAuthor
						bind:author
						bind:boxRef
						dc
						{tags}
						{authors}
						tagClickEvent={addClickTagEvent}
						{initSelectTags}
					/>
				{/key}
			{/if}
		</Box>
	{/if}
</MediaQuery>

<style>
	span {
		font-size: var(--font-m);
	}

	.select-tags {
		color: var(--grey-700);
	}

	img {
		cursor: pointer;
	}
</style>
