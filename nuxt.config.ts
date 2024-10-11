// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxt/ui"],
  tailwindcss: {
    exposeConfig: true,
    viewer: false,
  },
  runtimeConfig: {
    public: {
      turnstileSitekey: process.env.TURNSTILE_SITEKEY,
      apiUrl: process.env.API_URL,
      websiteUrl: process.env.WEBSITE_URL,
    },
  },
});
