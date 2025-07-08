<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo">
        <h1>📚 Book Review Hub</h1>
      </router-link>

      <nav class="nav">
        <div v-if="!authStore.isAuthenticated" class="auth-buttons">
          <button @click="showLoginModal = true" class="btn btn-outline">Login</button>
          <button @click="showRegisterModal = true" class="btn btn-primary">Registrar</button>
        </div>

        <div v-else class="user-menu">
          <router-link v-if="authStore.isAdmin" to="/admin" class="btn btn-secondary">
            Admin
          </router-link>
          <span class="welcome">Olá, {{ authStore.user?.name }}!</span>
          <button @click="authStore.logout" class="btn btn-outline">Logout</button>
        </div>
      </nav>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="loginForm.email" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Senha:</label>
            <input type="password" v-model="loginForm.password" required class="form-input" />
          </div>
          <div v-if="authStore.error" class="error">
            {{ authStore.error }}
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn btn-outline">Cancelar</button>
            <button type="submit" :disabled="authStore.loading" class="btn btn-primary">
              {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <h2>Registrar</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="registerForm.name" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="registerForm.email" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Senha:</label>
            <input type="password" v-model="registerForm.password" required class="form-input" />
          </div>
          <div v-if="authStore.error" class="error">
            {{ authStore.error }}
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn btn-outline">Cancelar</button>
            <button type="submit" :disabled="authStore.loading" class="btn btn-primary">
              {{ authStore.loading ? 'Registrando...' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
})

const closeModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
  authStore.error = null
}

const handleLogin = async () => {
  try {
    await authStore.login(loginForm.email, loginForm.password)
    closeModals()
    loginForm.email = ''
    loginForm.password = ''
  } catch (error) {
    // Error is handled by the store
  }
}

const handleRegister = async () => {
  try {
    await authStore.register(registerForm.email, registerForm.name, registerForm.password)
    closeModals()
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
  } catch (error) {
    // Error is handled by the store
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome {
  font-weight: 500;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
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

.btn-primary:hover {
  background: #3730a3;
}

.btn-secondary {
  background: #10b981;
  color: white;
}

.btn-secondary:hover {
  background: #059669;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 1px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  color: #333;
}

.modal h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
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

.form-input {
  width: 100%;
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
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.modal-actions .btn {
  color: #333;
}

.modal-actions .btn-outline {
  color: #6b7280;
  border-color: #d1d5db;
}

.modal-actions .btn-outline:hover {
  background: #f9fafb;
  color: #374151;
}
</style>
