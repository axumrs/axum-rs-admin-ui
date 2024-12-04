<script setup lang="ts">
const { $get } = use$fetch();

const stat = ref<Statistics>();

const loadData = async () => {
  $get<Statistics>("/admin/statistics", (v) => {
    if (v) {
      stat.value = v;
    }
  });
};

await loadData();
</script>

<template>
  <PageTitle icon="ri:dashboard-horizontal-line">首页</PageTitle>

  <div class="flex justify-start items-center my-12 gap-6 cursor-default">
    <UCard class="w-80 hover:scale-105 transition-all">
      <h4 class="text-lg text-center mb-6">用户</h4>
      <UDivider orientation="horizontal" class="px-3" />
      <div class="flex justify-between gap-x-6 my-3">
        <div class="p-3 space-y-4">
          <div>今日</div>
          <div class="text-green-600">{{ stat?.today_users || 0 }}</div>
        </div>
        <UDivider orientation="vertical" class="py-4" />
        <div class="p-3 space-y-4">
          <div>合计</div>
          <div class="text-blue-600">{{ stat?.all_users || 0 }}</div>
        </div>
      </div>
    </UCard>

    <UCard class="w-80 hover:scale-105 transition-all">
      <h4 class="text-lg text-center mb-6">订单</h4>
      <UDivider orientation="horizontal" class="px-3" />
      <div class="flex justify-between gap-x-6 my-3">
        <div class="p-3 space-y-4">
          <div>今日</div>
          <div class="text-green-600">{{ stat?.today_orders || 0 }}</div>
        </div>
        <UDivider orientation="vertical" class="py-4" />
        <div class="p-3 space-y-4">
          <div>合计</div>
          <div class="text-blue-600">{{ stat?.all_orders || 0 }}</div>
        </div>
      </div>
    </UCard>
    <UCard class="w-80 hover:scale-105 transition-all">
      <h4 class="text-lg text-center mb-6">内容</h4>
      <UDivider orientation="horizontal" class="px-3" />
      <div class="flex justify-between gap-x-6 my-3">
        <div class="p-3 space-y-4">
          <div>专题</div>
          <div class="text-green-600">{{ stat?.subject || 0 }}</div>
        </div>
        <UDivider orientation="vertical" class="py-4" />
        <div class="p-3 space-y-4">
          <div>文章</div>
          <div class="text-blue-600">{{ stat?.topic || 0 }}</div>
        </div>
      </div>
    </UCard>

    <UCard class="w-80 hover:scale-105 transition-all">
      <h4 class="text-lg text-center mb-6">服务</h4>
      <UDivider orientation="horizontal" class="px-3" />
      <div class="flex justify-between gap-x-6 my-3">
        <div class="p-3 space-y-4">
          <div>已购</div>
          <div class="text-green-600">{{ stat?.purchased_service || 0 }}</div>
        </div>
        <UDivider orientation="vertical" class="py-4" />
        <div class="p-3 space-y-4">
          <div>合计</div>
          <div class="text-blue-600">{{ stat?.service || 0 }}</div>
        </div>
      </div>
    </UCard>
  </div>
</template>
