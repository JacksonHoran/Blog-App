<script setup>
import Nav from "../components/Nav.vue";
</script>

<template>
  <Nav />
  <div class="bg-slate-100 max-w-200 mx-auto shadow-xl">
    <div class="p-5">
      <h2 class="text-3xl font-light mb-5">Articles</h2>
      <router-link
        class="py-1 px-3 bg-blue-300 rounded-xl hover:bg-blue-400 shadow-xl cursor-pointer"
        to="/articles/add"
        >New Article</router-link>
      <table class="table-auto w-full mt-8">
        <thead class="text-left">
          <th>Title</th>
          <th>Author</th>
          <th>Created</th>
          <th>Action</th>
        </thead>
        <tbody>
          <tr>
            <td class="py-3">
              The Sliding Mr. Bones (Next Stop, Pottersville)
            </td>
            <td>Jackson Horan</td>
            <td>6/4/26</td>
            <td>Edit Delete</td>
          </tr>
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Jackson Horan</td>
            <td>6/4/26</td>
            <td><a>Edit</a> <a>Delete</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
