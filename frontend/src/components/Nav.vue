<script setup>
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

const handleLogout = async () => {
  try {
    await api.post('/users/logout.json');
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
</script>

<template>
  <nav class="flex max-w-200 mx-auto mb-5 px-1 py-4 items-center justify-between">
    <div>
      <router-link to="/articles" class="text-3xl font-semibold cursor-pointer">Full Stack Blog</router-link>

    </div>
    <div class="items-center">
      <router-link to="/articles" class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium">Articles</router-link>
      <button @click="handleLogout" class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium">Logout</button>
    </div>
  </nav>
</template>
          
