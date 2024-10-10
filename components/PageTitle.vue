<script setup lang="ts">
defineProps<{ icon?: string }>();
</script>

<template>
  <h1 class="text-lg flex justify-start items-center gap-x-1">
    <Icon :name="icon" v-if="icon" />
    <slot></slot>
  </h1>
</template>
