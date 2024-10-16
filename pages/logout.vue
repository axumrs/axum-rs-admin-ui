<script setup lang="ts">
const handleCancel = () => {
  window.history.back();
};

const { $logout } = use$auth();
const { $msg } = use$status();
const { $del } = use$fetch();
const handleLogout = async () => {
  await $del("/admin/session/logout", () => {
    $logout();
    $msg("你已成功退出登录");
    return navigateTo("/login") as void;
  });
};
</script>

<template>
  <section class="h-full">
    <UCard
      class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 border shadow-md w-96"
    >
      <template #header><DailogTitle>退出登录</DailogTitle></template>
      <div>确定要退出本次登录吗？</div>
      <template #footer>
        <div class="flex justify-end items-center gap-x-2">
          <UButton color="white" @click="handleCancel">取消</UButton>
          <UButton color="red" @click="handleLogout">确定</UButton>
        </div>
      </template>
    </UCard>
  </section>
</template>
