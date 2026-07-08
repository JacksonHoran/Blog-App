import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";

// Views are lazy-loaded so each becomes its own chunk. Navigation only
// pays for a chunk the first time it's needed — and the v-prefetch
// directive can warm it ahead of the click.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/add-user",
      name: "add-user",
      component: () => import("@/views/AddUser.vue"),
    },
    {
      path: "/articles",
      name: "articles-list",
      component: () => import("@/views/Articles.vue"),
      // v-prefetch warms these URLs on hover; the view consumes them via cachedGet()
      meta: { prefetch: () => ["/articles.json"] },
    },
    {
      path: "/articles-public",
      name: "articles-list-public",
      component: () => import("@/views/ArticlesPublic.vue"),
      meta: { prefetch: () => ["/articles.json"] },
    },
    {
      path: "/articles/:id",
      name: "article-details",
      component: () => import("@/views/ViewArticle.vue"),
      meta: { prefetch: (to) => [`/articles/view/${to.params.id}.json`] },
    },
    {
      path: "/articles-public/:id",
      name: "article-details-public",
      component: () => import("@/views/ViewArticlePublic.vue"),
      meta: { prefetch: (to) => [`/articles/view/${to.params.id}.json`] },
    },
    {
      path: "/articles/add",
      name: "add-article",
      component: () => import("@/views/Add.vue"),
    },
    {
      path: "/articles/edit/:id",
      name: "edit-article",
      component: () => import("@/views/Edit.vue"),
      meta: { prefetch: (to) => [`/articles/view/${to.params.id}.json`] },
    },
    {
      path: "/articles/delete/:id",
      name: "delete-article",
      component: () => import("@/views/Articles.vue"),
    },
  ],
});

// The was_logged_in flag in localStorage can outlive the server-side
// session, so verify with the backend once per page load before trusting it.
let authChecked = false;

router.beforeEach(async (to) => {
  const { isLoggedIn, checkAuth } = useAuth();
  if (!authChecked) {
    authChecked = true;
    await checkAuth();
  }
  const publicPages = ["login", "add-user", "articles-list-public", "article-details-public"];
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !isLoggedIn.value) {
    return "/login";
  }
});

export default router;

// POST   /api/login
// POST   /api/logout
// GET    /api/articles
// GET    /api/articles/:id
// POST   /api/articles
// PATCH  /api/articles/:id
// DELETE /api/articles/:id
