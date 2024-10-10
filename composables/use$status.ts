export default function use$status() {
  const _toast = useToast();
  const $loading = useState("loading", () => false);

  const $toast = (message: string) => {
    _toast.add({ title: message, color: "red", icon: "ri:alert-line" });
  };
  const $msg = (message: string) => {
    _toast.add({
      title: message,
      color: "primary",
      icon: "ri:information-2-line",
    });
  };

  return { $loading, $toast, $msg };
}
