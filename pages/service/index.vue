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
  desc: "",
  pin: 0,
};

const columns = [
  {
    key: "id",
    label: "#",
  },
  {
    key: "name",
    label: "名称",
  },
  {
    key: "is_subject",
    label: "是否专题",
  },
  {
    key: "price",
    label: "价格",
  },
  {
    key: "is_off",
    label: "是否下架",
  },
  {
    key: "actions",
    label: "操作",
  },
];
const showInput = ref(true);
const inputItem = ref<Service>({ ...emptyItem });

const pm = ref<PaginationMeta>();
const rows = ref<Service[]>([]);

const { $post, $get, $put } = use$fetch();
const { $msg } = use$status();

const loadData = async () => {
  $get<Pagination<Service>>("/admin/service", (v) => {
    if (v) {
      rows.value = v.data || [];
      pm.value = { ...v };
    }
  });
};
const handleSubmit = async () => {
  if (inputItem.value.id.length === 20) {
    await $put("/admin/service", { ...inputItem.value }, () => {
      showInput.value = false;
      inputItem.value = { ...emptyItem };
      $msg("修改成功");
      loadData().then();
    });
    return;
  }
  await $post("/admin/service", { ...inputItem.value }, () => {
    showInput.value = false;
    inputItem.value = { ...emptyItem };
    $msg("添加成功");
    loadData().then();
  });
};

await loadData();
</script>

<template>
  <PageTitle icon="ri:server-line">服务</PageTitle>

  <Toolbar class="my-6"></Toolbar>

  <UTable :rows="rows" class="axum-table bg-white my-6" :columns="columns">
    <template #id-data="{ row }">
      <span class="px-1 py-0.5 text-[.65rem] text-gray-400">{{
        row.id.toUpperCase()
      }}</span>
    </template>
    <template #is_del-data="{ row }">
      <UBadge
        label="已删除"
        v-if="row.is_del"
        color="rose"
        variant="subtle"
        size="xs"
      />
      <UBadge label="正常" v-else color="white" variant="subtle" size="xs" />
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
        <!-- <UButton
          color="red"
          size="xs"
          icon="ri:delete-bin-5-line"
          variant="outline"
          v-if="!row.is_del"
          @click="
            () => {
              showDel = true;
              delItem = { ...row };
            }
          "
          >删除</UButton
        > -->
      </div>
    </template>
  </UTable>

  <UModal v-model="showInput">
    <ServiceInput v-model="inputItem" @submit="handleSubmit" />
  </UModal>
</template>
