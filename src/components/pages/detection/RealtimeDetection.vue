<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">实时检测</h2>
    <p class="text-gray-600 mb-8">使用摄像头进行实时视频流检测，即时识别交通标志</p>
    
    <!-- 摄像头预览区域 -->
    <div class="bg-gray-900 rounded-xl p-12 mb-6">
      <div class="text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <p class="text-lg text-gray-300 mb-2">摄像头预览区域</p>
        <p class="text-sm text-gray-400 mb-4">点击开始按钮启动摄像头</p>
        <button 
          class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          @click="startCamera"
        >
          启动摄像头
        </button>
      </div>
    </div>
    
    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
        <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        实时响应
      </div>
      <div class="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
        <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        0.1s延迟
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 启动摄像头函数
const startCamera = () => {
  console.log('启动摄像头')
  // 这里可以添加摄像头启动逻辑
}
</script>

<style scoped>
/* 组件样式 */
</style>