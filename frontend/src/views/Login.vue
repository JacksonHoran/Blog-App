<script setup>
import Nav from "@/components/Nav.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <Nav />
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light">Login</h2>
      <form>
        <fieldset class="mt-5">
          <legend class="font-semibold">
            Please enter your email and password
          </legend>
          <div class="mt-2">
            <label class="font-semibold">Email</label>
            <input class="my-2 border w-full rounded-md px-3 py-1" />
          </div>
          <div class="mt-2">
            <label class="font-semibold">Password</label>
            <input
              class="my-2 border w-full rounded-md px-3 py-1"
              type="password" />
          </div>
        </fieldset>
        <div class="flex gap-4">
          <SubmitButton />
          <a
            class="mt-3 py-1 px-3 bg-blue-300 rounded-xl hover:bg-blue-400 shadow-xl cursor-pointer"
            >Add User</a
          >
        </div>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>
