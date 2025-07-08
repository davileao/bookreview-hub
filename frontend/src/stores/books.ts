import { defineStore } from 'pinia'
import { ref } from 'vue'
import { graphqlRequest } from '@/utils/graphql'

const BOOKS_QUERY = `
  query Books {
    books {
      id
      title
      author
      averageRating
      reviewCount
    }
  }
`

const BOOK_QUERY = `
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      averageRating
      reviewCount
      reviews {
        id
        rating
        text
        user {
          id
          name
        }
      }
    }
  }
`

const SEARCH_BOOKS_QUERY = `
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      id
      title
      author
      averageRating
      reviewCount
    }
  }
`

const CREATE_REVIEW_MUTATION = `
  mutation CreateReview($bookId: ID!, $rating: Int!, $text: String!) {
    createReview(bookId: $bookId, rating: $rating, text: $text) {
      id
      rating
      text
      user {
        id
        name
      }
    }
  }
`

const CREATE_BOOK_MUTATION = `
  mutation CreateBook($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      id
      title
      author
      averageRating
      reviewCount
    }
  }
`

const DELETE_BOOK_MUTATION = `
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`

export interface Book {
  id: string
  title: string
  author: string
  averageRating: number
  reviewCount: number
  reviews?: Review[]
}

export interface Review {
  id: string
  rating: number
  text: string
  user: {
    id: string
    name: string
  }
}

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const currentBook = ref<Book | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBooks = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(BOOKS_QUERY)
      books.value = result.books || []
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar livros'
      console.error('Error fetching books:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchBook = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(BOOK_QUERY, { id })
      currentBook.value = result.book || null
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar livro'
      console.error('Error fetching book:', err)
    } finally {
      loading.value = false
    }
  }

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      await fetchBooks()
      return
    }

    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(SEARCH_BOOKS_QUERY, { query })
      books.value = result.searchBooks || []
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar livros'
      console.error('Error searching books:', err)
    } finally {
      loading.value = false
    }
  }

  const createReview = async (bookId: string, rating: number, text: string) => {
    try {
      const result = await graphqlRequest(CREATE_REVIEW_MUTATION, { bookId, rating, text })

      // Refresh current book to show new review
      if (currentBook.value?.id === bookId) {
        await fetchBook(bookId)
      }

      return result.createReview
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar review'
      throw err
    }
  }

  const createBook = async (title: string, author: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(CREATE_BOOK_MUTATION, { title, author })

      // Refresh books list to show new book
      await fetchBooks()

      return result.createBook
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar livro'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await graphqlRequest(DELETE_BOOK_MUTATION, { id })

      // Refresh books list to remove deleted book
      await fetchBooks()

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao excluir livro'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    currentBook,
    loading,
    error,
    fetchBooks,
    fetchBook,
    searchBooks,
    createReview,
    createBook,
    deleteBook,
  }
})
