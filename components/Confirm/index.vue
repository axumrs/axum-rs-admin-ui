<script setup lang="ts">
defineProps<{ title?: string }>();
const emits = defineEmits(["cancel", "ok"]);
</script>

<template>
  <UModal>
    <div class="p-6 space-y-4">
      <DailogTitle>{{ title || "确认" }}</DailogTitle>
      <div><slot></slot></div>
      <div class="flex justify-end gap-x-2 items-center">
        <UButton @click="emits('cancel')" color="gray">取消</UButton>
        <UButton @click="emits('ok')" color="blue">确定</UButton>
      </div>
    </div>
  </UModal>
</template>
