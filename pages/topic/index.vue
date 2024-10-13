<script setup lang="ts">
const emptyTopic = {
  id: "",
  title: "",
  subject_id: "",
  slug: "",
  summary: "",
  author: "AXUM中文网",
  src: "AXUM中文网",
  hit: 0,
  dateline: "",
  try_readable: false,
  is_del: false,
  cover: "",
  md: "",
  pin: 0,
  tag_names: [],
};
const showInput = ref(false);
const inputTopic = ref<TopicWithTagNames>({ ...emptyTopic });
</script>

<template>
  <PageTitle icon="ri:article-line">文章</PageTitle>

  <UModal
    v-model="showInput"
    :ui="{
      width: 'sm:max-w-full w-11/12',
    }"
  >
    <TopicInput v-model="inputTopic" />
  </UModal>
</template>
