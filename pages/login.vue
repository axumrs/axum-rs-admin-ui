<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import VueTurnstile from "vue-turnstile";

definePageMeta({
  layout: false,
});

const schema = z.object({
  username: z.string({ message: "请输入用户名" }).min(3, "用户名至少 3 个字符"),
  password: z.string({ message: "请输入密码" }).min(6, "密码至少 6 个字符"),
  captcha: z.string({ message: "请完成人机验证" }).min(6, "请完成人机验证"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  username: undefined,
  password: undefined,
  captcha: "",
});

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  console.log("submit");
  console.log(e.data);
};
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
      <UFormGroup label="用户名" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="密码" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <div class="space-y-1">
        <div class="font-medium text-gray-700 text-sm">人机验证</div>
        <vue-turnstile
          v-model="state.captcha"
          :site-key="useRuntimeConfig().public.turnstileSitekey"
        />
      </div>

      <div>
        <UButton type="submit">登录</UButton>
      </div>
    </UForm>
  </div>
</template>
