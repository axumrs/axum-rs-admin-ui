<script setup lang="ts">
import { z } from "zod";

const schame = z.object({
  name: z.string().min(1, "请输入名称").max(255, "标题最多 255 个字符"),
  url: z.string().min(1, "请输入URL").max(255, "标题最多 255 个字符"),
  img: z.string().max(255, "标题最多 255 个字符"),
  content: z.string().min(1, "请输入内容"),
});

const modelValue = defineModel<Promotion>({ required: true });

const emits = defineEmits(["submit"]);

const onSubmit = async () => {
  emits("submit");
};
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span v-if="!modelValue.id">添加推广</span>
      <span v-else>修改推广</span>
    </DailogTitle>
    <UForm
      :schema="schame"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4"
    >
      <UFormGroup label="名称" name="name" required>
        <UInput v-model="modelValue.name" />
      </UFormGroup>

      <UFormGroup label="内容" name="content" required>
        <UInput v-model="modelValue.content" />
      </UFormGroup>

      <UFormGroup label="URL" name="url" required>
        <UInput v-model="modelValue.url" />
      </UFormGroup>
      <UFormGroup label="图片" name="img">
        <UInput v-model="modelValue.img" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
