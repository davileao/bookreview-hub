# 🎨 Frontend - Book Review Hub

Frontend for the Book Review Hub application built with Vue.js 3, TypeScript and Pinia, offering a modern and responsive interface for book discovery and review.

## 🛠️ Tech Stack

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Static typing for greater reliability
- **Pinia** - Reactive and modular state management
- **Vue Router** - Routing for Single Page Application
- **Vite** - Modern build tool with instant HMR
- **CSS3** - Styling with Flexbox, Grid and modern gradients

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── AppHeader.vue       # Header with authentication
│   ├── BookCard.vue        # Book card
│   └── SearchBar.vue       # Search bar
├── views/              # Application pages
│   ├── HomeView.vue        # Home page with books
│   ├── BookView.vue        # Book details and reviews
│   └── AdminView.vue       # Administrative panel
├── stores/             # State management (Pinia)
│   ├── auth.ts            # Authentication state
│   └── books.ts           # Books state
├── router/             # Route configuration
│   └── index.ts           # Route definitions
├── utils/              # Utilities
│   └── graphql.ts         # Custom GraphQL client
├── assets/             # Static resources
│   ├── base.css           # Base styles
│   └── main.css           # Main styles
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## 🧩 Main Components

### AppHeader.vue

- Responsive navigation bar
- Integrated login/register modal
- Logged user indicator
- Navigation between pages

### BookCard.vue

- Visual book display
- Basic information (title, author, rating)
- Link to details page
- Responsive design

### SearchBar.vue

- Real-time search
- Debounce for optimization
- Integration with books store

## 📊 Stores (Pinia)

### Auth Store (`stores/auth.ts`)

```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
}

// Main actions:
// - login(email, password)
// - register(name, email, password)
// - logout()
// - checkAuth()
```

### Books Store (`stores/books.ts`)

```typescript
interface BooksState {
  books: Book[]
  currentBook: Book | null
  searchQuery: string
  loading: boolean
}

// Main actions:
// - fetchBooks()
// - searchBooks(query)
// - getBookById(id)
// - createBook(bookData)
// - deleteBook(id)
```

## 🔄 Data Flow

### 1. Initialization

```
main.ts → App.vue → router → views → components
```

### 2. Authentication

```
AppHeader → auth.store → GraphQL API → JWT token → localStorage
```

### 3. Book Management

```
HomeView → books.store → GraphQL API → reactive UI updates
```

### 4. Reviews

```
BookView → review mutations → GraphQL API → UI refresh
```

## 🎨 Styling System

### Custom CSS Variables

```css
:root {
  --primary-color: #3498db --secondary-color: #2ecc71 --danger-color: #e74c3c
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Utility Classes

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card`, `.card-header`, `.card-body`
- `.form-group`, `.form-control`
- `.text-center`, `.text-right`

### Responsive Design

- Flexible layout with CSS Grid and Flexbox
- Breakpoints for mobile, tablet and desktop
- Components that adapt to screen size

## 🛡️ Authentication System

### Login Flow

1. User enters credentials in modal
2. Store sends mutation to GraphQL
3. Backend validates and returns JWT + user data
4. Token saved in localStorage
5. Reactive state updated
6. Automatic redirection

### Route Protection

```typescript
// router/index.ts
{
  path: '/admin',
  component: AdminView,
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

### Session Persistence

- JWT token saved in localStorage
- Automatic verification on initialization
- Automatic logout on invalid token

## 🔍 Search System

### Features

- Real-time search with debounce (300ms)
- Filtering by title and author
- Integration with GraphQL queries
- Visual loading feedback

### Implementation

```typescript
const searchBooks = debounce(async (query: string) => {
  if (!query.trim()) {
    await fetchBooks()
    return
  }

  loading.value = true
  const result = await graphqlRequest(SEARCH_BOOKS_QUERY, { query })
  books.value = result.searchBooks
  loading.value = false
}, 300)
```

## 🚀 Available Scripts

```bash
# Development
npm run dev           # Start development server

# Build
npm run build         # Build for production
npm run preview       # Preview build

# Testing
npm run test:unit     # Unit tests with Vitest
npm run test:e2e      # E2E tests with Playwright

# Code Quality
npm run lint          # ESLint
npm run type-check    # TypeScript type checking
```

## 🔧 Development Configuration

### Environment Variables

```bash
# .env.local
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

## 📱 Implemented Features

### ✅ Basic Features

- [x] Display random books on home
- [x] Search books by title/author
- [x] View book details
- [x] Review system with ratings
- [x] Responsive layout

### ✅ Authentication

- [x] Login/register modal
- [x] Session persistence
- [x] Automatic logout
- [x] Route protection

### ✅ Administrative Area

- [x] Administration panel
- [x] Register new books
- [x] Delete books
- [x] Role-based access control

### ✅ UX/UI

- [x] Modern design with gradients
- [x] Visual loading feedback
- [x] Modals and confirmations
- [x] Complete responsiveness

## 🎯 Next Steps

- [ ] Implement book pagination
- [ ] Add advanced filters
- [ ] Favorites system
- [ ] Cover image upload
- [ ] Toast notifications
- [ ] Dark/light mode
- [ ] PWA (Progressive Web App)

## 🚀 How to Run

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
# Edit .env.local with correct settings
```

3. **Run in development mode:**

```bash
npm run dev
```

4. **Access application:**

```
http://localhost:5173
```

## 📚 Learning Resources

This project demonstrates:

- Vue 3 Composition API
- State management with Pinia
- TypeScript in Vue applications
- GraphQL API integration
- Reusable component patterns
- JWT authentication in frontend
- Protected routing
- Modern responsive design
