<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const schema = z.object({
  email: z
    .string()
    .email("请输入正确的邮箱地址")
    .max(255, "邮箱最多 255 个字符"),
  password: z.string().optional(),
  re_password: z.string().optional(),
  nickname: z
    .string()
    .min(3, "昵称至少 3 个字符")
    .max(30, "昵称最多 30 个字符"),
  status: z.enum(["Pending", "Actived", "Freezed"], { message: "请选择状态" }),
  kind: z.enum(["Normal", "Subscriber"], { message: "请选择用户类型" }),
  sub_exp: z.string(),
  points: z.string(),
  allow_device_num: z
    .number()
    .int("设备数必须是整数")
    .min(1, "设备数至少 1 个")
    .max(5, "设备数最多 5 个"),
  session_exp: z
    .number()
    .int("会话过期时长必须是整数")
    .min(1, "会话过期时长至少 1 分钟")
    .max(1440, "会话过期时长最多 1440 分钟"),
});

const statusList = [
  { label: "待激活", value: "Pending" },
  { label: "正常", value: "Actived" },
  { label: "已冻结", value: "Freezed" },
];

const kindList = [
  { label: "普通用户", value: "Normal" },
  { label: "订阅用户", value: "Subscriber" },
];

type Schema = z.output<typeof schema>;

const modelValue = defineModel<UserForm>({ required: true });

const isEdit = computed(() => modelValue.value.id.length === 20);

const emits = defineEmits(["submit"]);

const { $toast } = use$status();
const onSubmit = async (_: FormSubmitEvent<Schema>) => {
  if (!isEdit.value) {
    if (!(modelValue.value.password && modelValue.value.re_password)) {
      $toast("请输入密码");
      return;
    }
    if (modelValue.value.password !== modelValue.value.re_password) {
      $toast("密码不一致");
      return;
    }

    if (modelValue.value.password.length < 6) {
      $toast("密码至少6位");
      return;
    }
  }
  emits("submit");
};
</script>

<template>
  <div class="p-4 space-y-4">
    <DailogTitle>
      <span v-if="isEdit">修改用户</span>
      <span v-else>添加用户</span>
    </DailogTitle>
    <UForm
      :schema="schema"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="space-y-4"
    >
      <UFormGroup label="邮箱" name="email" required>
        <UInput v-model="modelValue.email" type="email" />
      </UFormGroup>
      <UFormGroup label="昵称" name="nickname" required>
        <UInput v-model="modelValue.nickname" />
      </UFormGroup>
      <UFormGroup label="密码" name="password" :required="!isEdit">
        <UInput v-model="modelValue.password" type="password" />
      </UFormGroup>
      <UFormGroup label="重复密码" name="re_password" :required="!isEdit">
        <UInput v-model="modelValue.re_password" type="password" />
      </UFormGroup>
      <UFormGroup label="状态" name="status" required>
        <USelect
          :options="statusList"
          option-attribute="label"
          value-attribute="value"
          v-model="modelValue.status"
        ></USelect>
      </UFormGroup>
      <UFormGroup label="类型" name="kind" required>
        <USelect
          :options="kindList"
          option-attribute="label"
          value-attribute="value"
          v-model="modelValue.kind"
        ></USelect>
      </UFormGroup>

      <UFormGroup
        label="过期时间"
        name="sub_exp"
        required
        v-if="modelValue.kind === 'Subscriber'"
      >
        <DateTimePick v-model="modelValue.sub_exp" class="" />
      </UFormGroup>
      <UFormGroup label="积分" name="points" required>
        <UInput v-model="modelValue.points" />
      </UFormGroup>
      <UFormGroup label="允许登录的设备数" name="allow_device_num" required>
        <UInput v-model.number="modelValue.allow_device_num" />
      </UFormGroup>
      <UFormGroup label="会话过期时长（分钟）" name="session_exp" required>
        <UInput v-model.number="modelValue.session_exp" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
