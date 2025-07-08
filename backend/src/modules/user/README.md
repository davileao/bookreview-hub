# Módulo de Users - BookReview Hub

Este módulo fornece funcionalidades completas de gerenciamento de usuários para o sistema BookReview Hub.

## Funcionalidades

### 1. Consulta de usuários

- Listar todos os usuários
- Buscar usuário por ID
- Buscar usuário por email
- Buscar usuários por nome ou email
- Ver estatísticas do usuário

### 2. Perfil do usuário

- Ver informações do usuário logado
- Atualizar perfil (nome, email, senha)
- Ver reviews do usuário logado
- Ver estatísticas pessoais

### 3. Rankings e estatísticas

- Top usuários por número de reviews
- Estatísticas individuais dos usuários
- Gênero favorito (baseado no autor mais avaliado)

### 4. Gerenciamento de conta

- Deletar conta própria
- Verificação de senha para operações sensíveis

## Estrutura dos arquivos

```
src/modules/user/
├── user.service.ts      # Lógica de negócio dos usuários
├── user.resolvers.ts    # Resolvers GraphQL para users
├── user.types.ts        # Tipos GraphQL para users
└── index.ts            # Exportações do módulo
```

## Como usar

### GraphQL Queries

#### Listar todos os usuários

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
        author
      }
    }
  }
}
```

#### Buscar usuário por ID

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

#### Buscar usuário por email

```graphql
query {
  userByEmail(email: "joao@exemplo.com") {
    id
    name
    email
    reviewCount
    averageRating
  }
}
```

#### Buscar usuários

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

#### Ver estatísticas de um usuário

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

#### Ver top usuários

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

### Queries autenticadas

#### Ver informações do usuário logado

```graphql
query {
  me {
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

#### Ver minhas estatísticas

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

#### Ver meus reviews

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

### GraphQL Mutations

#### Atualizar perfil

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

#### Atualizar email

```graphql
mutation {
  updateProfile(email: "novoemail@exemplo.com") {
    id
    name
    email
  }
}
```

#### Alterar senha

```graphql
mutation {
  updateProfile(currentPassword: "senhaatual123", newPassword: "novasenha456") {
    id
    name
    email
  }
}
```

#### Atualizar múltiplos campos

```graphql
mutation {
  updateProfile(
    name: "João Silva Santos"
    email: "joao.santos@exemplo.com"
    currentPassword: "senhaatual123"
    newPassword: "novasenha456"
  ) {
    id
    name
    email
  }
}
```

#### Deletar conta

```graphql
mutation {
  deleteAccount(password: "minhasenha123")
}
```

## Headers de autenticação

Para queries/mutations protegidas, inclua o token no header:

```
Authorization: Bearer <jwt-token>
```

## Validações implementadas

- Email deve ter formato válido
- Nome e email devem ser únicos
- Senha atual obrigatória para alterar senha
- Nova senha deve ter pelo menos 6 caracteres
- Senha obrigatória para deletar conta
- Verificação de autenticação para operações protegidas

## Campos calculados

- **reviewCount**: Número total de reviews do usuário
- **averageRating**: Média das avaliações dadas pelo usuário
- **favoriteGenre**: Autor mais avaliado pelo usuário

## Funcionalidades de busca

- Busca por nome (case-insensitive no MySQL)
- Busca por email (case-insensitive no MySQL)
- Busca com operador OR (nome OU email)

## Operações sensíveis

- Atualização de senha requer senha atual
- Deleção de conta requer senha
- Cascata: ao deletar usuário, remove todos os reviews

## Top Users

- Ranking por número de reviews
- Limite configurável (padrão: 10)
- Inclui média de avaliações
