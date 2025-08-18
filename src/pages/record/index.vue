<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面头部 -->
    <div class="">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="text-center animate-fade-in-up">
          <h1 class="text-5xl font-bold text-gray-800 mb-4">检测记录</h1>
          <p class="text-xl text-gray-600 mb-8">查看和管理历史检测记录</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-6xl mx-auto px-6 py-6">
      <!-- 筛选区域 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 mb-6 animate-fade-in-up animation-delay-200">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-40">
            <label class="block text-sm text-gray-600 mb-1">检测类型</label>
            <select v-model="filters.detection_type" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全部类型</option>
              <option value="image">图片检测</option>
              <option value="video">视频检测</option>
              <option value="realtime">实时检测</option>
            </select>
          </div>
          <div class="flex-1 min-w-40">
            <label class="block text-sm text-gray-600 mb-1">检测状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全部状态</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
          </div>
          <div class="flex-1 min-w-36">
            <label class="block text-sm text-gray-600 mb-1">开始日期</label>
            <input v-model="filters.start_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="flex-1 min-w-36">
            <label class="block text-sm text-gray-600 mb-1">结束日期</label>
            <input v-model="filters.end_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="flex gap-2">
            <button @click="resetFilters" class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm">
              重置
            </button>
            <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 历史记录列表 -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up animation-delay-400">
        <div v-for="(record, index) in paginatedRecords" :key="record.id" :class="[
          'p-6 hover:bg-gray-50 transition-colors border-gray-200 animate-fade-in-up',
          index !== paginatedRecords.length - 1 ? 'border-b' : '',
          `animation-delay-${600 + index * 100}`
        ]">
          <div class="flex gap-6">
            <!-- 图片区域 -->
            <div class="flex-shrink-0">
              <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img v-if="record.result_image" :src="record.result_image" :alt="record.status_display" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 内容区域 -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ record.detection_type_display }}</h3>
                  <p class="text-sm text-gray-600">状态: {{ record.status_display }}</p>
                </div>
                <div class="flex gap-2 ml-4">
                  <button @click="viewDetail(record)" class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    详情
                  </button>
                  <button @click="deleteRecord(record.id)" class="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                    删除
                  </button>
                </div>
              </div>
              
              <!-- 基本信息 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ new Date(record.created_at).toLocaleString() }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  处理时间: {{ record.processing_time.toFixed(2) }}s
                </div>
              </div>
              
              <!-- 置信度进度条 -->
              <div v-if="record.confidence" class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700">置信度</span>
                  <span class="text-sm font-semibold" :class="getConfidenceTextColor(record.confidence * 100)">{{ (record.confidence * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    :class="getConfidenceBarColor(record.confidence * 100)"
                    :style="{ width: (record.confidence * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div v-if="filteredRecords.length > 0" class="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredRecords.length) }} 条，共 {{ filteredRecords.length }} 条记录
          </div>
          <div class="flex items-center space-x-2">
            <!-- 每页显示数量选择 -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">每页显示：</span>
              <select v-model="pageSize" @change="currentPage = 1" class="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option value="5">5条</option>
                <option value="10">10条</option>
                <option value="20">20条</option>
                <option value="50">50条</option>
              </select>
            </div>
            
            <!-- 分页按钮 -->
            <div class="flex items-center space-x-1">
              <button 
                @click="currentPage = 1" 
                :disabled="currentPage === 1"
                class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                首页
              </button>
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              <!-- 页码按钮 -->
              <template v-for="page in visiblePages" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="currentPage = Number(page)" 
                  :class="[
                    'px-3 py-1 text-sm border rounded-md',
                    currentPage === Number(page) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 py-1 text-sm text-gray-500">...</span>
              </template>
              
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
              <button 
                @click="currentPage = totalPages" 
                :disabled="currentPage === totalPages"
                class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                末页
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredRecords.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-base font-medium text-gray-900 mb-1">暂无检测记录</h3>
        <p class="text-sm text-gray-500">还没有任何检测记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getDetectionRecordsAPI } from '@/api/hzsystem_traffic/hzsystem_traffic'
import type { DetectionRecord, DetectionRecordQueryParams } from '@/types/apis/hzsystem_traffic_T'

// 筛选条件
const filters = ref({
  detection_type: '',
  status: '',
  start_date: '',
  end_date: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 数据状态
const loading = ref(false)
const records = ref<DetectionRecord[]>([])
const totalCount = ref(0)
const nextPage = ref<string | null>(null)
const previousPage = ref<string | null>(null)

// 获取检测记录数据
const fetchRecords = async () => {
  try {
    loading.value = true
    const params: DetectionRecordQueryParams = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    // 添加筛选条件
    if (filters.value.detection_type) {
      params.detection_type = filters.value.detection_type as any
    }
    if (filters.value.status) {
      params.status = filters.value.status as any
    }
    if (filters.value.start_date) {
      params.start_date = filters.value.start_date
    }
    if (filters.value.end_date) {
      params.end_date = filters.value.end_date
    }
    
    const response = await getDetectionRecordsAPI(params)
    console.log('获取检测记录响应:', response)
    if (response) {
      const paginatedData = response
      totalCount.value = paginatedData.count
      nextPage.value = paginatedData.next
      previousPage.value = paginatedData.previous
      records.value = paginatedData.results.data
    }
  } catch (error) {
    console.error('获取检测记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'image': '图片检测',
    'video': '视频检测',
    'realtime': '实时检测'
  }
  return typeMap[type] || type
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRecords()
})

// 监听筛选条件变化
watch([() => filters.value.detection_type, () => filters.value.status, () => filters.value.start_date, () => filters.value.end_date], () => {
  currentPage.value = 1
  fetchRecords()
}, { deep: true })

// 总页数
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / pageSize.value)
})

// 当前页的记录（直接使用API返回的数据）
const paginatedRecords = computed(() => {
  return records.value
})

// 筛选后的记录（API已处理筛选，直接返回records）
const filteredRecords = computed(() => {
  return records.value
})

// 分页函数
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 监听页码和页面大小变化
watch([currentPage, pageSize], () => {
  fetchRecords()
})

// 可见的页码
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总是显示第一页
    pages.push(1)
    
    if (current <= 4) {
      // 当前页在前面时
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后面时
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间时
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    detection_type: '',
    status: '',
    start_date: '',
    end_date: ''
  }
  currentPage.value = 1
}

// 应用筛选
const applyFilters = () => {
  console.log('应用筛选条件:', filters.value)
  currentPage.value = 1
}

// 查看详情
const viewDetail = (record) => {
  console.log('查看详情:', record)
  // 这里可以跳转到详情页面或打开模态框
}

// 获取置信度进度条颜色
const getConfidenceBarColor = (confidence) => {
  if (confidence >= 90) return 'bg-green-500'
  if (confidence >= 80) return 'bg-blue-500'
  if (confidence >= 70) return 'bg-yellow-500'
  if (confidence >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

// 获取置信度文字颜色
const getConfidenceTextColor = (confidence) => {
  if (confidence >= 90) return 'text-green-600'
  if (confidence >= 80) return 'text-blue-600'
  if (confidence >= 70) return 'text-yellow-600'
  if (confidence >= 60) return 'text-orange-600'
  return 'text-red-600'
}

// 删除记录
const deleteRecord = (id) => {
  if (confirm('确定要删除这条记录吗？')) {
    const index = records.value.findIndex(record => record.id === id)
    if (index > -1) {
      records.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
/* 组件样式 */

/* 自定义动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-700 {
  animation-delay: 700ms;
}

.animation-delay-800 {
  animation-delay: 800ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

.animation-delay-1100 {
  animation-delay: 1100ms;
}

.animation-delay-1200 {
  animation-delay: 1200ms;
}

.animation-delay-1300 {
  animation-delay: 1300ms;
}

.animation-delay-1400 {
  animation-delay: 1400ms;
}

.animation-delay-1500 {
  animation-delay: 1500ms;
}
</style>
