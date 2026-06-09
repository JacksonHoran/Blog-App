<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { checkAuth } = useAuth();

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <main class="bg-slate-200 min-h-screen pb-10">
    <router-view />
  </main>
</template>
