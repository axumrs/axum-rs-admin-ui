<script setup lang="ts">
const modelValue = defineModel<OrderSnapShot[]>({ required: true });
</script>

<template>
  <UTable :rows="modelValue"></UTable>
</template>
