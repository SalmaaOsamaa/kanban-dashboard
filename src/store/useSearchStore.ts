import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  debouncedSearch: string;
  setSearchQuery: (query: string) => void;
}

let debounceTimer: ReturnType<typeof setTimeout>;

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  debouncedSearch: '',
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => set({ debouncedSearch: query }), 400);
  },
}));
