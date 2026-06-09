<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/api";
import Nav from "@/components/Nav.vue";

const router = useRouter();
const route = useRoute();
const serverError = ref("");
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
    fetchedArticle.value.created = formatDate(fetchedArticle.created)
    userEmail.value = userResponse.data.user.email;
  } catch (error) {
    serverError.value = "Failed to fetch the article. Please try again.";
    console.error(error);
  }
});

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dateString);
}
</script>

<template>
  <Nav />
  <div class="mb-5">
    <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
      <div class="p-5">
        <h2 class="text-3xl font-light mb-2">
          {{ fetchedArticle.title }}
        </h2>
        <p class="mb-6 text-slate-400 font-medium">
          Written by: {{ userEmail }}
        </p>
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
