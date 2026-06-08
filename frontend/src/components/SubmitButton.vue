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
    class="text-blue-500 hover:text-blue-700 transition-colors font-medium flex items-center w-fit">
    {{ text }}
  </button>
</template>
