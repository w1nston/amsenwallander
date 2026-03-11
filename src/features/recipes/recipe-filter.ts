type RecipeFilterConfig = {
  fabId: string;
  dialogId: string;
  recipeListId: string;
}

export function initRecipeFilter({ fabId, dialogId, recipeListId }: RecipeFilterConfig) {
  const fab = document.getElementById(fabId);
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;
  const closeButton = dialog?.querySelector('.close-button');
  const tagButtons = dialog?.querySelectorAll('.tag-button');
  const clearButton = dialog?.querySelector('.clear-button') as HTMLButtonElement | null;
  const searchInput = dialog?.querySelector('#recipe-search') as HTMLInputElement | null;
  const recipeItems = document.querySelectorAll(`#${recipeListId} > li`);

  let selectedTags = new Set<string>();

  function applyFilter() {
    let query = searchInput?.value.toLowerCase().trim() ?? '';

    recipeItems.forEach((li) => {
      let el = li as HTMLElement;
      let matchesTags = selectedTags.size === 0
        || (el.dataset.tags?.split(';') ?? []).some((tag) => selectedTags.has(tag));
      let matchesSearch = !query
        || (el.dataset.title?.includes(query) ?? false);

      li.classList.toggle('hidden', !(matchesTags && matchesSearch));
    });

    let hasActiveFilter = selectedTags.size > 0 || !!query;
    if (clearButton) {
      clearButton.hidden = !hasActiveFilter;
    }

    fab?.classList.toggle('has-active-filter', hasActiveFilter);
  }

  tagButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      let tag = (btn as HTMLElement).dataset.tag!;
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedTags.add(tag);
        btn.setAttribute('aria-pressed', 'true');
      }
      applyFilter();
    });
  });

  searchInput?.addEventListener('input', () => {
    applyFilter();
  });

  clearButton?.addEventListener('click', () => {
    selectedTags.clear();
    tagButtons?.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
    if (searchInput) {
        searchInput.value = '';
    }
    applyFilter();
  });

  fab?.addEventListener('click', () => {
    dialog?.showModal();
  });

  closeButton?.addEventListener('click', () => {
    dialog?.close();
  });

  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });
}
