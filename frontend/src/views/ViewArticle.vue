<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/api";
import Nav from "@/components/Nav.vue";

const router = useRouter();
const route = useRoute();
const serverError = ref("");
const fetchedArticle = ref({ title: "", body: "", user_id: "" });

onMounted(async () => {
  try {
    const response = await api.get(`/articles/view/${route.params.id}.json`);
    fetchedArticle.value = response.data.article;
  } catch (error) {
    serverError.value = "Failed to fetch the article. Please try again.";
    console.error(error);
  }
});
</script>

<template>
  <Nav />

  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-4xl font-bold text-slate-800 mb-6 tracking-tight">
        {{ fetchedArticle.title }}
      </h2>
      <div class="mb-8">
        <router-link
          to="/articles"
          class="text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center w-fit">
          &larr; Back to Articles
        </router-link>
      </div>
      <p
        v-if="serverError"
        class="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg font-semibold">
        {{ serverError }}
      </p>
      <div v-else class="mt-4">
        <p class="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
          {{ fetchedArticle.body }}
        </p>
        <p
          class="mt-10 pt-4 border-t border-slate-100 text-slate-400 text-sm font-medium">
          Written by: {{ fetchedArticle.user_id }}
        </p>
      </div>
    </div>
  </div>
</template>
