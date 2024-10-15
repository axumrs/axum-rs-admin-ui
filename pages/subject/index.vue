<script setup lang="ts">
import Decimal from "decimal.js";

const { $get, $del, $patch, $post, $put } = use$fetch();
const { $msg } = use$status();

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

const showInput = ref(false);
const emptySubject: Subject = {
  id: "",
  name: "",
  slug: "",
  summary: "",
  is_del: false,
  cover: "",
  status: "Writing",
  price: "0",
  pin: 0,
};
const inputSubject = ref<Subject>({ ...emptySubject });
const showDel = ref(false);
const showRes = ref(false);
const delItem = ref<(Subject & { real?: boolean }) | null>(null);
const resItem = ref<Subject | null>(null);

const handleDelOrRestory = async (action: "del" | "res") => {
  if (action === "del" && delItem.value) {
    await $del(
      `/admin/subject/${delItem.value.id}`,
      () => {
        showDel.value = false;
        delItem.value = null;
        $msg("删除成功");
        loadData().then();
      },
      { query: { real: delItem.value.real } }
    );
    return;
  }

  if (action === "res" && resItem.value) {
    await $patch(`/admin/subject/${resItem.value.id}`, {}, () => {
      showDel.value = false;
      resItem.value = null;
      $msg("还原成功");
      loadData().then();
    });
    return;
  }
};

const handleSubmit = async () => {
  if (!inputSubject.value.id.trim().length) {
    await $post("/admin/subject", { ...inputSubject.value }, (v) => {
      showInput.value = false;
      inputSubject.value = { ...emptySubject };
      $msg("添加成功");
      loadData().then();
    });
    return;
  }

  await $put("/admin/subject", { ...inputSubject.value }, (v) => {
    showInput.value = false;
    inputSubject.value = { ...emptySubject };
    $msg("修改成功");
    loadData().then();
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
    @add="
      () => {
        showInput = true;
        inputSubject = { ...emptySubject };
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
        class="underline decoration-dotted hover:text-red-600"
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
        <UButton
          color="cyan"
          size="xs"
          icon="ri:edit-line"
          variant="outline"
          @click="
            () => {
              showInput = true;
              inputSubject = { ...row };
            }
          "
          >编辑</UButton
        >
        <UButton
          color="orange"
          size="xs"
          icon="ri:delete-bin-5-line"
          variant="outline"
          v-if="!row.is_del"
          @click="
            () => {
              showDel = true;
              delItem = { ...row, real: false };
            }
          "
          >删除</UButton
        >
        <UButton
          v-else
          color="primary"
          size="xs"
          icon="ri:reset-right-line"
          variant="outline"
          @click="
            () => {
              showRes = true;
              resItem = { ...row };
            }
          "
          >还原</UButton
        >

        <UButton
          v-if="false"
          color="red"
          size="xs"
          icon="ri:delete-bin-5-line"
          variant="outline"
          @click="
            () => {
              showDel = true;
              delItem = { ...row, real: true };
            }
          "
          >物删</UButton
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
    <SubjectInput v-model="inputSubject" @submit="handleSubmit" />
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
    @ok="handleDelOrRestory('del')"
  >
    <span v-if="delItem.real" class="text-red-600">物理删除后不可恢复，</span
    >确定删除<span
      class="underline underline-offset-8 text-orange-600 decoration-wavy"
      >{{ delItem.name }}</span
    >吗?
  </Confirm>

  <Confirm
    title="确认还原"
    v-model="showRes"
    v-if="resItem"
    @cancel="
      () => {
        showRes = false;
        resItem = null;
      }
    "
    @ok="handleDelOrRestory('res')"
  >
    确定还原<span
      class="underline underline-offset-8 text-orange-600 decoration-wavy"
      >{{ resItem.name }}</span
    >吗?
  </Confirm>
</template>
