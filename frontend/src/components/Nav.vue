<script setup></script>

<template>
  <nav class="flex max-w-200 mx-auto mb-5 px-1 py-4 items-center justify-between">
    <div>
      <router-link to="/articles" class="text-3xl font-semibold cursor-pointer">Full Stack Blog</router-link>

    </div>
    <div>
      <router-link to="/articles" class="px-2 text-xl cursor-pointer">Articles</router-link>
      <router-link to="/logout" class="px-2 text-xl cursor-pointer">Log Out</router-link>
    </div>
  </nav>
</template>
