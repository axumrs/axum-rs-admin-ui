<script setup lang="ts">
import { z } from "zod";
const modelValue = defineModel<OrderWithUser>({ required: true });

const isEdit = computed(() => modelValue.value.id.length === 20);

const schame = z.object({
  id: z.string().max(20, "ID 最多 20 个字符"),
  user_id: z
    .string()
    .min(20, "请输入用户 ID")
    .max(20, "用户 ID 最多 20 个字符"),
  amount: z.string(),
  actual_amount: z.string(),
  status: z.string(),
  snapshot: z.string(),
  allow_pointer: z.boolean(),
  email: z.string(),
  nickname: z.string(),
});

const { $get } = use$fetch();

const selectedUser = ref<User>();
const selectedServices = ref<Service[]>([]);
const searchUser = async (q: string) => {
  const v = await $get<User[]>("/admin/user/search", (v) => v, {
    query: { q, user_id: undefined },
  });
  return v || [];
};

const searchService = async (q: string) => {
  const v = await $get("/admin/service/search", (v) => v, {
    query: { q, ids: undefined },
  });
  return v || [];
};

const onSubmit = async () => {};

watch(
  () => selectedUser.value,
  (nv) => {
    if (nv) {
      modelValue.value.user_id = nv.id;
    } else {
      modelValue.value.user_id = "";
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span v-if="isEdit">修改订单</span>
      <span v-else>添加订单</span>
    </DailogTitle>

    <div>Selected User: {{ selectedUser }}</div>
    <div>Selected User id: {{ modelValue.user_id }}</div>
    <UForm
      :schema="schame"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4"
    >
      <UFormGroup label="用户" name="user_id" required>
        <USelectMenu
          v-model="selectedUser"
          :searchable="searchUser"
          placeholder="请输入昵称/邮箱搜索用户"
        >
          <template #label>
            <span v-if="selectedUser"
              >{{ selectedUser.nickname }}({{ selectedUser.email }})</span
            >
            <span v-else>选择用户</span>
          </template>
          <template #option="{ option }">
            <span>{{ option.nickname }}({{ option.email }})</span>
          </template></USelectMenu
        >
      </UFormGroup>
    </UForm>
  </div>
</template>
