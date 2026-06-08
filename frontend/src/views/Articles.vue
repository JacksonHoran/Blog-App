<script setup>
import { ref, onMounted} from "vue";
import router from "@/router";
import api from "@/services/api";
import Nav from "@/components/Nav.vue";

const serverError = ref("");
const articles = ref([]);
const isDeleteModalOpen = ref(false);
const articleToDelete = ref(null);

const fetchArticles = async () => {
  try {
    const response = await api.get("/articles.json");
    console.log("Raw API Response:", response.data);
    articles.value = response.data.articles;
  } catch (error) {
    serverError.value = "Failed to fetch articles. Please try again.";
    console.error(error);
  }
};

const promptDelete = (id) => {
  articleToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  articleToDelete.value = null;
};

const confirmDelete = async () => {
  if (!articleToDelete.value) return;
  try {
    await api.delete(`/articles/delete/${articleToDelete.value}.json`);
    await fetchArticles();
    isDeleteModalOpen.value = false;
    articleToDelete.value = null;
  } catch (error) {
    console.error('Article deletion failed:', error);
  }
}

onMounted(() => {
  fetchArticles();
});
</script>

<template>
  <Nav />
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light mb-5">Articles</h2>
      <router-link
        class="py-1 px-3 bg-blue-300 rounded-xl hover:bg-blue-400 shadow-xl cursor-pointer"
        to="/articles/add">
        New Article</router-link>
      <p v-if="serverError" class="mt-4 text-red-500 font-semibold">
        {{ serverError }}
      </p>
      <p v-else-if="articles.length === 0">
        No articles found. Please write one.
      </p>
      <div v-else class="mt-6 overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table class="min-w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-6 py-4 font-medium">Title</th>
              <th class="px-6 py-4 font-medium">Created</th>
              <th class="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr 
              v-for="article in articles" 
              :key="article.id" 
              class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-light text-slate-800">
                {{ article.title }}
              </td>
              <td class="px-6 py-4 font-light text-slate-500">
                {{ article.created }}
              </td>
              <td class="px-6 py-4 font-medium text-right space-x-4">
                <router-link :to="`/articles/${article.id}`" class="text-blue-500 hover:text-blue-700 transition-colors">
                  View
                </router-link>
                <router-link :to="`/articles/edit/${article.id}`" class="text-blue-500 hover:text-blue-700 transition-colors">
                  Edit
                </router-link>
                <button @click="promptDelete(article.id)" class="text-red-500 hover:text-red-700 transition-colors">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div 
    v-if="isDeleteModalOpen" 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all">
      <h3 class="text-xl font-medium text-slate-800 mb-2">Delete Article?</h3>
      <p class="text-slate-500 font-light mb-6">
        Are you sure you want to delete this article? This action cannot be undone.
      </p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="cancelDelete" 
          class="px-4 py-2 font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
          Cancel
        </button>
        <button 
          @click="confirmDelete" 
          class="px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>
