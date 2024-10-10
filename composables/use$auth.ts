export default function use$auth() {
  const auth = useCookie<Auth | null>("axum-rs-admin-auth");
  const $token = computed(() => auth.value?.token || null);
  const $user = computed(() => auth.value?.user || null);

  const $login = (a: Auth) => {
    auth.value = a;
  };

  const $logout = () => {
    auth.value = null;
  };

  return { $token, $user, $login, $logout };
}
