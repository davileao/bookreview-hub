<template>
  <div class="book-card" @click="goToBook">
    <div class="book-cover">
      <div class="book-spine">
        <h3>{{ book.title }}</h3>
        <p>{{ book.author }}</p>
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">por {{ book.author }}</p>
      <div class="rating">
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
        <span class="rating-text">
          {{ book.averageRating.toFixed(1) }} ({{ book.reviewCount }}
          {{ book.reviewCount === 1 ? 'review' : 'reviews' }})
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/stores/books'

const props = defineProps<{
  book: Book
}>()

const router = useRouter()

const goToBook = () => {
  router.push(`/book/${props.book.id}`)
}
</script>

<script lang="ts">
export default {
  name: 'BookCard',
}
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.book-cover {
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  perspective: 1000px;
}

.book-spine {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: white;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.book-spine::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.book-spine h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
}

.book-spine p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.book-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.book-author {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-style: italic;
}

.rating {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: filter 0.2s;
}

.star.active {
  filter: grayscale(0%);
}

.rating-text {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .book-card {
    padding: 1rem;
  }

  .book-cover {
    height: 150px;
  }

  .book-spine h3 {
    font-size: 1rem;
  }

  .book-spine p {
    font-size: 0.8rem;
  }
}
</style>
