<script setup lang="ts">
const pm = ref<PaginationMeta>();
const rows = ref<Tag[]>([]);
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "名称",
  },

  {
    key: "is_del",
    label: "是否删除",
  },
  {
    key: "actions",
    label: "操作",
  },
];

const isDelList = [
  { label: "已删除", value: 1 },
  { label: "未删除", value: 0 },
];

const emptyTag = {
  id: "",
  name: "",
  is_del: false,
};
const showInput = ref(false);
const inputTag = ref<Tag>({ ...emptyTag });
const showDel = ref(false);
const delItem = ref<Tag | null>(null);

const emptyFrm = {
  name: undefined,
  is_del: undefined,
  page: 0,
  page_size: 30,
};
const frm = ref<{
  name?: string;
  is_del?: "1" | "0";
  page: number;
  page_size?: number;
}>({ ...emptyFrm });

const { $get, $del, $post, $put } = use$fetch();
const { $msg } = use$status();

const loadData = async () => {
  await $get<Pagination<Tag>>(
    "/admin/tag",
    (v) => {
      if (v) {
        rows.value = v.data || [];
        pm.value = { ...v };
      }
    },
    { query: { ...frm.value } }
  );
};

const handleSubmit = async () => {
  if (!inputTag.value.id.trim().length) {
    await $post("/admin/tag", { ...inputTag.value }, () => {
      showInput.value = false;
      inputTag.value = { ...emptyTag };
      $msg("添加成功");
      loadData().then();
    });
    return;
  }

  await $put("/admin/tag", { ...inputTag.value }, () => {
    showInput.value = false;
    inputTag.value = { ...emptyTag };
    $msg("修改成功");
    loadData().then();
  });
};

const handleDel = async () => {
  if (delItem.value) {
    await $del(`/admin/tag/${delItem.value.id}`, () => {
      showDel.value = false;
      delItem.value = null;
      $msg("删除成功");
      loadData().then();
    });
  }
};

await loadData();

const { $neq } = use$obj();
</script>

<template>
  <PageTitle icon="ri:hashtag">标签</PageTitle>

  <Toolbar
    class="my-6"
    @add="
      () => {
        showInput = true;
        inputTag = { ...emptyTag };
      }
    "
    :show-clear="$neq(frm, emptyFrm, ['page'])"
    @clear="
      () => {
        frm = { ...emptyFrm };
      }
    "
    @search="
      () => {
        frm = { ...frm, page: 0 };
        loadData().then();
      }
    "
  >
    <ToolbarItem>
      <template #label>名称</template>
      <UInput size="xs" v-model="frm.name" />
    </ToolbarItem>

    <ToolbarItem>
      <template #label>是否删除</template>
      <USelect
        v-model="frm.is_del"
        :options="isDelList"
        option-attribute="label"
        value-attribute="value"
        size="xs"
      />
    </ToolbarItem>
  </Toolbar>

  <UTable :rows="rows" :columns="columns" class="axum-table bg-white my-6">
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
              inputTag = { ...row };
            }
          "
          >编辑</UButton
        >
        <UButton
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
        >
      </div>
    </template>
  </UTable>

  <div class="flex justify-end">
    <Pagination
      v-model="pm"
      v-if="pm"
      @change="
        (p) => {
          frm.page = p;
          loadData().then();
        }
      "
    />
  </div>

  <UModal v-model="showInput">
    <TagInput v-model="inputTag" @submit="handleSubmit" />
  </UModal>

  <Confirm
    title="确认删除"
    v-model="showDel"
    v-if="delItem"
    @cancel="
      () => {
        showDel = false;
        delItem = null;
      }
    "
    @ok="handleDel"
  >
    确定彻底删除<span
      class="underline underline-offset-8 text-orange-600 decoration-wavy"
      >{{ delItem.name }}</span
    >吗?
  </Confirm>
</template>
