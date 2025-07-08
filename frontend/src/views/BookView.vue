<template>
  <div class="book-detail">
    <div class="container">
      <button @click="$router.go(-1)" class="back-button">← Voltar</button>

      <div v-if="booksStore.loading" class="loading">
        <p>Carregando livro...</p>
      </div>

      <div v-else-if="booksStore.error" class="error">
        <p>{{ booksStore.error }}</p>
        <button @click="loadBook" class="btn btn-primary">Tentar novamente</button>
      </div>

      <div v-else-if="!booksStore.currentBook" class="error">
        <p>Livro não encontrado.</p>
      </div>

      <div v-else class="book-content">
        <div class="book-header">
          <div class="book-cover-large">
            <div class="book-spine-large">
              <h1>{{ booksStore.currentBook.title }}</h1>
              <p>{{ booksStore.currentBook.author }}</p>
            </div>
          </div>

          <div class="book-info">
            <h1>{{ booksStore.currentBook.title }}</h1>
            <h2>por {{ booksStore.currentBook.author }}</h2>

            <div class="rating-section">
              <div class="stars">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="star"
                  :class="{ active: i <= Math.round(booksStore.currentBook.averageRating) }"
                >
                  ⭐
                </span>
              </div>
              <span class="rating-text">
                {{ booksStore.currentBook.averageRating.toFixed(1) }}
                ({{ booksStore.currentBook.reviewCount }}
                {{ booksStore.currentBook.reviewCount === 1 ? 'review' : 'reviews' }})
              </span>
            </div>
          </div>
        </div>

        <!-- Add Review Section -->
        <div v-if="authStore.isAuthenticated" class="add-review-section">
          <h3>Escrever Review</h3>
          <form @submit.prevent="submitReview" class="review-form">
            <div class="rating-input">
              <label>Sua avaliação:</label>
              <div class="star-rating">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="newReview.rating = i"
                  class="star-button"
                  :class="{ active: i <= newReview.rating }"
                >
                  ⭐
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Seu comentário:</label>
              <textarea
                v-model="newReview.text"
                placeholder="Compartilhe sua opinião sobre este livro..."
                rows="4"
                class="form-textarea"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="submittingReview || newReview.rating === 0"
              class="btn btn-primary"
            >
              {{ submittingReview ? 'Enviando...' : 'Enviar Review' }}
            </button>
          </form>
        </div>

        <div v-else class="login-prompt">
          <p>Faça login para escrever um review deste livro.</p>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h3>Reviews</h3>

          <div
            v-if="!booksStore.currentBook.reviews || booksStore.currentBook.reviews.length === 0"
            class="no-reviews"
          >
            <p>Ainda não há reviews para este livro. Seja o primeiro a avaliar!</p>
          </div>

          <div v-else class="reviews-list">
            <div
              v-for="review in booksStore.currentBook.reviews"
              :key="review.id"
              class="review-item"
            >
              <div class="review-header">
                <h4>{{ review.user.name }}</h4>
                <div class="review-rating">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ active: i <= review.rating }"
                  >
                    ⭐
                  </span>
                </div>
              </div>
              <p class="review-text">{{ review.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const submittingReview = ref(false)
const newReview = reactive({
  rating: 0,
  text: '',
})

const loadBook = () => {
  const bookId = route.params.id as string
  if (bookId) {
    booksStore.fetchBook(bookId)
  }
}

const submitReview = async () => {
  if (!booksStore.currentBook || newReview.rating === 0) return

  submittingReview.value = true

  try {
    await booksStore.createReview(booksStore.currentBook.id, newReview.rating, newReview.text)

    // Reset form
    newReview.rating = 0
    newReview.text = ''
  } catch (error) {
    console.error('Error submitting review:', error)
  } finally {
    submittingReview.value = false
  }
}

onMounted(() => {
  loadBook()
})
</script>

<style scoped>
.book-detail {
  min-height: calc(100vh - 80px);
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
  transition: color 0.2s;
}

.back-button:hover {
  color: #374151;
}

.loading,
.error {
  text-align: center;
  padding: 3rem 1rem;
}

.loading p {
  font-size: 1.1rem;
  color: #6b7280;
}

.error p {
  font-size: 1.1rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.book-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.book-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.book-cover-large {
  width: 100%;
  height: 400px;
}

.book-spine-large {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.book-spine-large::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.book-spine-large h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.book-spine-large p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.book-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.book-info h2 {
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  color: #6b7280;
  font-weight: 400;
  font-style: italic;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 1.5rem;
  filter: grayscale(100%);
  transition: filter 0.2s;
}

.star.active {
  filter: grayscale(0%);
}

.rating-text {
  font-size: 1.1rem;
  color: #6b7280;
}

.add-review-section,
.login-prompt,
.reviews-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.add-review-section h3,
.reviews-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.review-form {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
}

.rating-input {
  margin-bottom: 1rem;
}

.rating-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  filter: grayscale(100%);
  transition: filter 0.2s;
  padding: 0.25rem;
}

.star-button.active,
.star-button:hover {
  filter: grayscale(0%);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.login-prompt {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.no-reviews {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating .star {
  font-size: 1rem;
}

.review-text {
  margin: 0;
  color: #374151;
  line-height: 1.6;
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

.btn-primary:hover:not(:disabled) {
  background: #3730a3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .book-header {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .book-cover-large {
    height: 300px;
    max-width: 250px;
    margin: 0 auto;
  }

  .book-info h1 {
    font-size: 2rem;
  }

  .book-info h2 {
    font-size: 1.25rem;
  }

  .container {
    padding: 1rem;
  }

  .book-content {
    padding: 1.5rem;
  }
}
</style>
