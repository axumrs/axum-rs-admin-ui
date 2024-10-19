<script setup lang="ts">
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";

const props = withDefaults(
  defineProps<{
    mode?: "date" | "time" | "datetime";
  }>(),
  { mode: "datetime" }
);

const baseConfig = {
  locale: Mandarin,
  time_24hr: true,
  disableMobile: false,
  allowInput: false,
};
const dateConfig = { dateFormat: "Y-m-d", ...baseConfig };
const timeConfig = {
  dateFormat: "H:i:S",
  enableTime: true,
  noCalendar: true,
  enableSeconds: true,
  ...baseConfig,
};
const datetimeConfig = {
  dateFormat: "Y-m-d H:i:S",
  enableTime: true,
  enableSeconds: true,
  ...baseConfig,
};

const flatConfig = computed(() => {
  switch (props.mode) {
    case "date":
      return dateConfig;
    case "time":
      return timeConfig;
    case "datetime":
      return datetimeConfig;
  }
});

const modelValue = defineModel<string | Date>({ required: true });
</script>

<template>
  <flat-pickr
    v-model="modelValue"
    :config="flatConfig"
    class="block w-full border-0 outline-none rounded-md text-sm px-2.5 py-1.5 ring-1 shadow-sm bg-white text-gray-900 ring-inset ring-gray-300 focus:right-2 focus:ring-primary-500 cursor-default"
  />
</template>
