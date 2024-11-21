<script setup lang="ts">
import Decimal from "decimal.js";

const modelValue = defineModel<OrderSnapShot[]>({ required: true });

const rows = ref<OrderSnapShotService[]>([]);

const columns = [
  {
    key: "name",
    label: "名称",
  },
  {
    key: "price",
    label: "单价",
  },
  {
    key: "num",
    label: "数量",
  },
  {
    key: "amount",
    label: "金额",
  },
];

const amout = computed(() =>
  rows.value.reduce(
    (a, b) => new Decimal(a).add(new Decimal(b.price).mul(b.num)).toString(),
    "0"
  )
);

const emits = defineEmits(["change"]);

watch(
  () => modelValue.value,
  (v) => {
    rows.value = v.map((s) => s.service);
  },
  { deep: true }
);
watch(
  () => rows.value,
  () => {
    emits("change", amout.value, rows.value);
  },
  { deep: true }
);
</script>

<template>
  <!-- <div>{{ rows }}</div> -->
  <UTable :rows="rows" :columns="columns" v-if="rows && rows.length > 0">
    <template #num-data="{ row }">
      <div class="flex justify-start items-center gap-x-1">
        <UButton
          color="gray"
          size="xs"
          @click="
            () => {
              if (row.num <= 1) {
                return;
              }
              row.num--;
            }
          "
        >
          -
        </UButton>
        <UInput v-model.number="row.num" size="xs" class="w-16" />
        <UButton
          color="gray"
          size="xs"
          @click="
            () => {
              if (row.num >= 999) {
                return;
              }
              row.num++;
            }
          "
        >
          +
        </UButton>
      </div>
    </template>
    <template #amount-data="{ row }">
      {{ new Decimal(row.price).mul(row.num) }}
    </template>
    <template #price-data="{ row }">
      {{ new Decimal(row.price) }}
    </template>
  </UTable>
  <!-- <div>总金额: {{ amout }}</div> -->
</template>
