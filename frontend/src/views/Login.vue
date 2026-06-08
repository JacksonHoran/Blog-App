<script setup>
import api from "@/services/api";
import SubmitButton from "@/components/SubmitButton.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login } = useAuth();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    const response = await api.post("/users/login.json", {
      email: email.value,
      password: password.value,
    });
    login(response.data.user);
    router.push("/articles");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "A server error occurred. Please try again later.";
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
        to="/articles"
        class="px-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700 transition-colors font-medium"
        >Articles</router-link>
    </div>
  </nav>
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light">Login</h2>
      <form @submit.prevent="handleLogin">
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
              type="password" />
          </div>
        </fieldset>
        <div class="flex pt-3 gap-4">
          <SubmitButton />
          <router-link
            to="/add-user"
            class="text-blue-500 hover:text-blue-700 transition-colors font-medium">
            Add User</router-link
          >
        </div>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 font-semibold">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
