# Módulo de Books - BookReview Hub

Este módulo fornece funcionalidades completas de gerenciamento de livros para o sistema BookReview Hub.

## Funcionalidades

### 1. Listagem de livros

- Listar todos os livros disponíveis
- Buscar livro por ID
- Buscar livros por título ou autor
- Listar livros com rating médio

### 2. Criação de livros

- Validação de título e autor únicos
- Criação de novos livros no sistema

### 3. Atualização de livros

- Edição de título e/ou autor
- Validação para evitar duplicatas

### 4. Exclusão de livros

- Remoção de livros do sistema
- Remoção automática de reviews associadas

## Estrutura dos arquivos

```
src/modules/book/
├── book.service.ts      # Lógica de negócio dos livros
├── book.resolvers.ts    # Resolvers GraphQL para books
├── book.types.ts        # Tipos GraphQL para books
└── index.ts            # Exportações do módulo
```

## Como usar

### GraphQL Queries

#### Listar todos os livros

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

#### Buscar livro por ID

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
      }
    }
  }
}
```

#### Buscar livros

```graphql
query {
  searchBooks(query: "Harry Potter") {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

#### Livros com rating

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

### GraphQL Mutations

#### Criar livro

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

#### Atualizar livro

```graphql
mutation {
  updateBook(id: "1", title: "Novo Título") {
    id
    title
    author
    averageRating
    reviewCount
  }
}
```

#### Deletar livro

```graphql
mutation {
  deleteBook(id: "1")
}
```

## Headers de autenticação

Para mutations (criar, atualizar, deletar), inclua o token no header:

```
Authorization: Bearer <jwt-token>
```

## Validações implementadas

- Título e autor são obrigatórios
- Não pode existir livro com mesmo título e autor
- Verificação de autenticação para operações de escrita
- Validação de IDs numéricos
- Remoção em cascata de reviews ao deletar livro

## Campos calculados

- **averageRating**: Média das avaliações (0 se não houver reviews)
- **reviewCount**: Número total de reviews do livro

## Funcionalidades de busca

- Busca por título (case-insensitive no MySQL)
- Busca por autor (case-insensitive no MySQL)
- Busca com operador OR (título OU autor)
