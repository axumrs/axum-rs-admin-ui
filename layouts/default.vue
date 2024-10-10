<script setup lang="ts">
const links = [
  [
    {
      label: "首页",
      icon: "ri:dashboard-horizontal-line",
      to: "/",
      labelClass: "text-lg",
    },
    {
      label: "专题",
      icon: "ri:archive-2-line",
      to: "/subject",
      labelClass: "text-lg",
    },
    {
      label: "文章",
      icon: "ri:article-line",
      to: "/topic",
      labelClass: "text-lg",
    },
    {
      label: "标签",
      icon: "ri:hashtag",
      to: "/tag",
      labelClass: "text-lg",
    },
  ],
  [
    {
      label: "修改密码",
      icon: "ri:lock-line",
      to: "/change-pwd",
      labelClass: "text-lg",
    },
    {
      label: "安全退出",
      icon: "ri:logout-box-r-line",
      to: "/logout",
      labelClass: "text-lg",
    },
  ],
];
</script>

<template>
  <div class="grid grid-cols-12 h-full">
    <aside class="col-span-2 space-y-4 p-6 border-r">
      <h2 class="flex justify-center items-center gap-x-1">
        <img src="/logo.png" class="w-6 object-cover" />
        <span class="text-xl font-normal">AXUM中文网</span>
      </h2>

      <UVerticalNavigation :links="links" class="space-y-2" />
    </aside>

    <main class="col-span-10 h-full overflow-y-auto p-6">
      <slot></slot>
    </main>
  </div>
</template>
