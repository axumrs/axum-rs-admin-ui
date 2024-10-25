<script setup lang="ts">
import Decimal from "decimal.js";

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
const showInput = ref(false);
const inputItem = ref<Service>({ ...emptyItem });
const showDel = ref(false);
const delItem = ref<Service | null>(null);
const showOnOff = ref(false);
const onOffItem = ref<Service | null>();
const showSync = ref(false);
const syncItem = ref<Service | null>(null);
const showImport = ref(false);

const isSubjectList = [
  { label: "是", value: "1" },
  { label: "否", value: "0" },
];
const isOffList = [
  { label: "上架", value: "0" },
  { label: "下架", value: "1" },
];
const emptyFrm = {
  name: undefined,
  is_subject: undefined,
  is_off: undefined,
  page: 0,
  page_size: 30,
};
const frm = ref<{
  name?: string;
  is_subject?: "1" | "0";
  is_off?: "1" | "0";
  page: number;
  page_size?: number;
}>({ ...emptyFrm });

const pm = ref<PaginationMeta>();
const rows = ref<Service[]>([]);

const { $post, $get, $put, $del, $patch } = use$fetch();
const { $msg } = use$status();

const loadData = async () => {
  $get<Pagination<Service>>(
    "/admin/service",
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

const handleDel = async () => {
  if (delItem.value) {
    await $del(`/admin/service/${delItem.value.id}`, () => {
      delItem.value = null;
      showDel.value = false;
      $msg("删除成功");
      loadData().then();
    });
  }
};
const handleOnOff = async () => {
  if (onOffItem.value) {
    await $put(`/admin/service/${onOffItem.value.id}`, {}, () => {
      onOffItem.value = null;
      showOnOff.value = false;
      $msg("操作成功");
      loadData().then();
    });
  }
};
const handleSyn = async () => {
  if (syncItem.value) {
    await $patch(`/admin/service/${syncItem.value.id}`, {}, () => {
      syncItem.value = null;
      showSync.value = false;
      $msg("同步成功");
      loadData().then();
    });
  }
};
const handleImport = async () => {
  if (showImport.value) {
    await $patch(`/admin/service`, {}, () => {
      showImport.value = false;
      $msg("导入成功");
      loadData().then();
    });
  }
};

const { $neq } = use$obj();

await loadData();
</script>

<template>
  <PageTitle icon="ri:server-line">服务</PageTitle>

  <Toolbar
    class="my-6"
    @add="
      () => {
        showInput = true;
        inputItem = { ...emptyItem };
      }
    "
    :show-clear="$neq(frm, emptyFrm, ['page'])"
    @clear="() => (frm = { ...emptyFrm })"
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
      <template #label>是否专题</template>
      <USelect
        v-model="frm.is_subject"
        :options="isSubjectList"
        option-attribute="label"
        value-attribute="value"
        size="xs"
      />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>是否下架</template>
      <USelect
        v-model="frm.is_off"
        :options="isOffList"
        option-attribute="label"
        value-attribute="value"
        size="xs"
      />
    </ToolbarItem>

    <template #extra-actions>
      <UButton icon="uil:file-import" color="purple" @click="showImport = true"
        >导入</UButton
      >
    </template>
  </Toolbar>

  <UTable :rows="rows" class="axum-table bg-white my-6" :columns="columns">
    <template #id-data="{ row }">
      <span class="px-1 py-0.5 text-[.65rem] text-gray-400">{{
        row.id.toUpperCase()
      }}</span>
    </template>
    <template #is_subject-data="{ row }">
      <UBadge
        label="专题"
        v-if="row.is_subject"
        color="teal"
        variant="subtle"
        size="xs"
      />
      <UBadge label="订阅" v-else color="orange" variant="subtle" size="xs" />
    </template>
    <template #is_off-data="{ row }">
      <UBadge
        label="已下架"
        v-if="row.is_off"
        color="gray"
        variant="subtle"
        size="xs"
      />
      <UBadge
        label="正上架"
        v-else
        color="primary"
        variant="subtle"
        size="xs"
      />
    </template>

    <template #price-data="{ row }">
      {{ new Decimal(row.price) }}
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
          :color="row.is_off ? 'purple' : 'gray'"
          size="xs"
          :icon="row.is_off ? 'uil:upload' : 'uil:down-arrow'"
          variant="outline"
          @click="
            () => {
              showOnOff = true;
              onOffItem = { ...row, is_off: !row.is_off };
            }
          "
        >
          <span v-if="row.is_off">上架</span>
          <span v-else>下架</span>
        </UButton>

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

        <UButton
          v-if="row.is_subject"
          color="blue"
          size="xs"
          icon="uil:sync"
          variant="outline"
          @click="
            () => {
              showSync = true;
              syncItem = { ...row };
            }
          "
          >同步</UButton
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
    <ServiceInput v-model="inputItem" @submit="handleSubmit" />
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
  <Confirm
    title="确认操作"
    v-model="showOnOff"
    v-if="onOffItem"
    @cancel="
      () => {
        showOnOff = false;
        onOffItem = null;
      }
    "
    @ok="handleOnOff"
  >
    确定<span v-if="onOffItem.is_off" class="text-blue-600">下架</span
    ><span v-else class="text-primary-600">上架</span>服务<span
      class="underline underline-offset-8 text-orange-600 decoration-wavy"
      >{{ onOffItem.name }}</span
    >吗?
  </Confirm>

  <Confirm
    title="确认同步"
    v-model="showSync"
    v-if="syncItem"
    @cancel="
      () => {
        showSync = false;
        syncItem = null;
      }
    "
    @ok="handleSyn"
  >
    确定同步<span
      class="underline underline-offset-8 text-orange-600 decoration-wavy"
      >{{ syncItem.name }}</span
    >吗?
  </Confirm>
  <Confirm
    title="确认导入"
    v-model="showImport"
    @cancel="
      () => {
        showImport = false;
      }
    "
    @ok="handleImport"
  >
    确定导入付费专题吗?
  </Confirm>
</template>
