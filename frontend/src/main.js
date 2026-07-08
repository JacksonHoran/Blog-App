import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './services/api'
import { useAuth } from './composables/useAuth'
import prefetch from './directives/prefetch'

// A 401 from any endpoint means the server-side session is gone (it can
// expire while the UI still looks logged in). Clear local auth state and
// send the user to the login page instead of failing silently.
// The login endpoint is excluded: its 401 just means "wrong credentials".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';
    if (status === 401 && !url.includes('/users/login')) {
      const { logout } = useAuth();
      logout();
      if (router.currentRoute.value.name !== 'login') {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  },
);

const app = createApp(App);
app.use(router);
app.directive('prefetch', prefetch);
app.mount('#app');