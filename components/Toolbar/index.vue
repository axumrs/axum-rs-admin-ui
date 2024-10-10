<script setup lang="ts">
defineProps<{ showClear?: boolean }>();
const emits = defineEmits(["clear", "search", "add"]);
</script>

<template>
  <section class="flex justify-between items-center">
    <form
      autocomplete="off"
      class="grow flex justify-start items-center gap-x-3"
      @submit.prevent="emits('search')"
    >
      <div class="shrink-0 flex justify-start items-center gap-x-2">
        <slot></slot>
      </div>
      <div class="shrink-0 flex justify-start items-center gap-x-2">
        <UButton
          v-if="showClear"
          color="gray"
          size="xs"
          icon="ri:close-circle-line"
          @click="emits('clear')"
          type="button"
          >清空</UButton
        >
        <UButton size="xs" icon="ri:search-line" type="submit">搜索</UButton>
      </div>
    </form>
    <div class="shrink-0">
      <slot name="actions">
        <UButton icon="ri:add-circle-line" color="sky" @click="emits('add')"
          >添加</UButton
        ></slot
      >
    </div>
  </section>
</template>
