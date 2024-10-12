<script setup lang="ts">
const modelValue = defineModel<PaginationMeta>({ required: true });
const emits = defineEmits(["change"]);

const handleChange = (p: number) => {
  modelValue.value.page = p;
  emits("change", p);
};
</script>

<template>
  <ul class="flex justify-start items-center gap-x-1">
    <li class="border w-6 h-6 text-center">
      <button
        type="button"
        @click="handleChange(modelValue.page - 1)"
        class="disabled:cursor-not-allowed"
        :disabled="modelValue.page < 1"
      >
        <Icon name="ri:arrow-left-s-line" />
      </button>
    </li>
    <li
      v-for="p in modelValue.total_page"
      :key="p"
      class="border w-6 h-6 text-center"
      :class="{ 'bg-gray-100': p - 1 === modelValue.page }"
    >
      <button
        :disabled="p - 1 === modelValue.page"
        class="disabled:cursor-not-allowed"
        type="button"
        @click="handleChange(p - 1)"
      >
        {{ p }}
      </button>
    </li>

    <li class="border w-6 h-6 text-center">
      <button
        @click="handleChange(modelValue.page + 1)"
        class="disabled:cursor-not-allowed"
        :disabled="modelValue.page >= modelValue.total_page - 1"
        type="button"
      >
        <Icon name="ri:arrow-right-s-line" />
      </button>
    </li>
  </ul>
</template>
