# 📚 Book Review Hub

A complete book review system built with modern technologies, demonstrating full-stack development best practices.

## 🎯 About the Project

Book Review Hub is a platform where users can discover books, read reviews from other readers, and share their own reading experiences. The project includes authentication features, book search, review system, and administrative panel.

## 🚀 Technologies Used

### Frontend

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Static typing for JavaScript
- **Pinia** - Modern state management for Vue
- **Vue Router** - Routing for SPA
- **Vite** - Modern and fast build tool
- **CSS3** - Styling with Flexbox/Grid and gradients

### Backend

- **Node.js** - JavaScript runtime
- **TypeScript** - Static typing
- **GraphQL** - API query language with Apollo Server
- **Prisma** - Modern ORM for TypeScript
- **MySQL** - Relational database
- **JWT** - Stateless authentication
- **bcrypt** - Password hashing

## 🏗️ Architecture and Patterns

### Development Patterns

- **Modular Architecture**: Clear separation between frontend and backend
- **API-First Design**: Decoupled GraphQL backend from frontend
- **Component-Based Architecture**: Reusable Vue components
- **State Management**: Centralized management with Pinia
- **Type Safety**: TypeScript throughout the project for greater reliability
- **Repository Pattern**: Services organized by domain

### Project Structure

```
bookreview-hub/
├── frontend/          # Vue.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── views/         # Application pages
│   │   ├── stores/        # State management (Pinia)
│   │   ├── router/        # Route configuration
│   │   └── utils/         # Utilitários e helpers
├── backend/           # API GraphQL
│   ├── src/
│   │   ├── modules/       # Domain-organized modules
│   │   ├── lib/           # Libraries and utilities
│   │   └── prisma/        # Database schema and migrations
└── docs/              # Additional documentation
```

## ✨ Features

### For Users

- 🔐 **Authentication**: Secure registration and login
- 📖 **Book Catalog**: Browse books with search functionality
- ⭐ **Review System**: Rate and comment on books
- 🎨 **Responsive Interface**: Modern and adaptive design

### For Administrators

- 📚 **Book Management**: Add and remove books from catalog
- 👥 **Admin Panel**: Dedicated interface for administration
- 📊 **Statistics**: View review and rating data

## 🛠️ How to Run

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables (Backend)

```env
DATABASE_URL="mysql://user:password@localhost:3306/bookreview_hub"
JWT_SECRET="your-jwt-secret"
```

## 📱 Preview

- **Homepage**: Book catalog with search
- **Book Details**: Reviews and option to add rating
- **Admin Panel**: Complete book management
- **Authentication**: Login/register modal

## 📸 Screenshots

### 🏠 Homepage

![Homepage](https://github.com/user-attachments/assets/56c0689c-125c-4af9-bd93-f9c6499bf711)

_Modern book catalog with search functionality and featured books_

### 📖 Book Details Page

![Book Details](https://github.com/user-attachments/assets/ba19cee6-bf34-4960-a7ea-f416d7a582e4)
_Detailed book view with reviews, ratings, and option to add your own review_

### 🔐 Authentication

![Login Modal](https://github.com/user-attachments/assets/dfea7e13-8a88-4af9-86cf-1ad8b295e006)

_Clean and secure login/register modal with form validation_

### ⭐ Review System

![Add Review](https://github.com/user-attachments/assets/0f0cc5a1-f37b-4e46-b690-1564b5d0db47)

_Interactive review system with star rating and comment functionality_

### 👑 Admin Panel

![Admin Panel](https://github.com/user-attachments/assets/ffdf149b-0f14-4ae1-9226-623f1a9f3ddb)
_Complete administrative interface for book and user management_

### 📱 Mobile Responsive

![Mobile View](https://github.com/user-attachments/assets/5e20b920-1d75-4b5e-8d0a-b180237a85be)

_Fully responsive design optimized for mobile devices_

## 🎨 Design System

- **Colors**: Purple/blue gradients for main elements
- **Typography**: Inter font for modern readability
- **Components**: Consistent system of buttons, cards and modals
- **Responsiveness**: Mobile-first approach

## 🚀 Deploy

The project is configured for deployment on:

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku
- **Database**: PlanetScale, Railway

## 📚 Learning and Demonstrations

This project demonstrates:

1. **Well-structured Full-Stack Architecture**
2. **GraphQL** as an alternative to REST
3. **TypeScript** for greater reliability
4. **Modern State Management** with Pinia
5. **JWT Authentication** correctly implemented
6. **UI/UX** focused on user experience
7. **Clean and organized Code Patterns**

## 🤝 Contributing

Este é um projeto de portfólio, mas sugestões são bem-vindas!

### 📸 Contribuindo com Screenshots

Para ajudar a manter as capturas de tela atualizadas:

1. Execute o projeto localmente
2. Consulte o guia em `docs/screenshots/README.md`
3. Capture as telas seguindo as diretrizes
4. Envie um Pull Request com as novas imagens

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---
