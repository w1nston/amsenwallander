<script lang="ts">
  import FilterIcon from './FilterIcon.svelte';
  import { onMount } from 'svelte';

  interface $$Props {
    availableTags: string[];
    recipeListId: string;
  }

  export let availableTags: $$Props['availableTags'];
  export let recipeListId: $$Props['recipeListId'];

  let isFilterOpen = false;
  let selectedTags: Set<string> = new Set();
  let filterPanel: HTMLDivElement;

  function toggleFilter() {
    isFilterOpen = !isFilterOpen;
  }

  function closeFilter() {
    isFilterOpen = false;
  }

  function selectTag(tag: string) {
    selectedTags.clear(); // Clear any existing selection
    selectedTags.add(tag);
    filterRecipes();
    closeFilter();
  }

  function filterRecipes() {
    const recipeList = document.getElementById(recipeListId);
    if (!recipeList) return;

    const items = recipeList.getElementsByTagName('li');
    
    for (const item of items) {
      const itemTags = item.dataset.tags?.split(';') || [];
      
      if (selectedTags.size === 0 || itemTags.some(tag => selectedTags.has(tag))) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    }
  }

  onMount(() => {
    // Close filter when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#filter-container') && isFilterOpen) {
        closeFilter();
      }
    });

    // Handle escape key
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
      on:click={toggleFilter}
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
      bind:this={filterPanel}
      role="dialog"
      aria-labelledby="filter-title"
    >
      <div class="filter-header">
        <h3 id="filter-title">Filtrera på taggar</h3>
        <button 
          class="close-btn" 
          on:click={closeFilter}
          aria-label="Stäng filter"
        >×</button>
      </div>
      <div class="tags-container">
        {#each availableTags as tag}
          <button 
            class="tag-btn" 
            class:selected={selectedTags.has(tag)}
            on:click={() => selectTag(tag)}
            aria-pressed={selectedTags.has(tag)}
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
