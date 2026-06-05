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
    if (error.response && error.response.status === 422) {
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
        <div class="flex gap-4">
          <SubmitButton />
          <router-link
            to="/login"
            class="mt-3 py-1 px-3 bg-blue-300 rounded-xl hover:bg-blue-400 shadow-xl cursor-pointer"
            >Cancel</router-link>
        </div>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 font-semibold">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
