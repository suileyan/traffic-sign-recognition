<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面头部 -->
    <div class="">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-800 mb-4">检测记录</h1>
          <p class="text-xl text-gray-600 mb-8">查看和管理历史检测记录</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-6xl mx-auto px-6 py-6">
      <!-- 筛选区域 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-40">
            <label class="block text-sm text-gray-600 mb-1">检测类型</label>
            <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全部类型</option>
              <option value="image">图片检测</option>
              <option value="video">视频检测</option>
              <option value="realtime">实时检测</option>
            </select>
          </div>
          <div class="flex-1 min-w-40">
            <label class="block text-sm text-gray-600 mb-1">识别结果</label>
            <select v-model="filters.result" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="">全部结果</option>
              <option value="停车标志">停车标志</option>
              <option value="限速标志">限速标志</option>
              <option value="禁止通行">禁止通行</option>
              <option value="让行标志">让行标志</option>
            </select>
          </div>
          <div class="flex-1 min-w-36">
            <label class="block text-sm text-gray-600 mb-1">开始日期</label>
            <input v-model="filters.startDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="flex-1 min-w-36">
            <label class="block text-sm text-gray-600 mb-1">结束日期</label>
            <input v-model="filters.endDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
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
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div v-for="(record, index) in paginatedRecords" :key="record.id" :class="[
          'p-6 hover:bg-gray-50 transition-colors border-gray-200',
          index !== paginatedRecords.length - 1 ? 'border-b' : ''
        ]">
          <div class="flex gap-6">
            <!-- 图片区域 -->
            <div class="flex-shrink-0">
              <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img v-if="record.image" :src="record.image" :alt="record.result" class="w-full h-full object-cover">
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
                <h3 class="text-lg font-semibold text-gray-900">{{ record.result }}</h3>
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
                  {{ record.detectTime }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"></path>
                  </svg>
                  {{ getTypeText(record.type) }}
                </div>
              </div>
              
              <!-- 置信度进度条 -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700">置信度</span>
                  <span class="text-sm font-semibold" :class="getConfidenceTextColor(record.confidence)">{{ record.confidence }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    :class="getConfidenceBarColor(record.confidence)"
                    :style="{ width: record.confidence + '%' }"
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
                  @click="currentPage = page" 
                  :class="[
                    'px-3 py-1 text-sm border rounded-md',
                    currentPage === page 
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

<script setup>
import { ref, computed } from 'vue'

// 筛选条件
const filters = ref({
  type: '',
  result: '',
  startDate: '',
  endDate: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟数据
const records = ref([
  {
    id: 1,
    title: '停车标志检测',
    detectTime: '2024-01-15 14:30:25',
    type: 'image',
    result: '停车标志',
    confidence: 96.8,
    image: 'https://via.placeholder.com/96x96/ef4444/ffffff?text=STOP'
  },
  {
    id: 2,
    title: '限速标志检测',
    detectTime: '2024-01-15 13:15:42',
    type: 'video',
    result: '限速60标志',
    confidence: 94.2,
    image: 'https://via.placeholder.com/96x96/3b82f6/ffffff?text=60'
  },
  {
    id: 3,
    title: '禁止通行标志检测',
    detectTime: '2024-01-14 16:22:18',
    type: 'realtime',
    result: '禁止通行',
    confidence: 98.5,
    image: 'https://via.placeholder.com/96x96/dc2626/ffffff?text=X'
  },
  {
    id: 4,
    title: '让行标志检测',
    detectTime: '2024-01-14 10:45:33',
    type: 'image',
    result: '让行标志',
    confidence: 82.1,
    image: 'https://via.placeholder.com/96x96/f59e0b/ffffff?text=YIELD'
  },
  {
    id: 5,
    title: '危险标志检测',
    detectTime: '2024-01-13 09:20:15',
    type: 'image',
    result: '危险警告',
    confidence: 67.3,
    image: 'https://via.placeholder.com/96x96/f97316/ffffff?text=!'
  },
  {
    id: 6,
    title: '直行标志检测',
    detectTime: '2024-01-12 15:30:45',
    type: 'image',
    result: '直行标志',
    confidence: 91.5,
    image: 'https://via.placeholder.com/96x96/10b981/ffffff?text=↑'
  },
  {
    id: 7,
    title: '左转标志检测',
    detectTime: '2024-01-12 11:20:30',
    type: 'video',
    result: '左转标志',
    confidence: 88.7,
    image: 'https://via.placeholder.com/96x96/8b5cf6/ffffff?text=←'
  },
  {
    id: 8,
    title: '右转标志检测',
    detectTime: '2024-01-11 16:45:12',
    type: 'realtime',
    result: '右转标志',
    confidence: 93.2,
    image: 'https://via.placeholder.com/96x96/06b6d4/ffffff?text=→'
  },
  {
    id: 9,
    title: '禁止左转标志检测',
    detectTime: '2024-01-11 14:15:28',
    type: 'image',
    result: '禁止左转',
    confidence: 85.9,
    image: 'https://via.placeholder.com/96x96/ef4444/ffffff?text=⊘←'
  },
  {
    id: 10,
    title: '限速40标志检测',
    detectTime: '2024-01-10 10:30:55',
    type: 'video',
    result: '限速40标志',
    confidence: 92.4,
    image: 'https://via.placeholder.com/96x96/3b82f6/ffffff?text=40'
  },
  {
    id: 11,
    title: '人行横道标志检测',
    detectTime: '2024-01-10 08:45:33',
    type: 'image',
    result: '人行横道',
    confidence: 89.6,
    image: 'https://via.placeholder.com/96x96/059669/ffffff?text=🚶'
  },
  {
    id: 12,
    title: '学校区域标志检测',
    detectTime: '2024-01-09 16:20:18',
    type: 'realtime',
    result: '学校区域',
    confidence: 95.1,
    image: 'https://via.placeholder.com/96x96/f59e0b/ffffff?text=🏫'
  },
  {
    id: 13,
    title: '施工标志检测',
    detectTime: '2024-01-09 13:55:42',
    type: 'image',
    result: '施工标志',
    confidence: 78.3,
    image: 'https://via.placeholder.com/96x96/f97316/ffffff?text=🚧'
  },
  {
    id: 14,
    title: '禁止鸣笛标志检测',
    detectTime: '2024-01-08 12:10:25',
    type: 'video',
    result: '禁止鸣笛',
    confidence: 86.7,
    image: 'https://via.placeholder.com/96x96/dc2626/ffffff?text=🔇'
  },
  {
    id: 15,
    title: '环岛标志检测',
    detectTime: '2024-01-08 09:35:15',
    type: 'image',
    result: '环岛标志',
    confidence: 90.8,
    image: 'https://via.placeholder.com/96x96/8b5cf6/ffffff?text=⭕'
  }
])

// 获取检测类型文本
const getTypeText = (type) => {
  const typeMap = {
    image: '图片检测',
    video: '视频检测',
    realtime: '实时检测'
  }
  return typeMap[type] || type
}

// 筛选后的记录
const filteredRecords = computed(() => {
  return records.value.filter(record => {
    // 类型筛选
    if (filters.value.type && record.type !== filters.value.type) {
      return false
    }
    
    // 结果筛选
    if (filters.value.result && !record.result.includes(filters.value.result)) {
      return false
    }
    
    // 日期筛选
    if (filters.value.startDate) {
      const recordDate = new Date(record.detectTime.split(' ')[0])
      const startDate = new Date(filters.value.startDate)
      if (recordDate < startDate) {
        return false
      }
    }
    
    if (filters.value.endDate) {
      const recordDate = new Date(record.detectTime.split(' ')[0])
      const endDate = new Date(filters.value.endDate)
      if (recordDate > endDate) {
        return false
      }
    }
    
    return true
  })
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / pageSize.value)
})

// 当前页的记录
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
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
    type: '',
    result: '',
    startDate: '',
    endDate: ''
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
</style>
