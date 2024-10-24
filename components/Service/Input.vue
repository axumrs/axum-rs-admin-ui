<script setup lang="ts">
import Decimal from "decimal.js";
import { z } from "zod";

const schame = z.object({
  allow_pointer: z.boolean(),
  cover: z.string().max(100, "封面路径最多 100 个字符"),
  duration: z.number().int("时效必须是正数").min(0, "时效必须是正数"),
  is_off: z.boolean(),
  is_subject: z.boolean(),
  name: z.string().min(1, "请输入名称").max(100, "名称最多 100 个字符"),
  normal_discount: z
    .number()
    .int("普通折扣必须是整数")
    .min(0, "折扣必须是正整数")
    .max(100, "你要赔钱？"),
  price: z.string().min(1, "请输入价格"),
  sub_discount: z
    .number()
    .int("订阅用户折扣必须是整数")
    .min(0, "折扣必须是正整数")
    .max(100, "你要赔钱？"),
  target_id: z.string().max(20, "目标 ID 最多 20 个字符"),
  yearly_sub_discount: z
    .number()
    .int("年付订阅用户折扣必须是整数")
    .min(0, "折扣必须是正整数")
    .max(100, "你要赔钱？"),
});

const modelValue = defineModel<Service>({ required: true });

const emits = defineEmits(["submit"]);

const { $toast } = use$status();
const onSubmit = async () => {
  if (modelValue.value.is_subject && modelValue.value.target_id.length !== 20) {
    $toast("请选择专题");
    return;
  }
  if (!modelValue.value.is_subject && modelValue.value.duration <= 0) {
    $toast("时效必须在1天以上");
    return;
  }
  try {
    const p = new Decimal(modelValue.value.price);
    if (p.lte(new Decimal(0))) {
      $toast("价格应该是正数，你要赔钱？");
      modelValue.value.price = p.abs().toString();
      return;
    }
    emits("submit");
  } catch (_) {
    $toast("请输入正确的价格");
    modelValue.value.price = "";
  }
};

const { $get } = use$fetch();
const subjectList = ref<Subject[]>([]);
const selectSubject = ref<Subject>();
const loadSubject = async () => {
  await $get<Subject[]>(
    "/admin/subject/all",
    (v) => {
      subjectList.value = v || [];
    },
    { query: { has_price: true } }
  );
};

onMounted(() => {
  const t = setTimeout(() => {
    loadSubject().then();
    clearTimeout(t);
  }, 100);
});

watch(
  () => modelValue.value.is_subject,
  (v) => {
    selectSubject.value = undefined;

    modelValue.value.target_id = "";
    modelValue.value.price = "";
    modelValue.value.name = "";
    modelValue.value.cover = "";
    modelValue.value.duration = 0;
  }
);

watch(
  () => selectSubject.value,
  (v) => {
    if (v) {
      modelValue.value.target_id = v.id;
      modelValue.value.price = v.price;
      modelValue.value.name = v.name;
      modelValue.value.cover = v.cover;
      modelValue.value.duration = 0;
    }
  }
);
</script>

<template>
  <div class="p-6">
    <DailogTitle>
      <span>添加服务</span>
    </DailogTitle>
    <UForm
      :schema="schame"
      :state="modelValue"
      @submit="onSubmit"
      autocomplete="off"
      class="my-6 space-y-4"
    >
      <UFormGroup label="是否专题" name="is_subject" required>
        <UToggle
          v-model="modelValue.is_subject"
          on-icon="i-heroicons-check-20-solid"
          off-icon="i-heroicons-x-mark-20-solid"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup
        label="专题"
        name="target_id"
        required
        v-if="modelValue.is_subject"
      >
        <USelectMenu
          v-model="selectSubject"
          :options="subjectList"
          option-attribute="name"
          searchable
          :search-attributes="['name']"
          placeholder="请选择专题"
          searchable-placeholder="输入专题名称进行搜索"
        />
      </UFormGroup>

      <UFormGroup
        label="名称"
        name="name"
        required
        v-if="!modelValue.is_subject"
      >
        <UInput v-model="modelValue.name" />
      </UFormGroup>

      <UFormGroup
        label="价格"
        name="price"
        required
        v-if="!modelValue.is_subject"
      >
        <UInput v-model="modelValue.price" />
      </UFormGroup>

      <UFormGroup label="封面" name="cover" v-if="!modelValue.is_subject">
        <UInput v-model="modelValue.cover" />
      </UFormGroup>

      <UFormGroup
        label="时效（天）"
        name="duration"
        required
        v-if="!modelValue.is_subject"
      >
        <UInput v-model.number="modelValue.duration" />
      </UFormGroup>

      <UFormGroup label="普通用户折扣" name="normal_discount" required>
        <UInput v-model.number="modelValue.normal_discount" />
      </UFormGroup>
      <UFormGroup label="订阅用户折扣" name="sub_discount" required>
        <UInput v-model.number="modelValue.sub_discount" />
      </UFormGroup>
      <UFormGroup label="年度订阅用户折扣" name="yearly_sub_discount" required>
        <UInput v-model.number="modelValue.yearly_sub_discount" />
      </UFormGroup>

      <UFormGroup label="是否下架" name="is_off" required>
        <UToggle
          v-model="modelValue.is_off"
          on-icon="i-heroicons-check-20-solid"
          off-icon="i-heroicons-x-mark-20-solid"
          size="lg"
        />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton type="submit" color="blue" size="md">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
