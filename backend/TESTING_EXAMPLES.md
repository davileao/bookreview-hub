# Exemplos de Queries e Mutations - BookReview Hub

## Como testar o servidor

1. Iniciar o servidor:

```bash
npm run dev
```

2. Acessar o Apollo Studio em: `http://localhost:4000/`

## Fluxo de teste completo

### 1. Registrar um usuário

```graphql
mutation {
  register(email: "joao@exemplo.com", name: "João Silva", password: "123456") {
    token
    user {
      id
      email
      name
    }
  }
}
```

### 2. Fazer login (alternativamente)

```graphql
mutation {
  login(email: "joao@exemplo.com", password: "123456") {
    token
    user {
      id
      email
      name
    }
  }
}
```

**Importante**: Copie o `token` retornado e adicione no header das próximas requisições:

```
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

### 3. Criar livros

```graphql
mutation {
  createBook(title: "O Senhor dos Anéis", author: "J.R.R. Tolkien") {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

```graphql
mutation {
  createBook(
    title: "Harry Potter e a Pedra Filosofal"
    author: "J.K. Rowling"
  ) {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

### 4. Listar todos os livros

```graphql
query {
  books {
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
        name
      }
    }
  }
}
```

### 5. Buscar livro específico

```graphql
query {
  book(id: "1") {
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
        name
        email
      }
    }
  }
}
```

### 6. Criar reviews

```graphql
mutation {
  createReview(
    bookId: "1"
    rating: 5
    text: "Excelente livro! Uma obra-prima da fantasia."
  ) {
    id
    rating
    text
    user {
      name
    }
    book {
      title
    }
  }
}
```

```graphql
mutation {
  createReview(bookId: "1", rating: 4, text: "Muito bom, recomendo!") {
    id
    rating
    text
    user {
      name
    }
    book {
      title
    }
  }
}
```

### 7. Ver informações do usuário logado

```graphql
query {
  me {
    id
    email
    name
    reviews {
      id
      rating
      text
      book {
        title
        author
      }
    }
  }
}
```

### 8. Buscar livros

```graphql
query {
  searchBooks(query: "Harry") {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

### 9. Ver livros com rating

```graphql
query {
  booksWithRating {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

### 10. Atualizar livro

```graphql
mutation {
  updateBook(id: "1", title: "O Senhor dos Anéis - A Sociedade do Anel") {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

### 11. Atualizar review

```graphql
mutation {
  updateReview(
    id: "1"
    rating: 5
    text: "Obra-prima absoluta da literatura fantástica!"
  ) {
    id
    rating
    text
    user {
      name
    }
    book {
      title
    }
  }
}
```

### 12. Deletar review

```graphql
mutation {
  deleteReview(id: "2")
}
```

### 13. Deletar livro

```graphql
mutation {
  deleteBook(id: "2")
}
```

### 14. Listar todos os usuários

```graphql
query {
  users {
    id
    name
    email
    reviewCount
    averageRating
    reviews {
      id
      rating
      text
      book {
        title
      }
    }
  }
}
```

### 15. Buscar usuário específico

```graphql
query {
  user(id: "1") {
    id
    name
    email
    reviewCount
    averageRating
    reviews {
      id
      rating
      text
      book {
        title
        author
      }
    }
  }
}
```

### 16. Ver estatísticas de usuário

```graphql
query {
  userStats(id: "1") {
    id
    name
    email
    reviewCount
    averageRating
    favoriteGenre
  }
}
```

### 17. Ver minhas estatísticas (autenticado)

```graphql
query {
  myStats {
    id
    name
    email
    reviewCount
    averageRating
    favoriteGenre
  }
}
```

### 18. Ver top usuários

```graphql
query {
  topUsers(limit: 5) {
    id
    name
    email
    reviewCount
    averageRating
  }
}
```

### 19. Buscar usuários

```graphql
query {
  searchUsers(query: "João") {
    id
    name
    email
    reviewCount
    averageRating
  }
}
```

### 20. Ver meus reviews (autenticado)

```graphql
query {
  myReviews {
    id
    rating
    text
    book {
      id
      title
      author
    }
  }
}
```

### 21. Atualizar perfil (autenticado)

```graphql
mutation {
  updateProfile(name: "João Silva Santos") {
    id
    name
    email
    reviewCount
    averageRating
  }
}
```

### 22. Atualizar email (autenticado)

```graphql
mutation {
  updateProfile(email: "novoemail@exemplo.com") {
    id
    name
    email
  }
}
```

### 23. Alterar senha (autenticado)

```graphql
mutation {
  updateProfile(currentPassword: "123456", newPassword: "novasenha789") {
    id
    name
    email
  }
}
```

### 24. Deletar conta (autenticado)

```graphql
mutation {
  deleteAccount(password: "novasenha789")
}
```

## Queries sem autenticação

Estas queries podem ser executadas sem token:

```graphql
query {
  books {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

```graphql
query {
  reviews {
    id
    rating
    text
    user {
      name
    }
    book {
      title
      author
    }
  }
}
```

## Testando erros

### Tentar criar livro sem autenticação

```graphql
mutation {
  createBook(title: "Teste", author: "Autor Teste") {
    id
    title
  }
}
```

**Resultado esperado**: Erro "Not authenticated"

### Tentar criar livro duplicado

```graphql
mutation {
  createBook(title: "O Senhor dos Anéis", author: "J.R.R. Tolkien") {
    id
    title
  }
}
```

**Resultado esperado**: Erro "A book with this title and author already exists"

## Testando erros de usuários

### Tentar atualizar perfil sem autenticação

```graphql
mutation {
  updateProfile(name: "Novo Nome") {
    id
    name
  }
}
```

**Resultado esperado**: Erro "Not authenticated"

### Tentar usar email já existente

```graphql
mutation {
  updateProfile(email: "joao@exemplo.com") {
    id
    email
  }
}
```

**Resultado esperado**: Erro "Email is already taken"

### Tentar alterar senha com senha atual incorreta

```graphql
mutation {
  updateProfile(currentPassword: "senhaerrada", newPassword: "novasenha123") {
    id
    name
  }
}
```

**Resultado esperado**: Erro "Current password is incorrect"

### Tentar deletar conta com senha incorreta

```graphql
mutation {
  deleteAccount(password: "senhaerrada")
}
```

**Resultado esperado**: Erro "Invalid password"
