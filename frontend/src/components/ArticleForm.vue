<script setup>
import SubmitButton from './SubmitButton.vue';
</script>

<template>
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light">{{ pageTitle }}</h2>
      <form>
        <div class="mt-2">
          <label class="font-semibold">Title</label>
          <input
            class="my-2 border w-full rounded-md px-3 py-1"
            type="text"
            required />
        </div>
        <div class="mt-2">
          <label class="font-semibold">Body</label>
          <textarea
            class="my-2 border w-full rounded-md px-3 py-1"
            rows="5"
            required></textarea>
        </div>
        <SubmitButton />
      </form>
    </div>
  </div>
</template>
