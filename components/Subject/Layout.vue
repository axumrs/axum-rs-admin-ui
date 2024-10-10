<script setup lang="ts"></script>

<template>
  <PageTitle icon="ri:archive-2-line"><slot name="title">专题</slot></PageTitle>

  <Toolbar>
    <ToolbarItem>
      <template #label>名称</template>
      <UInput size="xs" />
    </ToolbarItem>
  </Toolbar>

  <slot></slot>
</template>
