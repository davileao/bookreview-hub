<template>
  <div class="admin">
    <div class="container">
      <div class="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Gerencie livros e conteúdo da plataforma</p>
      </div>

      <div class="admin-content">
        <!-- Add Book Section -->
        <div class="section">
          <h2>Adicionar Novo Livro</h2>
          <form @submit.prevent="handleCreateBook" class="book-form">
            <div class="form-group">
              <label>Título do Livro:</label>
              <input
                type="text"
                v-model="newBook.title"
                required
                class="form-input"
                placeholder="Digite o título do livro"
              />
            </div>
            <div class="form-group">
              <label>Autor:</label>
              <input
                type="text"
                v-model="newBook.author"
                required
                class="form-input"
                placeholder="Digite o nome do autor"
              />
            </div>
            <div v-if="booksStore.error" class="error">
              {{ booksStore.error }}
            </div>
            <button type="submit" :disabled="booksStore.loading" class="btn btn-primary">
              {{ booksStore.loading ? 'Criando...' : 'Criar Livro' }}
            </button>
          </form>
        </div>

        <!-- Books List Section -->
        <div class="section">
          <h2>Livros Cadastrados</h2>

          <div v-if="booksStore.loading && booksStore.books.length === 0" class="loading">
            <p>Carregando livros...</p>
          </div>

          <div v-else-if="booksStore.books.length === 0" class="no-books">
            <p>Nenhum livro cadastrado ainda.</p>
          </div>

          <div v-else class="books-table">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Avaliação Média</th>
                  <th>Reviews</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in booksStore.books" :key="book.id">
                  <td>{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>
                    <div class="rating-cell">
                      <span class="rating-value">{{ book.averageRating.toFixed(1) }}</span>
                      <div class="stars">
                        <span
                          v-for="i in 5"
                          :key="i"
                          class="star"
                          :class="{ active: i <= Math.round(book.averageRating) }"
                        >
                          ⭐
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{{ book.reviewCount }}</td>
                  <td>
                    <div class="actions-cell">
                      <router-link :to="`/book/${book.id}`" class="btn btn-outline btn-sm">
                        Ver Detalhes
                      </router-link>
                      <button
                        @click="handleDeleteBook(book.id, book.title)"
                        class="btn btn-danger btn-sm"
                        :disabled="booksStore.loading"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const newBook = reactive({
  title: '',
  author: '',
})

// Redirect if not admin
onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push('/')
    return
  }

  booksStore.fetchBooks()
})

const handleCreateBook = async () => {
  if (!newBook.title.trim() || !newBook.author.trim()) return

  try {
    await booksStore.createBook(newBook.title, newBook.author)

    // Reset form
    newBook.title = ''
    newBook.author = ''
  } catch (error) {
    console.error('Error creating book:', error)
  }
}

const handleDeleteBook = async (bookId: string, bookTitle: string) => {
  const confirmed = confirm(
    `Tem certeza que deseja excluir o livro "${bookTitle}"? Esta ação não pode ser desfeita.`,
  )

  if (!confirmed) return

  try {
    await booksStore.deleteBook(bookId)
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Erro ao excluir livro. Tente novamente.')
  }
}
</script>

<style scoped>
.admin {
  min-height: calc(100vh - 80px);
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 3rem;
}

.admin-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.admin-header p {
  font-size: 1.1rem;
  color: #6b7280;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}

.loading,
.no-books {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.books-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

tr:hover {
  background: #f9fafb;
}

.rating-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rating-value {
  font-weight: 600;
  color: #1f2937;
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 0.875rem;
  filter: grayscale(100%);
}

.star.active {
  filter: grayscale(0%);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  text-align: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3730a3;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-outline {
  background: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
}

.btn-outline:hover {
  background: #4f46e5;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-header h1 {
    font-size: 2rem;
  }

  .container {
    padding: 1rem;
  }

  .section {
    padding: 1.5rem;
  }

  .books-table {
    font-size: 0.875rem;
  }

  th,
  td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
