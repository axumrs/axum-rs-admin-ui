<script setup lang="ts">
import dayjs from "dayjs";
import Decimal from "decimal.js";

const pm = ref<PaginationMeta>();
const rows = ref<OrderWithUser[]>([]);

const emptyItem = {
  email: "",
  nickname: "",
  id: "",
  user_id: "",
  amount: "",
  actual_amount: "",
  status: "",
  snapshot: "",
  allow_pointer: false,
  dateline: "",
};
const showInput = ref(false);
const inputItem = ref<OrderWithUser>({ ...emptyItem });

const columns = [
  {
    key: "id",
    label: "#",
  },

  {
    key: "user",
    label: "用户",
  },
  {
    key: "amount",
    label: "金额",
  },
  {
    key: "services",
    label: "服务",
  },
  {
    key: "status",
    label: "状态",
  },
  {
    key: "dateline",
    label: "时间",
  },

  {
    key: "actions",
    label: "操作",
  },
];

const { $get } = use$fetch();
const { $status, $purchasedServices } = use$order();
const loadData = async () => {
  await $get<Pagination<OrderWithUser>>("/admin/order", (v) => {
    if (v) {
      pm.value = v;
      rows.value = v.data || [];
    }
  });
};

await loadData();
</script>

<template>
  <PageTitle icon="ri:server-line">订单</PageTitle>

  <Toolbar
    class="my-6"
    @add="
      () => {
        showInput = true;
        inputItem = { ...emptyItem };
      }
    "
  ></Toolbar>

  <UTable :rows="rows" class="axum-table bg-white my-6" :columns="columns">
    <template #id-data="{ row }">
      <span class="px-1 py-0.5 text-[.65rem] text-gray-400">{{
        row.id.toUpperCase()
      }}</span>
    </template>
    <template #user-data="{ row }">
      <div>{{ row.email }}</div>
      <div>{{ row.nickname }}</div>
    </template>
    <template #amount-data="{ row }">
      <div>{{ new Decimal(row.amount) }}</div>
      <div>{{ new Decimal(row.actual_amount) }}</div>
    </template>
    <template #services-data="{ row }">
      <ul>
        <li v-for="s in $purchasedServices(row)">
          {{ s.service.name }} x {{ s.service.num }}
        </li>
      </ul>
    </template>
    <template #status-data="{ row }">
      {{ $status(row.status) }}
    </template>
    <template #dateline-data="{ row }">
      <span class="text-xs">{{
        dayjs(row.dateline).format("YYYY-MM-DD HH:mm:ss")
      }}</span>
    </template>
    <template #actions-data="{ row }">
      <div class="flex justify-start items-center gap-x-1">
        <UButton
          color="cyan"
          size="xs"
          icon="ri:edit-line"
          variant="outline"
          @click="
            () => {
              showInput = true;
              inputItem = { ...row };
            }
          "
          >编辑</UButton
        >
      </div>
    </template>
  </UTable>

  <UModal v-model="showInput">
    <OrderInput v-model="inputItem" />
  </UModal>
</template>
