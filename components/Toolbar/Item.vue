<script setup lang="ts"></script>

<template>
  <label class="flex justify-start items-center gap-x-1 text-sm text-gray-700">
    <div><slot name="label"></slot></div>
    <slot></slot>
  </label>
</template>
