<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  password: z.string({ message: "请输入密码" }).min(1, "请输入密码"),
  new_password: z.string({ message: "请输入新密码" }).min(1, "请输入新密码"),
  re_password: z
    .string({ message: "请再次输入新密码" })
    .min(1, "请再次输入新密码"),
});

const state = reactive({
  password: undefined,
  new_password: undefined,
  re_password: undefined,
});

type Schema = z.output<typeof schema>;

const { $put } = use$fetch();
const { $msg } = use$status();

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  await $put("/admin/profile/change-pwd", { ...e.data }, () => {
    $msg("密码修改成功");
    return navigateTo("/logout") as void;
  });
};
</script>

<template>
  <PageTitle icon="ri:lock-line">修改密码</PageTitle>

  <div class="p-6 bg-white my-6">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      autocomplete="off"
      @submit="onSubmit"
    >
      <UFormGroup label="密码" name="password" required size="lg">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup label="新密码" name="new_password" required size="lg">
        <UInput v-model="state.new_password" type="password" />
      </UFormGroup>

      <UFormGroup label="重复密码" name="re_password" required size="lg">
        <UInput v-model="state.re_password" type="password" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" size="lg">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
