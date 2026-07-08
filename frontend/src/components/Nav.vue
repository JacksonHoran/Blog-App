<script setup>
import { useAuth } from '@/composables/useAuth';
import api from '@/services/api';
const { isLoggedIn, logout } = useAuth();

import { useRouter } from 'vue-router';
const router = useRouter();

const handleLogout = async () => {
  try {
    await api.post('/users/logout.json'); 
    logout();
    router.push('/login');
  } catch (error) {
    console.error("Failed to destroy session on server", error);
  }
};
</script>

<template>
  <nav class="flex max-w-200 mx-auto mb-4 px-3 py-4 items-center justify-between">
    <div class="text-3xl font-semibold cursor-pointer">My Blog</div>
    
    <div class="space-x-4 flex items-center">
      <router-link v-prefetch :to="isLoggedIn ? '/articles' : '/articles-public'" class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium">Articles</router-link>
      
      <template v-if="!isLoggedIn">
        <router-link to="/login" class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium">Login</router-link>
      </template>

      <template v-else>
        <button 
          @click="handleLogout" 
          class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium">
          Logout
        </button>
      </template>
    </div>
  </nav>
</template> 