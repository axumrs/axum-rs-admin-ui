<script setup lang="ts">
import Decimal from "decimal.js";

const { $get } = use$fetch();

const rows = ref<Subject[]>([]);
const pm = ref<PaginationMeta>();

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
    key: "is_del",
    label: "是否删除",
  },
  {
    key: "actions",
    label: "操作",
  },
];

const statusList = [
  { label: "已完结", value: "Finished" },
  { label: "连载中", value: "Writing" },
];

const isDelList = [
  { label: "已删除", value: 1 },
  { label: "未删除", value: 0 },
];

const { $neq } = use$obj();
const { name, slug, status, is_del } = useRoute().query;
const emptyFrm = {
  name: name?.toString() || undefined,
  slug: slug?.toString() || undefined,
  status: (status?.toString() as SubjectStatus) || undefined,
  is_del: is_del?.toString() || undefined,
  page: 0,
  page_size: 15,
};
const frm = ref<{
  name?: string;
  slug?: string;
  status?: SubjectStatus;
  is_del?: string;
  page: number;
  page_size?: number;
}>({ ...emptyFrm });
const loadData = async () => {
  await $get<Pagination<Subject>>(
    "/admin/subject",
    (v) => {
      if (v) {
        rows.value = v.data || [];
        pm.value = { ...v };
      }
    },
    {
      query: {
        ...frm.value,
      },
    }
  );
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
  <PageTitle icon="ri:archive-2-line">专题</PageTitle>

  <Toolbar
    class="my-6"
    @search="
      () => {
        frm = { ...frm, page: 0 };
        loadData().then();
      }
    "
    :show-clear="$neq(frm, emptyFrm, ['page'])"
    @clear="
      () => {
        frm = { ...emptyFrm };
      }
    "
  >
    <ToolbarItem>
      <template #label>名称</template>
      <UInput size="xs" v-model="frm.name" />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>路径</template>
      <UInput size="xs" v-model="frm.slug" />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>状态</template>
      <USelect
        v-model="frm.status"
        :options="statusList"
        option-attribute="label"
        value-attribute="value"
        size="xs"
      />
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
</template>
