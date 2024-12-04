<script setup lang="ts">
import { z } from "zod";

const schame = z.object({
  title: z.string().min(1, "请输入标题").max(255, "标题最多 255 个字符"),
  content: z.string().min(1, "请输入内容"),
});

const modelValue = defineModel<Announcement>({ required: true });

const emits = defineEmits(["submit"]);

const onSubmit = async () => {
  emits("submit");
};
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span v-if="!modelValue.id">添加公告</span>
      <span v-else>修改公告</span>
    </DailogTitle>
    <UForm
      :schema="schame"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4"
    >
      <UFormGroup label="标题" name="title" required>
        <UInput v-model="modelValue.title" />
      </UFormGroup>
      <UFormGroup label="内容" name="content" required>
        <UTextarea v-model="modelValue.content" :rows="20" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
