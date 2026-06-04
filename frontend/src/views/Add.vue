<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import ArticleForm from "@/components/ArticleForm.vue";
import Nav from "@/components/Nav.vue";

const router = useRouter();
const serverError = ref("");

const handleSubmit = async (payload) => {
  serverError.value = "";
  try {
    await api.post("/articles.json", payload);
    router.push("/articles");
  } catch (error) {
    if (error.response && error.response.stratus === 422) {
      serverError.value = error.response.data.message;
    } else {
      serverError.value = "Failed to create the article. Please try again.";
    }
  }
};
</script>

<template>
  <Nav />
  <ArticleForm 
    button-text="Create Article"
    :error-message="serverError"
    @submit-form="handleSubmit" />
</template>
