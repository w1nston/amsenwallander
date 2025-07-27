<script lang="ts">
  import FilterIcon from './FilterIcon.svelte';
  import { onMount } from 'svelte';
  import Fuse from 'fuse.js';

  interface $$Props {
    availableTags: string[];
    recipeListId: string;
  }

  interface SearchableItem {
    element: HTMLLIElement;
    title: string;
    tags: string[];
  }

  let { availableTags, recipeListId } = $props()

  let isFilterOpen = $state(false);
  let selectedTag = $state('');
  let searchQuery = $state('');
  let fuse: Fuse<SearchableItem>;

  function toggleFilter() {
    isFilterOpen = !isFilterOpen;
  }

  function closeFilter() {
    isFilterOpen = false;
  }

  function selectTag(tag: string) {
    selectedTag = tag;
    filterRecipes();
    closeFilter();
  }

  function filterRecipes() {
    const recipeList = document.getElementById(recipeListId);
    if (!recipeList) return;

    const items = Array.from(recipeList.getElementsByTagName('li'));
    
    const searchableItems: SearchableItem[] = items.map(item => ({
      element: item,
      title: item.querySelector('a')?.textContent || '',
      tags: item.dataset.tags?.split(';') || []
    }));

    if (!fuse) {
      fuse = new Fuse(searchableItems, {
        keys: ['title'],
        threshold: 0.6,
        distance: 200,
        includeScore: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
        useExtendedSearch: true,
        shouldSort: true,
        findAllMatches: true,
        location: 0
      });
    }

    /*
    items.forEach(item => {
      const itemTags = item.dataset.tags?.split(';') || [];
      const matchesTag = selectedTags.size === 0 || itemTags.some(tag => selectedTags.has(tag));
      
      let matchesSearch = true;
      if (searchQuery) {
        const searchResults = fuse.search(searchQuery);
        matchesSearch = searchResults.some(result => result.item.element === item);
      }
      
      if (matchesTag && matchesSearch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    */
  }

  function handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    searchQuery = input.value.trim();
    filterRecipes();
  }

  function clearSearch() {
    searchQuery = '';
    filterRecipes();
  }

  onMount(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#filter-container') && isFilterOpen) {
        closeFilter();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFilterOpen) {
        closeFilter();
      }
    });
  });
</script>

<div id="filter-container">
  <footer>
    <button 
      id="filter-btn" 
      onclick={toggleFilter}
      aria-expanded={isFilterOpen}
      aria-controls="filter-panel"
    >
      <FilterIcon />
    </button>
  </footer>

  {#if isFilterOpen}
    <div 
      id="filter-panel"
      class="filter-panel"
      role="dialog"
      aria-labelledby="filter-title"
    >
      <div class="filter-header">
        <h3 id="filter-title">Filtrera på taggar</h3>
        <button 
          class="close-btn" 
          onclick={closeFilter}
          aria-label="Stäng filter"
        >×</button>
      </div>

      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            type="search"
            placeholder="Sök recept..."
            value={searchQuery}
            oninput={handleSearch}
            aria-label="Sök recept"
          />
          {#if searchQuery}
            <button 
              class="clear-search" 
              onclick={clearSearch}
              aria-label="Rensa sökning"
            >×</button>
          {/if}
        </div>
      </div>

      <div class="tags-container">
        {#each availableTags as tag}
          <button 
            class="tag-btn" 
            class:selected={selectedTag === tag}
            onclick={() => selectTag(tag)}
            aria-pressed={selectedTag === tag}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  #filter-container {
    position: relative;
  }

  footer {
    background-color: var(--surface-color);
    color: var(--surface-text-color);
    height: 3.75rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding: 0 1rem;
    z-index: 10;
  }

  button {
    all: unset;
    cursor: pointer;
  }

  #filter-btn {
    background-color: var(--white);
    color: var(--surface-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 32px;
    height: 32px;
    border-radius: 16px;
  }

  .filter-panel {
    position: fixed;
    bottom: 3.75rem;
    left: 0;
    width: 100%;
    background-color: var(--white);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 9;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .filter-header h3 {
    margin: 0;
  }

  .close-btn {
    font-size: 1.5rem;
    padding: 0.5rem;
  }

  .search-container {
    margin-bottom: 1rem;
  }

  .search-input-wrapper {
    position: relative;
    width: 100%;
  }

  .search-container input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2.5rem;
    border: 1px solid var(--surface-color);
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: var(--white);
  }

  .search-container input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .clear-search {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--surface-color);
    font-size: 1.25rem;
    padding: 0.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }

  .clear-search:hover {
    background-color: var(--surface-color);
    color: var(--white);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-btn {
    background-color: var(--surface-color);
    color: var(--surface-text-color);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }

  .tag-btn.selected {
    background-color: var(--secondary-surface-color);
    color: var(--secondary-surface-text-color);
  }
</style>
