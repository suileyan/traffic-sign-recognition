<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">视频检测</h2>
    <p class="text-gray-600 mb-8">上传视频文件进行逐帧分析，识别视频中的交通标志</p>
    
    <!-- 视频上传区域 -->
    <div class="mb-6">
      <ReceiveFiles 
        :allow-suffix="['mp4', 'avi', 'mov', 'mkv', 'wmv']"
        :max-size="100 * 1024 * 1024"
        @file-selected="handleFileSelected"
      />
    </div>
    
    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center justify-center p-3 bg-green-50 rounded-lg">
        <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        逐帧分析
      </div>
      <div class="flex items-center justify-center p-3 bg-green-50 rounded-lg">
        <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        时间轴标记
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReceiveFiles from '@/components/ReceiveFiles.vue'

// 处理文件选择
const handleFileSelected = (file) => {
  console.log('选择的视频文件:', file)
  // 这里可以添加视频处理逻辑
}
</script>

<style scoped>
/* 组件样式 */
</style>