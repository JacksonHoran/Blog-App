<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { checkAuth } = useAuth();

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <main class="min-h-screen bg-slate-200">
    <router-view />
  </main>
</template>
