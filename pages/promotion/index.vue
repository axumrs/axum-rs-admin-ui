<script setup lang="ts">
import dayjs from "dayjs";

const emptyFrm = {
  title: undefined,
  page: 0,
  page_size: 30,
};
const frm = ref<{
  title?: string;
  page: number;
  page_size?: number;
}>({ ...emptyFrm });

const emptyItem = {
  id: "",
  name: "",
  content: "",
  url: "",
  img: "",
  dateline: "",
};

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
    key: "url",
    label: "URL",
  },
  {
    key: "img",
    label: "图片",
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

const pm = ref<PaginationMeta>();
const rows = ref<Promotion[]>([]);
const showInput = ref(false);
const inputItem = ref<Promotion>({ ...emptyItem });
const showDel = ref(false);
const delItem = ref<Promotion | null>(null);

const { $get, $post, $put, $del } = use$fetch();
const { $msg } = use$status();
const loadData = async () => {
  await $get<Pagination<Promotion>>(
    "/admin/promotion",
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
  if (inputItem.value.id) {
    await $put("/admin/promotion", { ...inputItem.value }, () => {
      showInput.value = false;
      inputItem.value = { ...emptyItem };
      $msg("修改成功");
      loadData().then();
    });
    return;
  }

  $post("/admin/promotion", { ...inputItem.value }, () => {
    showInput.value = false;
    inputItem.value = { ...emptyItem };
    $msg("添加成功");
    loadData().then();
  });
};

const handleDel = async () => {
  await $del(`/admin/promotion/${delItem.value?.id}`, () => {
    showDel.value = false;
    delItem.value = null;
    $msg("删除成功");
    loadData().then();
  });
};

const { $neq } = use$obj();

await loadData();
</script>

<template>
  <PageTitle icon="ic:outline-announcement">公告</PageTitle>

  <Toolbar
    class="my-6"
    @add="
      () => {
        showInput = true;
        inputItem = { ...emptyItem };
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
      <template #label>标题</template>
      <UInput size="xs" v-model="frm.title" />
    </ToolbarItem>
  </Toolbar>

  <UTable :rows="rows" :columns="columns" class="axum-table bg-white my-6">
    <template #id-data="{ row }">
      <span class="px-1 py-0.5 text-[.65rem] text-gray-400">{{
        row.id.toUpperCase()
      }}</span>
    </template>
    <template #img-data="{ row }">
      <span class="" v-if="row.img">{{ row.img }}</span>
      <span class="" v-else>N/A</span>
    </template>
    <template #url-data="{ row }">
      <a :href="row.url" target="_blank" class="underline">{{ row.url }}</a>
    </template>
    <template #dateline-data="{ row }">
      <div>
        {{ dayjs(row.dateline).format("YYYY-MM-DD HH:mm:ss") }}
      </div>
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
    <PromotionInput v-model="inputItem" @submit="handleSubmit" />
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
      class="underline underline-offset-8 text-orange-600 decoration-wavy mx-1"
      >{{ delItem.name }}</span
    >吗?
  </Confirm>
</template>
