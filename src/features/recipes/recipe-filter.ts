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
  const recipeItems = document.querySelectorAll(`#${recipeListId} > li`);

  let selectedTags = new Set<string>();

  function applyFilter() {
    recipeItems.forEach((li) => {
      if (selectedTags.size === 0) {
        li.classList.remove('hidden');
        return;
      }
      let itemTags = (li as HTMLElement).dataset.tags?.split(';') ?? [];
      let matches = itemTags.some((tag) => selectedTags.has(tag));
      li.classList.toggle('hidden', !matches);
    });

    if (clearButton) {
      clearButton.hidden = selectedTags.size === 0;
    }

    fab?.classList.toggle('has-active-filter', selectedTags.size > 0);
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

  clearButton?.addEventListener('click', () => {
    selectedTags.clear();
    tagButtons?.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
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
