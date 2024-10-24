<script setup lang="ts">
const emptyItem = {
  allow_pointer: false,
  cover: "",
  duration: 0,
  id: "",
  is_off: false,
  is_subject: false,
  name: "",
  normal_discount: 0,
  price: "",
  sub_discount: 0,
  target_id: "",
  yearly_sub_discount: 0,
};
const showInput = ref(true);
const inputItem = ref<Service>({ ...emptyItem });

const handleSubmit = async () => {
  window.alert("submit");
};
</script>

<template>
  <PageTitle icon="ri:server-line">服务</PageTitle>

  <UModal v-model="showInput">
    <ServiceInput v-model="inputItem" @submit="handleSubmit" />
  </UModal>
</template>
