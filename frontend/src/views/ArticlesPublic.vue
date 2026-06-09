<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useApiError } from "@/composables/useApiError";

const { getErrorMessage } = useApiError();
const errorMessage = ref("");
const articles = ref([]);

const fetchArticles = async () => {
  errorMessage.value = "";
  try {
    const response = await api.get("/articles.json");
    articles.value = response.data.articles;
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "article list");
    console.error(error);
  }
};

onMounted(() => {
  fetchArticles();
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
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
        >Login</router-link>
      <router-link
        to="/add-user"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Add User</router-link>
    </div>
  </nav>
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light mb-5">Articles</h2>
      <p
        v-if="errorMessage"
        class="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg font-semibold">
        {{ errorMessage }}
      </p>
      <p
        v-else-if="articles.length === 0"
        class="text-xl text-center py-5 font-light">
        No articles published. Please write one.
      </p>
      <div
        v-else
        class="mt-6 overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
                <table class="min-w-full text-left text-sm">
          <thead
            class="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-6 py-4 font-medium">Title</th>
              <th class="px-6 py-4 font-medium hidden sm:table-cell">
                Created
              </th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              class="hover:bg-slate-50 transition-colors">
              <td
                class="px-6 py-4 font-light text-slate-800 max-w-40 truncate">
                {{ article.title }}
              </td>
              <td
                class="px-6 py-4 font-light text-slate-500 hidden sm:table-cell whitespace-nowrap">
                {{ formatDate(article.created) }}
              </td>
              <td
                class="px-6 py-4 font-medium text-right whitespace-nowrap space-x-4">
                <router-link
                  :to="`/articles-public/${article.id}`"
                  class="text-blue-500 hover:text-blue-700 transition-colors">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
