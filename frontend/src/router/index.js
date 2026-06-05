import { createRouter, createWebHistory } from "vue-router";
import ArticleForm from "@/components/ArticleForm.vue";
import Articles from "@/views/Articles.vue";
import Login from "@/views/Login.vue";
import AddUser from "@/views/AddUser.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/logout",
        name: "logout",
        component: Login,
    },
    {
      path: '/add-user',
      name: 'add-user',
      component: AddUser
    },
    {
      path: "/articles",
      name: "articles-list",
      component: Articles,
    },
    {
      path: "/articles/:id",
      name: "article-details",
      component: Articles,
    },
    {
      path: "/articles/add",
      name: "add-article",
      component: ArticleForm,
    },
    {
      path: "/articles/edit/:id",
      name: "edit-article",
      component: ArticleForm,
    },
    {
        path: '/articles/delete/:id',
        name: 'delete-article',
        component: Articles,
    },

  ],
});

export default router;

// POST   /api/login
// POST   /api/logout
// GET    /api/articles
// GET    /api/articles/:id
// POST   /api/articles
// PATCH  /api/articles/:id
// DELETE /api/articles/:id