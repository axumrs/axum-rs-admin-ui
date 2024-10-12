<script setup lang="ts">
useHead({
  title: "AXUM中文网",
  link: [{ rel: "icon", href: "/logo.png" }],
});

const { $loading } = use$status();
</script>
<template>
  <NuxtLayout>
    <NuxtPage :key="useRoute().fullPath" />
  </NuxtLayout>

  <Loading v-if="$loading" />
  <UNotifications />
</template>
