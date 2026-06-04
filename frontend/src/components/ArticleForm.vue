<script setup>
import { ref, watch } from "vue";
import SubmitButton from "./SubmitButton.vue";

const props = defineProps({
  initialTitle: { type: String, default: "" },
  initalBody: { type: String, default: "" },
  buttonText: { type: String, default: "Save" },
  errorMessage: { type: String, default: "" },
});

const emit = defineEmits(["submitForm"]);

const title = ref(props.initialTitle);
const body = ref(props.initalBody);

watch(
  () => props.initialTitle,
  (newVal) => (title.value = newVal),
);
watch(
  () => props.initalBody,
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
      <h2 class="text-3xl font-light">{{ pageTitle }}</h2>
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
        <SubmitButton type="submit" text="Save Article" />
      </form>
    </div>
  </div>
</template>
