export default defineNuxtRouteMiddleware((to) => {
  const { $token, $isExpired } = use$auth();
  const path = to.path;
  if (path !== "/login") {
    if (!$token.value) {
      return navigateTo({ path: "/login", query: { _to: to.fullPath } });
    } else if ($isExpired.value) {
      return navigateTo({
        path: "/login",
        query: { _to: to.fullPath, _expired: "1" },
      });
    }
  }
});
