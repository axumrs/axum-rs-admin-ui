<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  name: z.string().min(1, "请输入名称").max(100, "名称最多 100 个字符"),
  slug: z.string().min(1, "请输入路径").max(100, "路径最多 100 个字符"),
  summary: z.string().min(1, "请输入摘要").max(255, "摘要最多 255 个字符"),
  cover: z.string().min(0).max(100, "封面路径最多 100 个字符"),
  status: z.enum(["Finished", "Writing"], { message: "请选择状态" }),
  price: z
    .string()
    .min(1, "请输入价格")
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "请输入正确的价格"),
  pin: z.number().int(),
});

type Schema = z.output<typeof schema>;

const modelValue = defineModel<Subject>({ required: true });

const isEdit = computed(() => modelValue.value.id.trim().length === 20);

const statusList = [
  { label: "已完结", value: "Finished" },
  { label: "连载中", value: "Writing" },
];

const emits = defineEmits(["submit"]);
const onSubmit = async (_: FormSubmitEvent<Schema>) => {
  emits("submit");
};
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span v-if="!isEdit">添加专题</span>
      <span v-else>修改专题</span>
    </DailogTitle>
    <UForm
      :schema="schema"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4"
    >
      <UFormGroup label="名称" name="name" required>
        <UInput v-model="modelValue.name" />
      </UFormGroup>

      <UFormGroup label="路径" name="slug" required>
        <UInput v-model="modelValue.slug" />
      </UFormGroup>

      <UFormGroup label="封面" name="cover">
        <UInput v-model="modelValue.cover" />
      </UFormGroup>

      <UFormGroup label="摘要" name="summary" required>
        <UTextarea v-model="modelValue.summary" />
      </UFormGroup>

      <UFormGroup label="状态" name="status" required>
        <USelect
          :options="statusList"
          option-attribute="label"
          value-attribute="value"
          v-model="modelValue.status"
        />
      </UFormGroup>

      <UFormGroup label="价格" name="price" required>
        <UInput v-model="modelValue.price" />
      </UFormGroup>
      <UFormGroup label="排序" name="pin">
        <UInput v-model.number="modelValue.pin" type="number" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
