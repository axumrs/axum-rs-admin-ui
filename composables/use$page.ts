export default function use$page() {
  const { page: pageRaw } = useRoute().query;

  const $page = computed(() =>
    pageRaw ? parseInt(pageRaw.toString() || "0", 10) : 0
  );

  return { $page };
}
