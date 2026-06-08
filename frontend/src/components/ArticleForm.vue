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
        <div class="flex gap-4">
          <SubmitButton :text="buttonText"/>
          <router-link
            to="/articles"
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
