<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">图片检测</h2>
    <p class="text-gray-600 mb-8">上传本地图片进行交通标志识别，支持JPG、PNG等多种格式</p>
    
    <!-- 图片上传区域 -->
    <div class="mb-6">
      <ReceiveFiles 
        model="image" 
        @file-selected="handleFileSelected"
      />
    </div>
    
    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
        <svg class="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        高精度识别
      </div>
      <div class="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
        <svg class="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        批量处理
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReceiveFiles from '@/components/ReceiveFiles.vue'

// 处理文件选择
const handleFileSelected = (file) => {
  console.log('选择的图片文件:', file)
  // 这里可以添加图片处理逻辑
}
</script>

<style scoped>
/* 组件样式 */
</style>