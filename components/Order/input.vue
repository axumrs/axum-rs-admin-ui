<script setup lang="ts">
import Decimal from "decimal.js";
import { z } from "zod";
const modelValue = defineModel<OrderWithUser>({ required: true });

const isEdit = computed(() => modelValue.value.id.length === 20);
const isReadOnly = computed(
  () => isEdit.value && "Pending" !== modelValue.value.status
);

const schame = z.object({
  id: z.string().max(20, "ID 最多 20 个字符"),
  user_id: z
    .string()
    .min(20, "请输入用户 ID")
    .max(20, "用户 ID 最多 20 个字符"),
  amount: z.string(),
  actual_amount: z.string(),
  status: z.string(),
  snapshot: z.string(),
  allow_pointer: z.boolean(),
  email: z.string(),
  nickname: z.string(),
});

const { $get, $post, $put } = use$fetch();
const { $purchasedServices } = use$order();

const selectedUser = ref<User>();
const serviceList = ref<Service[]>([]);
const selectedServices = ref<Service[]>([]);
const selectedServicesSnap = ref<OrderSnapShot[]>([]);

const emptyPay = {
  id: "",
  order_id: modelValue.value.id,
  user_id: modelValue.value.user_id,
  amount: "",
  currency: "USDT" as Currency,
  tx_id: "",
  method: "Online" as PaymentKind,
  status: "Pending" as PayStatus,
  is_via_admin: !false,
  approved_time: "",
  approved_opinion: "",
  proof: "",
  dateline: "",
};

const pay = ref<OrderHasPay>({
  has_pay: false,
  pay: {
    ...emptyPay,
  },
});

const searchUser = async (q: string) => {
  const v = await $get<User[]>("/admin/user/search", (v) => v, {
    query: {
      q,
      user_id: isEdit.value ? modelValue.value.user_id || undefined : undefined,
    },
  });
  return v || [];
};

const loadService = async () => {
  await $get<Service[]>("/admin/service/all", (v) => {
    serviceList.value = v || [];
  });
};

const loadUser = async () => {
  if (isEdit.value && modelValue.value.user_id) {
    await $get<User>(`/admin/user/${modelValue.value.user_id}`, (v) => {
      if (v) {
        selectedUser.value = v;
      }
    });
  }
};

const loadPay = async () => {
  if (isEdit.value && modelValue.value.id) {
    await $get<OrderHasPay>(`/admin/order/pay/${modelValue.value.id}`, (v) => {
      if (v) {
        if (v.has_pay) {
          pay.value = v;
        } else {
          pay.value = {
            has_pay: false,
            pay: {
              ...emptyPay,
              is_via_admin: true,
              order_id: modelValue.value.id,
              user_id: modelValue.value.user_id,
            },
          };
        }
      }
    });
  }
};

const currencyList: Currency[] = ["USDT", "TRX", "CNY", "PNT"];
const payMethodList: PaymentKind[] = [
  "Online",
  "QrCode",
  "WechatAlipay",
  "Pointer",
];
// const payStatusList: PayStatus[] = ["Pending", "Success", "Failed"];
const returnedSelectedServicesSnap = ref<OrderSnapShotService[]>([]);

const emits = defineEmits(["submit"]);
const onSubmit = async () => {
  if (!isEdit.value) {
    await $post(
      "/admin/order",
      {
        user_id: selectedUser.value?.id,
        snap: returnedSelectedServicesSnap.value.map((s) => ({
          service: s,
          user: selectedUser.value,
        })),
        amount: pay.value.pay.amount,
        currency: pay.value.pay.currency,
        method: pay.value.pay.method,
        tx_id: pay.value.pay.tx_id,
        is_via_admin: pay.value.pay.is_via_admin,
        approved_opinion: pay.value.pay.approved_opinion,
        proof: pay.value.pay.proof,
      },
      () => {
        emits("submit");
      }
    );
    return;
  }

  await $put(
    "/admin/order",
    {
      user_id: selectedUser.value?.id,
      id: modelValue.value.id,
      amount: pay.value.pay.amount,
      currency: pay.value.pay.currency,
      method: pay.value.pay.method,
      tx_id: pay.value.pay.tx_id,
      is_via_admin: pay.value.pay.is_via_admin,
      approved_opinion: pay.value.pay.approved_opinion,
      proof: pay.value.pay.proof,
    },
    () => {
      emits("submit");
    }
  );
};

watch(
  () => selectedUser.value,
  (nv) => {
    if (nv) {
      modelValue.value.user_id = nv.id;
    } else {
      modelValue.value.user_id = "";
    }
  },
  { deep: true, immediate: false }
);

watch(
  () => selectedServices.value,
  (v) => {
    selectedServicesSnap.value = v.map((s) => ({
      service: {
        ...s,
        amount: s.price,
        actual_amount: s.price,
        actual_price: s.price,
        discount: 0,
        num: 1,
      },
      user: selectedUser.value || ({} as User),
    }));
  },
  { deep: true }
);

watch(
  () => selectedUser.value,
  (v) => {
    if (v) {
      selectedServicesSnap.value.map((s) => (s.user = v));
    }
  }
);

onMounted(() => {
  const t = setTimeout(() => {
    Promise.all([loadService(), loadUser(), loadPay()]).then();

    clearTimeout(t);
  }, 100);
});

onMounted(() => {
  if (isEdit.value) {
    const t = setTimeout(() => {
      const snap = $purchasedServices(modelValue.value);
      const ids = snap.map((s) => s.service.id);
      selectedServices.value = serviceList.value.filter((s) =>
        ids.includes(s.id)
      );
      clearTimeout(t);
    }, 500);
  }
});
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <div v-if="isEdit">
        <span v-if="isReadOnly">查看订单</span>
        <span v-else>修改订单</span>
      </div>
      <div v-else>添加订单</div>
    </DailogTitle>

    <UForm
      :schema="schame"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4 relative"
    >
      <div class="bg-black/5 absolute inset-0 z-10" v-if="isReadOnly"></div>
      <UFormGroup label="用户" name="user_id" required class="relative">
        <div class="bg-black/5 absolute inset-0 z-10" v-if="isEdit"></div>
        <USelectMenu
          v-model="selectedUser"
          :searchable="searchUser"
          placeholder="请输入昵称/邮箱搜索用户"
        >
          <template #label>
            <div
              class="flex justify-start items-center gap-x-2"
              v-if="selectedUser"
            >
              <div class="flex justify-start items-center gap-x-1">
                <Icon name="uil:user" />
                <div>{{ selectedUser.nickname }}</div>
              </div>
              <div
                class="flex justify-start items-center gap-x-1 text-gray-500"
              >
                <Icon name="uil:envelope" />
                <div>{{ selectedUser.email }}</div>
              </div>
            </div>
            <span v-else>选择用户</span>
          </template>
          <template #option="{ option }">
            <div class="flex justify-start items-center gap-x-2">
              <div class="flex justify-start items-center gap-x-1">
                <Icon name="uil:user" />
                <div>{{ option.nickname }}</div>
              </div>
              <div
                class="flex justify-start items-center gap-x-1 text-gray-500"
              >
                <Icon name="uil:envelope" />
                <div>{{ option.email }}</div>
              </div>
            </div>
          </template></USelectMenu
        >
      </UFormGroup>

      <UFormGroup label="服务" name="" required class="relative">
        <div class="bg-black/5 absolute inset-0 z-10" v-if="isEdit"></div>
        <USelectMenu
          v-model="selectedServices"
          :options="serviceList"
          :search-attributes="['name']"
          searchable
          multiple
          clear-search-on-close
        >
          <template #option="{ option }">
            <div class="flex justify-start items-center gap-x-2">
              <div>
                <span
                  v-if="option.is_subject"
                  class="px-1 py-0.5 text-[0.6rem] bg-orange-500 text-white rounded-md"
                  >专题</span
                >
                <span
                  v-else
                  class="px-1 py-0.5 text-[0.6rem] bg-purple-500 text-white rounded-md"
                  >订阅</span
                >
              </div>
              <div>{{ option.name }}</div>
              <div class="flex justify-start items-center gap-x-1">
                <div>
                  <img src="/usdt.svg" class="w-4 object-cover" alt="USDT" />
                </div>
                <div>{{ new Decimal(option.price) }}</div>
              </div>
            </div>
          </template>
        </USelectMenu>
        <OrderService
          v-model="selectedServicesSnap"
          @change="
            (amount, returnedSnap) => {
              if (pay.pay.is_via_admin) {
                pay.pay.amount = amount;
              }
              returnedSelectedServicesSnap = returnedSnap;
            }
          "
        />
      </UFormGroup>

      <UFormGroup label="支付金额和货币" class="relative">
        <div
          class="bg-black/5 absolute inset-0 z-10"
          v-if="isEdit && !pay.pay.is_via_admin"
        ></div>
        <div class="flex justify-start items-center gap-x-1">
          <UInput v-model="pay.pay.amount" />
          <USelect :options="currencyList" v-model="pay.pay.currency" />
        </div>
      </UFormGroup>
      <UFormGroup label="支付方式">
        <USelect :options="payMethodList" v-model="pay.pay.method" />
      </UFormGroup>
      <UFormGroup label="交易号">
        <UInput v-model="pay.pay.tx_id" />
      </UFormGroup>

      <UFormGroup label="支付证明">
        <UInput v-model="pay.pay.proof" />
      </UFormGroup>
      <UFormGroup label="审核意见">
        <UInput v-model="pay.pay.approved_opinion" />
      </UFormGroup>

      <div v-if="pay.pay.is_via_admin">该支付由后台添加</div>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
