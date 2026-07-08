<script setup>
import { ref, watch } from "vue";
import SubmitButton from "./SubmitButton.vue";

const props = defineProps({
  formTitle: { type: String, default: "New Article" },
  initialTitle: { type: String, default: "" },
  initialBody: { type: String, default: "" },
  buttonText: { type: String, default: "Save Article" },
  errorMessage: { type: String, default: "" },
});

const emit = defineEmits(["submitForm"]);

const title = ref(props.initialTitle);
const body = ref(props.initialBody);

watch(
  () => props.initialTitle,
  (newVal) => (title.value = newVal),
);
watch(
  () => props.initialBody,
  (newVal) => (body.value = newVal),
);

const handleSubmit = () => {
  emit("submitForm", {
    title: title.value,
    body: body.value,
  });
};
</script>

<template>
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light">{{ formTitle }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mt-2">
          <label class="font-semibold">Title</label>
          <input
            v-model="title"
            class="my-2 border w-full rounded-md px-3 py-1"
            type="text"
            required />
        </div>
        <div class="mt-2">
          <label class="font-semibold">Body</label>
          <textarea
            v-model="body"
            class="my-2 border w-full rounded-md px-3 py-1"
            rows="5"
            required></textarea>
        </div>
        <div class="flex pt-3 gap-4">
          <SubmitButton :text="buttonText" />
          <router-link
            v-prefetch
            to="/articles"
            class="text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center w-fit">
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
