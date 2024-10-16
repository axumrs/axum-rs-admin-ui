<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  title: z.string().min(1, "请输入标题").max(100, "标题最多 100 个字符"),
  subject_id: z.string().length(20, "请选择专题"),
  slug: z.string().min(1, "请输入路径").max(100, "路径最多 100 个字符"),
  summary: z.string().min(1, "请输入摘要").max(255, "摘要最多 255 个字符"),
  author: z.string().min(1, "请输入作者").max(100, "作者最多 100 个字符"),
  src: z.string().min(1, "请输入源").max(100, "源最多 100 个字符"),
  cover: z.string().min(0).max(100, "封面最多 100 个字符"),
  md: z.string().min(1, "请输入内容"),
  try_readable: z.boolean(),
  pin: z.number().int(),
  // tag_names: z.array({}),
});

type Schema = z.infer<typeof schema>;

const modelValue = defineModel<TopicWithTagNames>({ required: true });

const { $get } = use$fetch();
const { $toast } = use$status();
const emits = defineEmits(["submit"]);

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  if (!(modelValue.value.tag_names && modelValue.value.tag_names.length)) {
    $toast("请选择标签");
    return;
  }

  emits("submit");
};

const subjectList = ref<Subject[]>([]);
const tagList = ref<Tag[]>([]);

const loadSubjectList = async () => {
  await $get<Subject[]>("/admin/subject/all", (v) => {
    subjectList.value = v?.reverse() || [];
  });
};

const loadTagList = async () => {
  await $get<Tag[]>("/admin/tag/all", (v) => {
    tagList.value = v?.reverse() || [];
  });
};

onMounted(() => {
  const t = setTimeout(() => {
    Promise.all([loadSubjectList(), loadTagList()]).then();
    clearTimeout(t);
  }, 100);
});
</script>

<template>
  <div class="p-4 space-y-4">
    <DailogTitle>
      <span v-if="modelValue.id">修改文章</span>
      <span v-else>添加文章</span>
    </DailogTitle>

    <UForm
      :schema="schema"
      :state="modelValue"
      @submit="onSubmit"
      class="flex flex-col gap-y-2"
      autocomplete="off"
    >
      <div class="grid grid-cols-2 gap-x-2 bg-gray-50 p-3 grow">
        <section class="space-y-2">
          <UFormGroup label="标题" name="title" required>
            <UInput v-model="modelValue.title" />
          </UFormGroup>

          <UFormGroup label="专题" name="subject_id" required>
            <!-- <USelect
                v-model="modelValue.subject_id"
                :options="subjectList"
                option-attribute="name"
                value-attribute="id"
              /> -->
            <USelectMenu
              v-model="modelValue.subject_id"
              :options="subjectList"
              option-attribute="name"
              value-attribute="id"
              searchable
              :search-attributes="['name']"
              placeholder="请选择专题"
              searchable-placeholder="输入专题名称进行搜索"
            />
          </UFormGroup>

          <UFormGroup label="路径" name="slug" required>
            <UInput v-model="modelValue.slug" />
          </UFormGroup>

          <UFormGroup label="作者" name="author" required>
            <UInput v-model="modelValue.author" />
          </UFormGroup>

          <UFormGroup label="来源" name="src" required>
            <UInput v-model="modelValue.src" />
          </UFormGroup>

          <UFormGroup label="封面" name="cover">
            <UInput v-model="modelValue.cover" />
          </UFormGroup>

          <UFormGroup label="试读" name="try_readable" required>
            <UToggle
              v-model="modelValue.try_readable"
              on-icon="i-heroicons-check-20-solid"
              off-icon="i-heroicons-x-mark-20-solid"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="排序" name="pin" required>
            <UInput required v-model.number="modelValue.pin" />
          </UFormGroup>

          <UFormGroup label="摘要" name="summary" required>
            <UTextarea :rows="4" v-model="modelValue.summary" />
          </UFormGroup>

          <UFormGroup label="标签" required name="tag_names">
            <USelectMenu
              clear-search-on-close
              v-model="modelValue.tag_names"
              :options="tagList"
              option-attribute="name"
              searchable
              :search-attributes="['name']"
              placeholder="请选择标签"
              searchable-placeholder="输入标签名称进行搜索"
              multiple
              :creatable="true"
            >
              <template #label>
                <ul
                  v-if="modelValue.tag_names.length"
                  class="flex justify-start items-center w-full text-ellipsis overflow-hidden gap-x-1"
                >
                  <li
                    v-for="n in modelValue.tag_names"
                    :key="n.name"
                    class="border rounded-md px-1 py-0.5 text-nowrap"
                  >
                    {{ n.name }}
                  </li>
                </ul>
                <span v-else>请选择标签</span>
              </template>

              <template #option-create="{ option }">
                <span>创建 {{ option.name }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
        </section>
        <section class="">
          <UFormGroup label="内容" name="md" required>
            <UTextarea :rows="34" v-model="modelValue.md" />
          </UFormGroup>
        </section>
      </div>

      <div class="shrink-0 flex justify-end">
        <UButton type="submit">提交</UButton>
      </div>
    </UForm>
  </div>
</template>
