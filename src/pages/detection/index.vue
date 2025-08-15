<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-6 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">
          智能检测
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          选择检测方式开始识别交通标志
        </p>
      </div>

      <!-- 选项卡导航 -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-2">
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center justify-center px-6 py-4 rounded-xl transition-all duration-300 font-medium',
                activeTab === tab.id
                  ? `bg-${tab.color}-500 text-white shadow-lg`
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.iconPath"></path>
              </svg>
              {{ tab.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- 图片检测内容 -->
          <ImageDetection v-if="activeTab === 'image'" />

          <!-- 视频检测内容 -->
          <VideoDetection v-if="activeTab === 'video'" />

          <!-- 实时检测内容 -->
          <RealtimeDetection v-if="activeTab === 'realtime'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageDetection from '@/components/pages/detection/ImageDetection.vue'
import VideoDetection from '@/components/pages/detection/VideoDetection.vue'
import RealtimeDetection from '@/components/pages/detection/RealtimeDetection.vue'

// 当前激活的选项卡
const activeTab = ref('image')

// 选项卡数据
const tabs = ref([
  {
    id: 'image',
    title: '图片检测',
    color: 'blue',
    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    id: 'video',
    title: '视频检测',
    color: 'green',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
  },
  {
    id: 'realtime',
    title: '实时检测',
    color: 'purple',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
  }
])
</script>

<style scoped>
/* 自定义动画效果 */
.group:hover .group-hover\:bg-blue-200 {
  transition: background-color 0.3s ease;
}

.group:hover .group-hover\:bg-green-200 {
  transition: background-color 0.3s ease;
}

.group:hover .group-hover\:bg-purple-200 {
  transition: background-color 0.3s ease;
}

/* 渐变背景动画 */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 卡片悬停效果 */
.transform:hover {
  transform: translateY(-4px) scale(1.02);
}
</style>