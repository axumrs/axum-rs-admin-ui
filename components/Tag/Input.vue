<script setup lang="ts">
import { z } from "zod";

const schame = z.object({
  name: z.string().min(1, "请输入名称").max(100, "名称最多 100 个字符"),
});

// type Schame = z.infer<typeof schame>;

const modelValue = defineModel<Tag>({ required: true });

const emits = defineEmits(["submit"]);

const onSubmit = async () => {
  emits("submit");
};
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span v-if="!modelValue.id">添加标签</span>
      <span v-else>修改标签</span>
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

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
