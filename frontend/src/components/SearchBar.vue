<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Buscar livros por título ou autor..."
        class="search-input"
      />
      <button v-if="searchQuery" @click="clearSearch" class="clear-button" type="button">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBooksStore } from '@/stores/books'

const booksStore = useBooksStore()
const searchQuery = ref('')

let searchTimeout: ReturnType<typeof setTimeout>

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    booksStore.searchBooks(searchQuery.value)
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  booksStore.fetchBooks()
}

watch(searchQuery, (newValue) => {
  if (newValue === '') {
    booksStore.fetchBooks()
  }
})
</script>

<style scoped>
.search-bar {
  margin-bottom: 2rem;
}

.search-input-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  padding-right: 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.2s;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.clear-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #374151;
}
</style>
