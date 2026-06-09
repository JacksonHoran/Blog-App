<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/api";
import { useApiError } from "@/composables/useApiError";

const { getErrorMessage } = useApiError();
const router = useRouter();
const route = useRoute();
const errorMessage = ref("");
const fetchedArticle = ref({});
const userEmail = ref("");

onMounted(async () => {
  try {
    const ArticleResponse = await api.get(
      `/articles/view/${route.params.id}.json`,
    );
    const userResponse = await api.get(
      `/users/view/${ArticleResponse.data.article.user_id}.json`,
    );
    fetchedArticle.value = ArticleResponse.data.article;
    fetchedArticle.value.created = formatDate(fetchedArticle.value.created);
    userEmail.value = userResponse.data.user.email;
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "article");
    console.error(error);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
};
</script>

<template>
  <nav
    class="flex max-w-200 mx-auto mb-4 px-3 py-4 items-center justify-between">
    <div class="text-3xl font-semibold cursor-pointer">My Blog</div>
    <div class="space-x-4 flex items-center">
      <router-link
        to="/login"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Login</router-link
      >
      <router-link
        to="/articles-public"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Articles</router-link
      >
    </div>
  </nav>
  <div class="mb-5">
    <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
      <div class="p-5">
        <div class="mb-5">
          <router-link
            to="/articles-public"
            class="text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center w-fit">
            &larr; All Articles
          </router-link>
        </div>
        <h2 class="text-3xl font-light mb-2">
          {{ fetchedArticle.title }}
        </h2>
        <p class="mb-6 text-slate-400 font-medium">
          Written by: {{ userEmail }}
        </p>
        <p
          v-if="errorMessage"
          class="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg font-semibold">
          {{ errorMessage }}
        </p>
        <div v-else class="mt-4">
          <p class="text-lg whitespace-pre-wrap">
            {{ fetchedArticle.body }}
          </p>
          <p class="mt-5 mb-2 text-slate-400 font-medium">
            Published on {{ fetchedArticle.created }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
