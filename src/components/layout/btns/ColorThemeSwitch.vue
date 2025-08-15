<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 当前选中的主题色
const currentColorTheme = ref('blue')

// 主题色配置
const colorThemes = computed(() => [
  {
    name: 'blue',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#ef4444',
  },
  {
    name: 'green',
    primary: '#22c55e',
    secondary: '#78716c',
    accent: '#f59e0b',
  },
  {
    name: 'purple',
    primary: '#a855f7',
    secondary: '#6b7280',
    accent: '#d946ef',
  },
  {
    name: 'orange',
    primary: '#f97316',
    secondary: '#737373',
    accent: '#ef4444',
  },
  {
    name: 'cyan',
    primary: '#06b6d4',
    secondary: '#64748b',
    accent: '#14b8a6',
  },
  {
    name: 'pink',
    primary: '#ec4899',
    secondary: '#737373',
    accent: '#f43f5e',
  },
])

// 当前主题色的主色调
const currentThemeColor = computed(() => {
  const theme = colorThemes.value.find(t => t.name === currentColorTheme.value)
  return theme?.primary || '#3b82f6'
})

// 设置主题色
function setColorTheme(themeName: string) {
  currentColorTheme.value = themeName

  // 设置data-theme属性到html元素
  document.documentElement.setAttribute('data-theme', themeName)

  // 保存到localStorage
  localStorage.setItem('color-theme', themeName)
}

// 初始化主题色
onMounted(() => {
  // 从localStorage获取保存的主题色
  const savedTheme = localStorage.getItem('color-theme')
  if (savedTheme && colorThemes.value.some(t => t.name === savedTheme)) {
    setColorTheme(savedTheme)
  }
  else {
    // 默认使用蓝色主题
    setColorTheme('blue')
  }
})
</script>

<template>
  <div class="dropdown dropdown-end">
    <!-- 主题色切换按钮 -->
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <div class="w-5 h-5 rounded-full" :style="{ backgroundColor: currentThemeColor }" />
    </div>

    <!-- 主题色选择下拉菜单 -->
    <ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52">
      <li class="mb-2">
        <div class="text-sm font-medium opacity-60 px-2 py-1">
          {{ t('colorTheme.title') }}
        </div>
      </li>

      <!-- 主题色选项 -->
      <li v-for="theme in colorThemes" :key="theme.name">
        <button class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 w-full"
          :class="{ 'bg-base-200': currentColorTheme === theme.name }" @click="setColorTheme(theme.name)">
          <!-- 主题色预览 -->
          <div class="flex gap-1">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: theme.primary }" />
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: theme.secondary }" />
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: theme.accent }" />
          </div>

          <!-- 主题名称 -->
          <span class="flex-1 text-left text-sm">{{ t(`colorTheme.${theme.name}`) }}</span>

          <!-- 选中状态 -->
          <div v-if="currentColorTheme === theme.name" class="w-2 h-2 bg-primary rounded-full" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 组件样式 */
.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

/* 滚动条样式 */
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
