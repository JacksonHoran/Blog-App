<script setup>
defineProps({
  type: {
    type: String,
    default: "submit",
  },
  text: {
    type: String,
    default: "Submit",
  },
});
</script>

<template>
  <button
    :type="type"
    class="mt-3 py-1 px-3 bg-blue-300 rounded-xl hover:bg-blue-400 shadow-xl cursor-pointer">
    {{ text }}
  </button>
</template>
