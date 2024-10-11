<script setup lang="ts">
const { $get } = use$fetch();
const loadData = async () => {
  await $get<Pagination<Subject>>("/admin/subject", (v) => {});
};

await loadData();
</script>

<template>
  <SubjectLayout> </SubjectLayout>
</template>
