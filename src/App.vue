<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useElementPlusLocale } from '@/composables/useElementPlusLocale'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Layout from './components/layout/index.vue'

// 获取 Element Plus 国际化配置
const { elementPlusLocale } = useElementPlusLocale()

// 获取当前路由
const route = useRoute()

// 判断是否为后台管理页面
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<template>
  <ElConfigProvider :locale="elementPlusLocale">
    <!-- 后台管理页面不使用全局Layout -->
    <router-view v-if="isAdminPage" />

    <!-- 其他页面使用全局Layout -->
    <Layout v-else>
      <router-view />
    </Layout>
  </ElConfigProvider>
</template>

<style scoped></style>
