<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">视频检测</h2>
    <p class="text-gray-600 mb-8">上传视频文件进行逐帧分析，识别视频中的交通标志</p>
    
    <!-- 检测结果区 -->
    <div v-if="result" class="mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-4xl">
        <!-- 视频播放区域 -->
        <div v-if="result.original_video" class="mb-6">
          <video 
            :src="serverPath + result.original_video" 
            controls 
            class="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
            style="max-height: 400px;"
          >
            您的浏览器不支持视频播放。
          </video>
        </div>
        
        <!-- 检测统计信息 -->
        <div class="text-left mb-6">
          <div class="font-bold text-lg text-gray-800 mb-4">检测结果统计</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-green-50 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">{{ result.summary?.total_detections || 0 }}</div>
              <div class="text-xs text-gray-600">总检测数</div>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">{{ result.summary?.processed_frames || 0 }}</div>
              <div class="text-xs text-gray-600">处理帧数</div>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600">{{ result.summary?.unique_categories?.length || 0 }}</div>
              <div class="text-xs text-gray-600">识别类别</div>
            </div>
            <div class="bg-orange-50 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-orange-600">{{ (result.processing_time || 0).toFixed(1) }}s</div>
              <div class="text-xs text-gray-600">处理时间</div>
            </div>
          </div>
          
          <!-- 视频信息 -->
          <div v-if="result.summary" class="bg-gray-50 p-4 rounded-lg mb-4">
            <div class="font-semibold text-gray-800 mb-2">视频信息</div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span class="text-gray-600">时长:</span> {{ result.summary.video_duration?.toFixed(1) }}s</div>
              <div><span class="text-gray-600">帧率:</span> {{ result.summary.fps?.toFixed(1) }} FPS</div>
              <div><span class="text-gray-600">总帧数:</span> {{ result.summary.total_frames }}</div>
              <div><span class="text-gray-600">处理帧数:</span> {{ result.summary.processed_frames }}</div>
              <div><span class="text-gray-600">总检测数:</span> {{ result.summary.total_detections }}</div>
            </div>
          </div>
          
          <!-- 识别类别列表 -->
          <div v-if="result.summary?.unique_signs?.length" class="mb-4">
            <div class="font-semibold text-gray-800 mb-2">识别到的交通标志类别</div>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="signName in result.summary.unique_signs" 
                :key="signName"
                class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {{ signName }}
              </span>
            </div>
          </div>
          
          <!-- 帧检测详情（可展开） -->
          <div v-if="result.frame_detections?.length" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <div class="font-semibold text-gray-800">帧检测详情</div>
              <button 
                @click="showFrameDetails = !showFrameDetails"
                class="text-green-600 hover:text-green-700 text-sm"
              >
                {{ showFrameDetails ? '收起' : '展开' }}
              </button>
            </div>
            
            <div v-if="showFrameDetails" class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <div 
                v-for="(frame, idx) in result.frame_detections.slice(0, 50)" 
                :key="idx"
                class="border-b border-gray-100 last:border-b-0 p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">
                    帧 {{ frame.frame_index }} ({{ frame.timestamp?.toFixed(2) }}s)
                  </span>
                  <span class="text-xs text-gray-500">{{ frame.detections?.length || 0 }} 个检测</span>
                </div>
                <div v-if="frame.detections?.length" class="space-y-1">
                  <div 
                    v-for="(detection, detIdx) in frame.detections" 
                    :key="detIdx"
                    class="text-xs bg-green-50 p-2 rounded flex justify-between"
                  >
                    <span class="text-green-700 font-medium">{{ detection.sign_name }}</span>
                    <span class="text-gray-600">{{ (detection.confidence * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
              <div v-if="result.frame_detections.length > 50" class="p-3 text-center text-gray-500 text-sm">
                仅显示前50帧，共{{ result.frame_detections.length }}帧有检测结果
              </div>
            </div>
          </div>
          

        </div>
        
        <button @click="reset" class="mt-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">重新上传</button>
      </div>
    </div>
    
    <!-- 视频上传区域 -->
    <div class="mb-6 relative" v-else>
      <!-- 参数配置 - 右上角 -->
      <div class="absolute top-0 right-0 z-10">
        <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-72">
          <h4 class="text-sm font-medium text-gray-800 mb-3">检测参数</h4>
          <div class="space-y-3">
            <!-- 置信度阈值 -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">置信度阈值</label>
              <input type="range" min="0" max="1" step="0.1" v-model.number="confidenceThreshold" 
                     class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider" />
              <div class="text-center text-xs text-green-600 font-medium mt-1">{{ confidenceThreshold }}</div>
            </div>
            
            <!-- 帧间隔 -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">帧间隔</label>
              <input type="range" min="1" max="30" step="1" v-model.number="frameInterval" 
                     class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider" />
              <div class="text-center text-xs text-green-600 font-medium mt-1">每{{ frameInterval }}帧检测一次</div>
            </div>
            
            <!-- 最大时长 -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">最大处理时长</label>
              <input type="range" min="10" max="300" step="10" v-model.number="maxDuration" 
                     class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider" />
              <div class="text-center text-xs text-green-600 font-medium mt-1">{{ maxDuration }}秒</div>
            </div>
            
            <!-- 复选框选项 -->
            <div class="space-y-2">
              <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="saveResult" 
                       class="w-3 h-3 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-1 mr-2" />
                保存检测结果
              </label>
              <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="returnVideo" 
                       class="w-3 h-3 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-1 mr-2" />
                返回检测视频
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态覆盖层 -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-lg">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div class="text-green-600 font-medium">正在处理视频...</div>
          <div class="text-gray-500 text-sm mt-1">这可能需要几分钟时间</div>
        </div>
      </div>
      
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import ReceiveFiles from '@/components/ReceiveFiles.vue'
import { detectVideoAPI } from '@/api/yolo/yoloApi'
import type { VideoDetectionResponse } from '@/types/apis/yolo_T'
import { ElMessage } from 'element-plus'

// 服务器路径
const serverPath = computed(() => import.meta.env.VITE_SERVER_PATH || '')

// 响应式变量定义
const result = ref<VideoDetectionResponse | null>(null)
const loading = ref<boolean>(false)
const confidenceThreshold = ref<number>(0.5)
const frameInterval = ref<number>(5)
const saveResult = ref<boolean>(false)
const returnVideo = ref<boolean>(true)
const maxDuration = ref<number>(60)
const showFrameDetails = ref<boolean>(false)

// 处理文件选择
const handleFileSelected = async (file: File) => {
  loading.value = true
  try {
    const res = await detectVideoAPI({ 
      video: file, 
      confidence_threshold: confidenceThreshold.value,
      frame_interval: frameInterval.value,
      save_result: saveResult.value,
      return_video: returnVideo.value,
      max_duration: maxDuration.value
    })
    
    if (res) {
      result.value = res
      ElMessage.success('视频检测完成')
    } else {
      ElMessage.error('视频检测失败')
      result.value = null
    }
  } catch (error) {
    console.error('视频检测出错:', error)
    ElMessage.error('视频检测出错，请重试')
    result.value = null
  } finally {
    loading.value = false
  }
}

// 重置结果
const reset = () => {
  result.value = null
  showFrameDetails.value = false
}
</script>

<style scoped>
/* 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #16a34a;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #16a34a;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-track {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
}

.slider::-moz-range-track {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  border: none;
}

.slider {
  background: transparent;
}

.slider:focus {
  outline: none;
}

.slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.3);
}
</style>

<style scoped>
/* 组件样式 */
</style>
