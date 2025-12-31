<template>
    <n-result status="404" title="404 Not Found" description="你访问了一个不存在的资源">
      <template #footer>
        <n-button type="primary" @click="goHome">返回首页</n-button>
      </template>
    </n-result>
  </template>
  <script setup lang="js">
  import { NButton, NResult } from 'naive-ui'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const goHome = () => router.push('/')
  </script>