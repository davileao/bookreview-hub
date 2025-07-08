# Módulo de Autenticação - BookReview Hub

Este módulo fornece funcionalidades completas de autenticação para o sistema BookReview Hub.

## Funcionalidades

### 1. Registro de usuário

- Validação de email único
- Validação de nome único
- Hash seguro da senha com bcrypt
- Geração automática de JWT token

### 2. Login de usuário

- Verificação de credenciais
- Validação de senha com bcrypt
- Geração de JWT token para sessão

### 3. Middleware de autenticação

- Extração de token do header Authorization
- Validação e decodificação do JWT
- Injeção do usuário no contexto GraphQL

## Estrutura dos arquivos

```
src/modules/auth/
├── auth.service.ts     # Lógica de negócio da autenticação
├── auth.resolvers.ts   # Resolvers GraphQL para auth
├── auth.types.ts       # Tipos GraphQL para auth
└── index.ts           # Exportações do módulo
```

## Como usar

### GraphQL Mutations

#### Registro

```graphql
mutation {
  register(email: "user@example.com", name: "João Silva", password: "123456") {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Login

```graphql
mutation {
  login(email: "user@example.com", password: "123456") {
    token
    user {
      id
      email
      name
    }
  }
}
```

### GraphQL Queries

#### Obter usuário atual

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
    }
  }
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
- Senha deve ter pelo menos 6 caracteres
- Verificação de autenticação para endpoints protegidos

## Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- JWT tokens assinados com chave secreta de 64 bytes
- Tokens têm expiração de 7 dias
- Validação rigorosa de dados de entrada
