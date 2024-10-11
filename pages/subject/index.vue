<script setup lang="ts">
import Decimal from "decimal.js";

const { $get } = use$fetch();

const rows = ref<Subject[]>([]);

const columns = [
  {
    key: "name",
    label: "名称",
  },
  {
    key: "slug",
    label: "路径",
  },
  {
    key: "status",
    label: "状态",
  },
  {
    key: "price",
    label: "价格",
  },
  {
    key: "actions",
    label: "操作",
  },
];
const loadData = async () => {
  await $get<Pagination<Subject>>("/admin/subject", (v) => {
    if (v) {
      rows.value = v.data || [];
    }
  });
};

const websiteUrl = useRuntimeConfig().public.websiteUrl;
const deci = (v: string) => {
  try {
    return new Decimal(v);
  } catch (_) {
    return new Decimal(0);
  }
};
await loadData();
</script>

<template>
  <SubjectLayout> </SubjectLayout>

  <UTable :rows="rows" :columns="columns" class="bg-white my-6">
    <template #slug-data="{ row }">
      <a
        target="_blank"
        :href="`${websiteUrl}/subject/${row.slug}`"
        class="underline decoration-dotted"
        >{{ row.slug }}</a
      >
    </template>
    <template #status-data="{ row }">
      <UBadge
        label="已完结"
        v-if="row.status === 'Finished'"
        color="lime"
        variant="subtle"
        size="xs"
      />
      <UBadge label="连载中" v-else color="amber" variant="subtle" size="xs" />
    </template>
    <template #price-data="{ row }">
      <div
        class="after:content-['USDT'] after:ml-1 after:text-[0.65rem] after:text-gray-400"
      >
        {{ deci(row.price) }}
      </div>
    </template>
    <template #actions-data="{ row }">
      <div class="flex justify-start items-center gap-x-1">
        <UButton color="teal" size="xs" icon="ri:edit-line" variant="outline"
          >编辑</UButton
        >
        <UButton
          color="red"
          size="xs"
          icon="ri:delete-bin-5-line"
          variant="outline"
          >删除</UButton
        >
      </div>
    </template>
  </UTable>
</template>
