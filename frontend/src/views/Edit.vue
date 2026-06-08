<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/api";
import ArticleForm from "@/components/ArticleForm.vue";
import Nav from "@/components/Nav.vue";

const router = useRouter();
const route = useRoute();
const serverError = ref("");
const fetchedArticle = ref({ title: "", body: "" });

onMounted(async () => {
  try {
    const response = await api.get(`/articles/view/${route.params.id}.json`);
    fetchedArticle.value = response.data.article;
  } catch (error) {
    serverError.value = "Failed to fetch the article. Please try again.";
    console.error(error);
  }
});

const handleEditSubmit = async (payload) => {
  try {
    await api.patch(`/articles/edit/${route.params.id}.json`, payload);
    router.push("/articles");
  } catch (error) {
    serverError.value = "Failed to edit the article. Please try again.";
    console.error(error);
  }
};
</script>

<template>
  <Nav />
  <ArticleForm
    form-title="Edit Article"
    button-text="Save Changes"
    :initial-title="fetchedArticle.title"
    :initial-body="fetchedArticle.body"
    :error-message="serverError"
    @submit-form="handleEditSubmit" />
</template>
