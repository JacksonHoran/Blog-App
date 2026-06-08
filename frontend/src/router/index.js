import { createRouter, createWebHistory } from "vue-router";
import Articles from "@/views/Articles.vue";
import Add from "@/views/Add.vue";
import Edit from "@/views/Edit.vue";
import Login from "@/views/Login.vue";
import AddUser from "@/views/AddUser.vue";
import ViewArticle from "@/views/ViewArticle.vue";
import { useAuth } from "@/composables/useAuth";
import ArticlesPublic from "@/views/ArticlesPublic.vue";

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
      path: "/add-user",
      name: "add-user",
      component: AddUser,
    },
    {
      path: "/articles",
      name: "articles-list",
      component: Articles,
    },
    {
      path: "/articles-public",
      name: "articles-list-public",
      component: ArticlesPublic,
    },
    {
      path: "/articles/:id",
      name: "article-details",
      component: ViewArticle,
    },
    {
      path: "/articles/add",
      name: "add-article",
      component: Add,
    },
    {
      path: "/articles/edit/:id",
      name: "edit-article",
      component: Edit,
    },
    {
      path: "/articles/delete/:id",
      name: "delete-article",
      component: Articles,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { isLoggedIn } = useAuth();
  const publicPages = ["login", "add-user", "articles-list-public"];
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !isLoggedIn.value) {
    return next("/login");
  }

  next();
});

export default router;

// POST   /api/login
// POST   /api/logout
// GET    /api/articles
// GET    /api/articles/:id
// POST   /api/articles
// PATCH  /api/articles/:id
// DELETE /api/articles/:id
