import dayjs from "dayjs";

export default function use$auth() {
  const auth = useCookie<Auth | null>("axum-rs-admin-auth");
  const $token = computed(() => auth.value?.token || null);
  const $user = computed(() => auth.value?.user || null);
  const $expireTime = computed(() =>
    auth.value ? dayjs(auth.value.expire_time) : null
  );
  const $isExpired = computed(() => {
    if ($expireTime.value) {
      return $expireTime.value.isBefore(dayjs());
    }
    return true;
  });

  const $login = (a: Auth) => {
    auth.value = a;
  };

  const $logout = () => {
    auth.value = null;
  };

  return { $token, $user, $login, $logout, $isExpired, $expireTime };
}
