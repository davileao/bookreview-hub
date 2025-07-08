<script setup lang="ts">
import { onMounted } from 'vue'
import BookCard from '@/components/BookCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useBooksStore } from '@/stores/books'

const booksStore = useBooksStore()

onMounted(() => {
  booksStore.fetchBooks()
})
</script>

<template>
  <div class="home">
    <div class="container">
      <div class="hero">
        <h1>Descubra Ótimos Livros</h1>
        <p>Explore reviews de livros e compartilhe suas próprias experiências de leitura</p>
      </div>

      <SearchBar />

      <div v-if="booksStore.loading" class="loading">
        <p>Carregando livros...</p>
      </div>

      <div v-else-if="booksStore.error" class="error">
        <p>{{ booksStore.error }}</p>
        <button @click="booksStore.fetchBooks()" class="btn btn-primary">Tentar novamente</button>
      </div>

      <div v-else-if="booksStore.books.length === 0" class="no-books">
        <p>Nenhum livro encontrado.</p>
      </div>

      <div v-else class="books-grid">
        <BookCard v-for="book in booksStore.books" :key="book.id" :book="book" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: calc(100vh - 80px);
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.loading,
.error,
.no-books {
  text-align: center;
  padding: 3rem 1rem;
}

.loading p,
.no-books p {
  font-size: 1.1rem;
  color: #6b7280;
}

.error p {
  font-size: 1.1rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #3730a3;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .container {
    padding: 1rem;
  }
}
</style>
