<script setup>
import api from "@/services/api";
import SubmitButton from "@/components/SubmitButton.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import router from "@/router";
import { useApiError } from "@/composables/useApiError";

const route = useRoute();
const { getErrorMessage } = useApiError();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  try {
    const response = await api.post("/users/add.json", {
      email: email.value,
      password: password.value,
    });
    console.log("User added: ", response.data);
    router.push("/login");
  } catch (error) {
    if (error.response?.status === 422) {
      errorMessage.value = "User already exists. Try another email.";
    } else {
      errorMessage.value = getErrorMessage(error);
    }
  }
};
</script>

<template>
  <nav
    class="flex max-w-200 mx-auto mb-4 px-1 py-4 items-center justify-between">
    <div class="text-3xl font-semibold cursor-pointer">My Blog</div>
    <div class="space-x-4 flex items-center">
      <router-link
        to="/login"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Login</router-link>
      <router-link
        to="/articles-public"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Articles</router-link>
    </div>
  </nav>
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light">Add New User</h2>
      <form @submit.prevent="handleSubmit">
        <fieldset class="mt-5">
          <legend class="font-semibold">
            Please enter your email and password
          </legend>
          <div class="mt-2">
            <label class="font-semibold">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="my-2 border w-full rounded-md px-3 py-1" />
          </div>
          <div class="mt-2">
            <label class="font-semibold">Password</label>
            <input
              v-model="password"
              required
              class="my-2 border w-full rounded-md px-3 py-1"
              type="text" />
          </div>
        </fieldset>
        <div class="flex gap-4 pt-3">
          <SubmitButton />
          <router-link
            to="/login"
            class="text-blue-500 hover:text-blue-700 transition-colors font-medium">
            Cancel</router-link>
        </div>
      </form>
      <p
        v-if="errorMessage"
        class="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg font-semibold">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
