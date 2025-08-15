<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">图片检测</h2>
    <p class="text-gray-600 mb-8">上传本地图片进行交通标志识别，支持JPG、PNG等多种格式</p>
    <!-- 检测结果区 -->
    <div v-if="result" class="mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-md">
        <img :src="result.image_url" alt="检测结果" class="w-full rounded mb-4" v-if="result.image_url" />
        <div class="text-left">
          <div class="font-bold text-lg text-gray-800 mb-2">识别结果</div>
          <div v-if="result.detections && result.detections.length">
            <div v-for="(item, idx) in result.detections" :key="idx" class="mb-2 p-2 bg-blue-50 rounded">
              <span class="text-blue-700 font-semibold">{{ item.label }}</span>
              <span class="ml-2 text-gray-600">置信度: {{ (item.confidence * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div v-else class="text-gray-500">未检测到交通标志</div>
        </div>
        <button @click="reset" class="mt-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">重新上传</button>
      </div>
    </div>
    <!-- 图片上传区域 -->
    <div class="mb-6" v-else>
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
import { detectImageAPI } from '@/api/yolo/yoloApi'

const result = ref(null)
const loading = ref(false)

const handleFileSelected = async (file) => {
  loading.value = true
  try {
    const res = await detectImageAPI({ image: file })
    if (res && res.code === 200 && res.data) {
      result.value = res.data
    } else {
      result.value = { detections: [], image_url: '' }
    }
  } catch (e) {
    result.value = { detections: [], image_url: '' }
  } finally {
    loading.value = false
  }
}

const reset = () => {
  result.value = null
}
</script>

<style scoped>
/* 组件样式 */
</style>