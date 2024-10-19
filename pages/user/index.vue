<script setup lang="ts">
import dayjs from "dayjs";

const { $get, $post, $put, $del } = use$fetch();
const { $msg } = use$status();

const pm = ref<PaginationMeta>();
const rows = ref<User[]>([]);
const columns = [
  { key: "email", label: "邮箱" },
  { key: "nickname", label: "昵称" },
  { key: "status", label: "状态" },
  { key: "kind", label: "类型" },
  { key: "points", label: "积分" },
  { key: "dateline", label: "注册时间" },
  { key: "actions", label: "操作" },
];

const statusList = [
  { label: "待激活", value: "Pending" },
  { label: "正常", value: "Actived" },
  { label: "已冻结", value: "Freezed" },
];

const kindList = [
  { label: "普通用户", value: "Normal" },
  { label: "订阅用户", value: "Subscriber" },
];

const emptyFrm = {
  email: undefined,
  nickname: undefined,
  kind: undefined,
  status: undefined,
  page: 0,
  page_size: 30,
};
const frm = ref<{
  email?: string;
  nickname?: string;
  kind?: string;
  status?: string;
  page: number;
  page_size?: number;
}>({
  ...emptyFrm,
});

const emptyItem = {
  id: "",
  email: "",
  nickname: "",
  status: "Actived",
  dateline: "",
  kind: "Normal",
  sub_exp: "",
  points: "0",
  allow_device_num: 1,
  session_exp: 20,
  need_reverify_email: false,
  password: "",
  re_password: "",
};
const showInput = ref(false);
const inputItem = ref<UserForm>({ ...emptyItem });
const showDel = ref(false);
const delItem = ref<User | null>(null);

const loadData = async () => {
  await $get<Pagination<User>>(
    "/admin/user",
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
  if (!inputItem.value.id.trim().length) {
    await $post("/admin/user", { ...inputItem.value }, () => {
      showInput.value = false;
      inputItem.value = { ...emptyItem };
      $msg("添加成功");
      loadData().then();
    });
    return;
  }

  await $put(
    "/admin/user",
    {
      ...inputItem.value,
      sub_exp: dayjs(inputItem.value.sub_exp)
        .format("YYYY-MM-DD HH:mm:ss")
        .toString(),
    },
    () => {
      showInput.value = false;
      inputItem.value = { ...emptyItem };
      $msg("修改成功");
      loadData().then();
    }
  );
};

const handleDel = async () => {
  if (delItem.value) {
    await $del(`/admin/user/${delItem.value.id}`, () => {
      showDel.value = false;
      delItem.value = null;
      $msg("删除成功");
      loadData().then();
    });
  }
};

const { $neq } = use$obj();
await loadData();
</script>

<template>
  <PageTitle icon="ri:user-line">用户</PageTitle>
  <Toolbar
    class="my-6"
    :show-clear="$neq(frm, emptyFrm, ['page'])"
    @add="
      () => {
        showInput = true;
        inputItem = { ...emptyItem };
      }
    "
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
      <template #label>邮箱</template>
      <UInput size="xs" v-model="frm.email" />
    </ToolbarItem>
    <ToolbarItem>
      <template #label>昵称</template>
      <UInput size="xs" v-model="frm.nickname" />
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
      <template #label>类型</template>
      <USelect
        v-model="frm.kind"
        :options="kindList"
        option-attribute="label"
        value-attribute="value"
        size="xs"
      />
    </ToolbarItem>
  </Toolbar>

  <UTable :rows="rows" :columns="columns">
    <template #status-data="{ row }">
      <UBadge v-if="row.status === 'Actived'" size="xs" variant="subtle"
        >正常</UBadge
      >
      <UBadge
        v-else-if="row.status === 'Pending'"
        size="xs"
        variant="subtle"
        color="orange"
        >待验证</UBadge
      >
      <UBadge v-else size="xs" variant="subtle" color="red">已冻结</UBadge>
    </template>

    <template #kind-data="{ row }">
      <div v-if="row.kind === 'Subscriber'" class="space-y-1">
        <div>
          <UBadge size="xs" variant="subtle" color="orange">订阅用户</UBadge>
        </div>
        <div class="text-xs">
          {{ dayjs(row.sub_exp).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </div>
      <UBadge v-else size="xs" variant="subtle" color="white">普通用户</UBadge>
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
        <UButton
          color="red"
          size="xs"
          icon="ri:delete-bin-5-line"
          variant="outline"
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
    <UserInput v-model="inputItem" @submit="handleSubmit" />
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
      >{{ delItem.email }}</span
    >吗?
  </Confirm>
</template>
