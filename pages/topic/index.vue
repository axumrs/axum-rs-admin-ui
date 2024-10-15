<script setup lang="ts">
import dayjs from "dayjs";

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

const isDelList = [
  { label: "已删除", value: 1 },
  { label: "未删除", value: 0 },
];

const emptyFrm = {
  title: undefined,
  subject_name: undefined,
  subject_slug: undefined,
  slug: undefined,
  is_del: undefined,
  page: 0,
  page_size: 30,
};
const frm = ref<{
  title: string | undefined;
  subject_name: string | undefined;
  subject_slug: string | undefined;
  slug: string | undefined;
  is_del: string | undefined;
  page: number;
  page_size?: number;
}>({
  ...emptyFrm,
});

const showInput = ref(false);
const inputTopic = ref<TopicWithTagNames>({ ...emptyTopic });

const pm = ref<PaginationMeta>();
const rows = ref<(TopicWithSubjectAndTags & { tag_names: CreatableTag[] })[]>(
  []
);
const columns = [
  {
    key: "title",
    label: "标题",
  },
  {
    key: "slug",
    label: "路径",
  },
  {
    key: "name",
    label: "专题",
  },
  {
    key: "try_readable",
    label: "试读",
  },
  {
    key: "dateline",
    label: "时间",
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

const { $get } = use$fetch();
const loadData = async () => {
  await $get<Pagination<TopicWithSubjectAndTags>>(
    "/admin/topic",
    (v) => {
      if (v) {
        rows.value =
          v.data?.map((t) => ({
            ...t,
            tag_names: t.tags.map((t) => ({ name: t.name })),
          })) || [];
        pm.value = { ...v };
      }
    },
    { query: { ...frm.value } }
  );
};

const handleSubmit = async () => {};

const websiteUrl = useRuntimeConfig().public.websiteUrl;
const { $neq } = use$obj();

await loadData();
</script>

<template>
  <PageTitle icon="ri:article-line">文章</PageTitle>

  <Toolbar
    class="my-6"
    :show-clear="$neq(frm, emptyFrm, ['page'])"
    @clear="
      () => {
        frm = { ...emptyFrm };
      }
    "
    @add="
      () => {
        showInput = true;
        inputTopic = { ...emptyTopic };
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
    <ToolbarItem>
      <template #label>路径</template>
      <UInput size="xs" v-model="frm.slug" />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>专题名称</template>
      <UInput size="xs" v-model="frm.subject_name" />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>专题路径</template>
      <UInput size="xs" v-model="frm.subject_slug" />
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
    <template #title-data="{ row }">
      <a
        target="_blank"
        :href="`${websiteUrl}/topic/${row.subject_slug}/${row.slug}`"
        class="underline decoration-dotted hover:text-red-600"
        >{{ row.title }}</a
      >
    </template>

    <template #slug-data="{ row }">
      <div class="flex justify-start items-center cursor-default relative">
        <div
          class="text-xs text-gray-400 after:content-['/'] after:text-xs absolute z-[1] -top-4"
        >
          {{ row.subject_slug }}
        </div>
        <div>{{ row.slug }}</div>
      </div>
    </template>

    <template #try_readable-data="{ row }">
      <UBadge
        label="支持"
        v-if="row.try_readable"
        color="orange"
        variant="subtle"
        size="xs"
      />
      <UBadge label="不支持" v-else color="white" variant="subtle" size="xs" />
    </template>

    <template #dateline-data="{ row }">{{
      dayjs(row.dateline).format("YYYY-MM-DD HH:mm:ss")
    }}</template>

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
              inputTopic = { ...row };
            }
          "
          >编辑</UButton
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

  <UModal
    v-model="showInput"
    :ui="{
      width: 'sm:max-w-full w-11/12',
    }"
  >
    <TopicInput v-model="inputTopic" @submit="handleSubmit" />
  </UModal>
</template>
