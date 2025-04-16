import { useAuthApi } from "@/api/authApi";
import { defineStore } from "pinia";
import { reactive } from "vue";

const jwtKey = 'jwt';

export const useAuthStore = defineStore('auth', () => {
  const authApi = useAuthApi();

  const authData = reactive({
    profile: null
  });

  async function setJwt(accessToken) {
    localStorage.setItem(jwtKey, accessToken);
    const profile = await authApi.getProfile();
    authData.profile = profile;
  }

  return {authData, setJwt}
})