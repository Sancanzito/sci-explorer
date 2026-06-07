// store/articleStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { articlesDatabase } from './ArticleData';

export const useArticleStore = create(
  persist(
    (set, get) => ({
      searchQuery: '',
      previewArticle: null,
      showDropdown: false,
      suggestions: [],
      selectedIndex: -1,

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().updateSuggestions(query);
      },
      
      setPreviewArticle: (article) => set({ previewArticle: article }),
      setShowDropdown: (show) => set({ showDropdown: show }),
      setSelectedIndex: (index) => set({ selectedIndex: index }),

      updateSuggestions: (query) => {
        if (!query.trim()) {
          set({ suggestions: articlesDatabase.slice(0, 5), selectedIndex: -1 });
          return;
        }
        const matched = articlesDatabase.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
        set({ suggestions: matched, selectedIndex: -1 });
      },

      resetSearch: () => set({ searchQuery: '', showDropdown: false, suggestions: [] })
    }),
    {
      name: 'article-storage',
      partialize: (state) => ({ 
        searchQuery: state.searchQuery,
        lastViewedId: state.previewArticle?.id 
      }),
    }
  )
);