<template>
  <div class="text-center">
    <div
      class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto"
    >
      <svg
        class="w-12 h-12 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">图片检测</h2>
    <p class="text-gray-600 mb-8">
      上传本地图片进行交通标志识别，支持JPG、PNG等多种格式
    </p>
    <!-- 检测结果区 -->
    <div v-if="result" class="mb-6">
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-md"
      >
        <img
          :src="`${serverPath}${result.result_image}`"
          alt="检测结果"
          class="w-full rounded mb-4"
          v-if="result.result_image"
        />
        <div class="text-left">
          <div class="font-bold text-lg text-gray-800 mb-2">识别结果</div>
          <div class="mb-3 text-sm text-gray-600">
            <span>检测数量: {{ result.detections.length }}</span>
            <span class="ml-4"
              >处理时间:
              {{ (result.processing_time * 1000).toFixed(0) }}ms</span
            >
          </div>
          <div v-if="result.detections && result.detections.length">
            <div
              v-for="(item, idx) in result.detections"
              :key="idx"
              class="mb-2 p-2 bg-blue-50 rounded"
            >
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-blue-700 font-semibold">{{
                    item.sign_name
                  }}</span>
                  <span class="ml-2 text-sm text-gray-500"
                    >({{ item.category }})</span
                  >
                </div>
                <span class="text-gray-600"
                  >{{ (item.confidence * 100).toFixed(1) }}%</span
                >
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">未检测到交通标志</div>
        </div>
        <button
          @click="reset"
          class="mt-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          重新上传
        </button>
      </div>
    </div>
    <!-- 图片上传区域 -->
    <div class="mb-6 relative" v-else>
      <!-- 参数配置 - 右上角 -->
      <div class="absolute top-0 right-0 z-10">
        <!-- 参数配置面板 -->
          <div
            class="bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-lg w-64"
          >
            <h4
              class="text-sm font-medium text-gray-800 mb-3 cursor-pointer select-none flex items-center gap-1"
              @click="toggleConfig"
            >
              检测参数
              <svg
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-180': showConfig }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <transition name="config-panel">
              <div v-show="showConfig" class="space-y-3" style="overflow:hidden">
                <!-- 置信度阈值 -->
                <div>
                  <label class="block text-xs text-gray-600 mb-1">置信度阈值</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    v-model.number="confidenceThreshold"
                    class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider"
                  />
                  <div class="text-center text-xs text-blue-600 font-medium mt-1">
                    {{ confidenceThreshold }}
                  </div>
                </div>
                <!-- 复选框选项 -->
                <div class="space-y-2">
                  <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="saveResult"
                      class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1 mr-2"
                    />
                    保存检测结果
                  </label>
                  <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="returnImage"
                      class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1 mr-2"
                    />
                    返回检测图片
                  </label>
                </div>
              </div>
            </transition>
          </div>
      </div>
      <ReceiveFiles model="image" @file-selected="handleFileSelected" />
    </div>
    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
        <svg
          class="w-4 h-4 text-blue-600 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          ></path>
        </svg>
        高精度识别
      </div>
      <div class="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
        <svg
          class="w-4 h-4 text-blue-600 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          ></path>
        </svg>
        批量处理
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ReceiveFiles from "@/components/ReceiveFiles.vue";
import { detectImageAPI } from "@/api/yolo/yoloApi";
import type { ImageDetectionResponse } from "@/types/apis/yolo_T";

const result = ref<ImageDetectionResponse | null>(null);
const serverPath = computed(() => import.meta.env.VITE_SERVER_PATH);
const loading = ref<boolean>(false);
const confidenceThreshold = ref<number>(0.5);
const saveResult = ref<boolean>(false);
const returnImage = ref<boolean>(true);
const showConfig = ref<boolean>(true);
function toggleConfig() {
  showConfig.value = !showConfig.value;
}

const handleFileSelected = async (file: File) => {
  loading.value = true;
  try {
    const res = await detectImageAPI({
      image: file,
      confidence_threshold: confidenceThreshold.value,
      save_result: saveResult.value,
      return_image: returnImage.value,
    });
    console.log("API响应:", res);

    if (res) {
      result.value = res;
    } else {
      result.value = {
        success: false,
        record_id: 0,
        detections: [],
        processing_time: 0,
        original_image: "",
        result_image: "",
        detected_category: null,
      };
    }
  } catch (e) {
    result.value = {
      success: false,
      record_id: 0,
      detections: [],
      processing_time: 0,
      original_image: "",
      result_image: "",
      detected_category: null,
    };
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  result.value = null;
};
</script>

<style scoped>
/* 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
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
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
.config-panel-enter-active,
.config-panel-leave-active {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.config-panel-enter-from,
.config-panel-leave-to {
  height: 0 !important;
  opacity: 0;
}
.config-panel-enter-to,
.config-panel-leave-from {
  height: auto !important;
  opacity: 1;
}
</style>
