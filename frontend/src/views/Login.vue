<script setup>
import Nav from "@/components/Nav.vue";
import api from "@/services/api";
import SubmitButton from "@/components/SubmitButton.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import router from "@/router";

const route = useRoute();

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
    console.log("Logged in: ", response.data);
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
  <Nav />
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
            class="text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center w-fit">
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
