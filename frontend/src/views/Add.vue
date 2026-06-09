<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import ArticleForm from "@/components/ArticleForm.vue";
import Nav from "@/components/Nav.vue";
import { useApiError } from "@/composables/useApiError";

const { getErrorMessage } = useApiError();
const router = useRouter();
const serverError = ref("");

const handleSubmit = async (payload) => {
  serverError.value = "";
  try {
    await api.post("/articles/add.json", payload);
    router.push("/articles");
  } catch (error) {
    serverError.value = getErrorMessage(error, "article");
    console.error(error);
  }
};
</script>

<template>
  <Nav />
  <ArticleForm 
    :error-message="serverError"
    @submit-form="handleSubmit" />
</template>
