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
const showClose = ref(false);
const closeItem = ref<OrderWithUser | null>(null);

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

const { $get, $put } = use$fetch();
const { $status, $purchasedServices } = use$order();
const { $msg } = use$status();
const loadData = async () => {
  await $get<Pagination<OrderWithUser>>("/admin/order", (v) => {
    if (v) {
      pm.value = v;
      rows.value = v.data || [];
    }
  });
};

const handleSubmit = async () => {
  $msg("操作成功");
  showInput.value = false;
  inputItem.value = { ...emptyItem };
  await loadData();
};
const handleClose = async () => {
  if (closeItem.value) {
    await $put(`/admin/order/${closeItem.value.id}`, {}, () => {
      $msg("关闭成功");
      showClose.value = false;
      closeItem.value = null;
      loadData().then();
    });
  }
};
await loadData();
</script>

<template>
  <PageTitle icon="lsicon:order-integral-outline">订单</PageTitle>

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
      <div class="flex justify-start items-center gap-x-2">
        <div class="flex justify-start items-center gap-x-1">
          <Icon name="solar:user-linear" />
          <div>{{ row.nickname }}</div>
        </div>
        <div class="flex justify-start items-center gap-x-1">
          <Icon name="ic:outline-email" />
          <div>{{ row.email }}</div>
        </div>
      </div>
    </template>
    <template #amount-data="{ row }">
      <div class="flex justify-start items-center gap-x-1">
        <div class="line-through text-xs text-gray-500">
          {{ new Decimal(row.amount) }}
        </div>
        <div>{{ new Decimal(row.actual_amount) }}</div>
      </div>
    </template>
    <template #services-data="{ row }">
      <ul>
        <li v-for="s in $purchasedServices(row)">
          <div class="flex justify-start items-center gap-x-1">
            <div>{{ s.service.name }}</div>
            <div class="text-xs before:content-['x'] text-gray-500">
              {{ s.service.num }}
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template #status-data="{ row }">
      <UBadge color="blue" v-if="row.status === 'Pending'">待支付</UBadge>
      <UBadge color="green" v-else-if="row.status === 'Finished'"
        >已完成</UBadge
      >
      <UBadge color="orange" v-else-if="row.status === 'Cancelled'"
        >已取消</UBadge
      >
      <UBadge color="red" v-else-if="row.status === 'Closed'">已关闭</UBadge>
    </template>
    <template #dateline-data="{ row }">
      <span class="text-xs">{{
        dayjs(row.dateline).format("YYYY-MM-DD HH:mm:ss")
      }}</span>
    </template>
    <template #actions-data="{ row }">
      <div class="flex justify-start items-center gap-x-1">
        <UButton
          v-if="row.status === 'Pending'"
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
        >
          编辑
        </UButton>
        <UButton
          v-else
          color="blue"
          size="xs"
          icon="uil:list-ul"
          variant="outline"
          @click="
            () => {
              showInput = true;
              inputItem = { ...row };
            }
          "
        >
          详情
        </UButton>

        <UButton
          v-if="row.status === 'Pending'"
          color="orange"
          size="xs"
          icon="uil:ban"
          variant="outline"
          @click="
            () => {
              showClose = true;
              closeItem = { ...row };
            }
          "
        >
          关闭
        </UButton>
      </div>
    </template>
  </UTable>

  <UModal v-model="showInput">
    <OrderInput v-model="inputItem" @submit="handleSubmit" />
  </UModal>

  <Confirm
    title="确认关闭"
    v-model="showClose"
    v-if="closeItem"
    @ok="handleClose"
  >
    <div>
      确定要关闭<span class="mx-1">{{ closeItem.nickname }}</span
      >创建的订单<span
        class="underline underline-offset-8 text-orange-600 decoration-wavy mx-1"
        >{{ closeItem.id.toUpperCase() }}</span
      >吗？
    </div>
  </Confirm>
</template>
