<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import VueTurnstile from "vue-turnstile";
import use$fetch from "~/composables/use$fetch";

definePageMeta({
  layout: false,
});

const schema = z.object({
  username: z
    .string({ message: "请输入用户名" })
    .min(3, "用户名至少 3 个字符")
    .max(50, "用户名最多 50 个字符"),
  password: z.string({ message: "请输入密码" }).min(6, "密码至少 6 个字符"),
  captcha: z.string({ message: "请完成人机验证" }).min(6, "请完成人机验证"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  username: undefined,
  password: undefined,
  captcha: "",
});

const { $post } = use$fetch();
const { $toast, $msg } = use$status();
const { $login } = use$auth();
const { _to, _expired } = useRoute().query;
const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  if (!e.data.captcha) {
    $toast("请完成人机验证");
    return;
  }

  await $post<Auth>("/auth/admin-login", { ...e.data }, (v) => {
    if (v) {
      $login(v);
      $msg("登录成功");
      return navigateTo({ path: _to ? _to.toString() : "/" }) as void;
    }
  });
};

onMounted(() => {
  if (_expired && _expired.toString() === "1") {
    $toast("会话已过期，请重新登录");
  }
});
</script>

<template>
  <div class="bg-gray-100 fixed inset-0">
    <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      autocomplete="off"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 border rounded-md shadow-md min-w-96 space-y-4"
    >
      <UFormGroup label="用户名" name="username" required>
        <UInput
          v-model="state.username"
          placeholder="输入用户名"
          icon="ri:user-3-line"
        />
      </UFormGroup>

      <UFormGroup label="密码" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          icon="ri:key-2-line"
          placeholder="输入密码"
        />
      </UFormGroup>

      <div class="space-y-1">
        <div class="font-medium text-gray-700 text-sm">人机验证</div>
        <vue-turnstile
          v-model="state.captcha"
          :site-key="useRuntimeConfig().public.turnstileSitekey"
        />
      </div>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">登录</UButton>
      </div>
    </UForm>
  </div>
</template>
