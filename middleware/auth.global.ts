export default defineNuxtRouteMiddleware((to, from) => {
  const { $token } = use$auth();
  const path = to.path;
  if (path !== "/login") {
    if (!$token.value) {
      return navigateTo({ path: "/login", query: { _to: from.fullPath } });
    }
  }
});
