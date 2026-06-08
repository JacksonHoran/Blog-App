import { ref } from 'vue';
import api from '@/services/api';

const isLoggedIn = ref(localStorage.getItem('was_logged_in') === 'true');
const currentUser = ref(null);

export function useAuth() {
  
  const checkAuth = async () => {
    try {
      const response = await api.get('/articles/status.json');
      isLoggedIn.value = response.data.loggedIn;
      currentUser.value = response.data.user;
      
      if (response.data.loggedIn) {
        localStorage.setItem('was_logged_in', 'true');
      } else {
        localStorage.removeItem('was_logged_in');
      }

    } catch (error) {
      console.error("Auth check failed:", error);
      isLoggedIn.value = false;
      currentUser.value = null;
      localStorage.removeItem('was_logged_in');
    }
  };

  const login = (userData) => {
    isLoggedIn.value = true;
    currentUser.value = userData;
    localStorage.setItem('was_logged_in', 'true'); 
  };

  const logout = async () => {
    isLoggedIn.value = false;
    currentUser.value = null;
    localStorage.removeItem('was_logged_in'); 
  };

  return {
    isLoggedIn,
    currentUser,
    checkAuth,
    login,
    logout
  };
}