<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部标题和数据展示区域 -->
    <div class="container mx-auto px-6 py-12">
      <!-- 系统标题 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">
          智能交通标志识别系统
        </h1>
        <p class="text-xl text-gray-600 mb-12">
          基于YOLO深度学习算法的高精度交通标志检测与识别
        </p>
        
        <!-- 数据展示卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-green-500 mb-2">98.5%</div>
            <div class="text-gray-600 font-medium">识别准确率</div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-blue-500 mb-2">50+</div>
            <div class="text-gray-600 font-medium">标志类型</div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold text-purple-500 mb-2">0.1s</div>
            <div class="text-gray-600 font-medium">检测速度</div>
          </div>
        </div>
      </div>

      <!-- 功能卡片区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- 卡片1：实时识别 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">实时识别</h3>
          <p class="text-gray-600">支持摄像头实时视频流识别，快速准确检测交通标志</p>
        </div>

        <!-- 卡片2：图片上传 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">图片上传</h3>
          <p class="text-gray-600">上传本地图片进行批量识别，支持多种图片格式</p>
        </div>

        <!-- 卡片3：历史记录 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">历史记录</h3>
          <p class="text-gray-600">查看识别历史，统计分析识别结果和准确率</p>
        </div>

        <!-- 卡片4：数据统计 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">数据统计</h3>
          <p class="text-gray-600">详细的识别数据分析，可视化图表展示</p>
        </div>

        <!-- 卡片5：模型管理 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">模型管理</h3>
          <p class="text-gray-600">管理和优化YOLO模型，调整识别参数</p>
        </div>

        <!-- 卡片6：系统设置 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">系统设置</h3>
          <p class="text-gray-600">配置系统参数，用户权限管理和系统维护</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 页面数据
const stats = ref([
  { value: '98.5%', label: '识别准确率', color: 'text-green-500' },
  { value: '50+', label: '标志类型', color: 'text-blue-500' },
  { value: '0.1s', label: '检测速度', color: 'text-purple-500' }
])

const features = ref([
  {
    title: '实时识别',
    description: '支持摄像头实时视频流识别，快速准确检测交通标志',
    icon: 'video',
    color: 'blue'
  },
  {
    title: '图片上传',
    description: '上传本地图片进行批量识别，支持多种图片格式',
    icon: 'upload',
    color: 'green'
  },
  {
    title: '历史记录',
    description: '查看识别历史，统计分析识别结果和准确率',
    icon: 'history',
    color: 'purple'
  },
  {
    title: '数据统计',
    description: '详细的识别数据分析，可视化图表展示',
    icon: 'chart',
    color: 'orange'
  },
  {
    title: '模型管理',
    description: '管理和优化YOLO模型，调整识别参数',
    icon: 'settings',
    color: 'red'
  },
  {
    title: '系统设置',
    description: '配置系统参数，用户权限管理和系统维护',
    icon: 'config',
    color: 'indigo'
  }
])

onMounted(() => {
  console.log('交通标志识别系统首页加载完成')
})
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

.group:hover .group-hover\:bg-orange-200 {
  transition: background-color 0.3s ease;
}

.group:hover .group-hover\:bg-red-200 {
  transition: background-color 0.3s ease;
}

.group:hover .group-hover\:bg-indigo-200 {
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
</style>
