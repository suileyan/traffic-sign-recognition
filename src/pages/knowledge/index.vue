<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12 animate-fade-in-up">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">交通标志知识库</h1>
        <p class="text-xl text-gray-600">学习交通标志相关知识和法规</p>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-fade-in-up animation-delay-200">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索交通标志..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                @input="onSearchInput"
              >
            </div>
          </div>
          
          <!-- 分类筛选 -->
          <div class="flex gap-2">
            <select v-model="selectedCategory" class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400" @change="applyFilters">
              <option value="">全部分类</option>
              <option value="warning">警告标志</option>
              <option value="prohibition">禁令标志</option>
              <option value="indication">指示标志</option>
            </select>
            
            <!-- 形状筛选 -->
            <select v-if="availableShapes.length > 0" v-model="selectedShape" class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400" @change="filterByShape">
              <option value="">全部形状</option>
              <option v-for="shape in availableShapes" :key="shape" :value="shape">
                {{ getShapeDisplayName(shape) }}
              </option>
            </select>
            
            <button 
              @click="onResetFilters" 
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">加载中...</p>
      </div>

      <!-- 交通标志网格 -->
      <TransitionGroup 
        v-else
        name="sign-list" 
        tag="div" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up animation-delay-400"
      >
        <div 
          v-for="(sign, index) in filteredTrafficSigns" 
          :key="sign.id" 
          class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md overflow-hidden group cursor-pointer sign-card"
          @click="viewDetail(sign)"
        >
          <!-- 图标区域 -->
          <div class="p-6 text-center border-b border-gray-100">
            <div class="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full" :style="{ backgroundColor: getCategoryColor(sign.category_type) }">
              <span class="text-3xl">{{ getCategoryIcon(sign.category_type) }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all duration-300">{{ sign.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ sign.code }}</p>
          </div>
          
          <!-- 信息区域 -->
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ sign.description }}</p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                {{ sign.category_name }}
              </span>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-all duration-200 cursor-pointer">
                {{ sign.shape_display }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="!loading && filteredTrafficSigns.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-base font-medium text-gray-900 mb-1">未找到相关标志</h3>
        <p class="text-sm text-gray-500">请尝试调整搜索条件</p>
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="bg-white rounded-lg border border-red-200 p-12 text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-base font-medium text-red-900 mb-1">加载失败</h3>
        <p class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="loadData" 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, TransitionGroup } from 'vue'
import { getTrafficSignsAPI } from '@/api/hzsystem_traffic/hzsystem_traffic'
import type { TrafficSign, TrafficSignQueryParams, CategoryType } from '@/types/apis/hzsystem_traffic_T'

// 响应式数据
const trafficSigns = ref<TrafficSign[]>([])
const filteredTrafficSigns = ref<TrafficSign[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref<CategoryType | ''>('')
const selectedShape = ref('')
const availableShapes = ref<string[]>([])

// 防抖延迟
let debounceTimer: number | null = null

// 防抖函数
const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => func(...args), delay)
  }
}



// 防抖搜索
const onSearchInput = debounce(() => {
  loadData()
}, 300)

// 防抖加载数据

// 加载数据
async function loadData() {
  loading.value = true
  error.value = ''
  
  try {
    const params: TrafficSignQueryParams = {
      is_active: true
    }
    
    // 添加搜索条件
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    // 添加分类筛选
    if (selectedCategory.value) {
      // 需要先获取分类ID，这里简化处理
      // 实际项目中可能需要先获取分类列表然后根据类型查找ID
      params.category = getCategoryId(selectedCategory.value)
    }
    
    const response = await getTrafficSignsAPI(params)
    
    if (response.code === 200 || response.code === 0) {
      trafficSigns.value = response.data || []
      updateAvailableShapes()
      applyFilters()
    } else {
      throw new Error(response.message || '获取数据失败')
    }
  } catch (err: any) {
    console.error('加载交通标志数据失败:', err)
    error.value = err.message || '网络错误，请稍后重试'
    trafficSigns.value = []
    filteredTrafficSigns.value = []
    availableShapes.value = []
  } finally {
    loading.value = false
  }
}

// 根据分类类型获取颜色
const getCategoryColor = (categoryType: CategoryType): string => {
  const colorMap = {
    warning: '#fef3c7',
    prohibition: '#fee2e2',
    indication: '#dbeafe'
  }
  return colorMap[categoryType] || '#f3f4f6'
}

// 根据分类类型获取图标
const getCategoryIcon = (categoryType: CategoryType): string => {
  const iconMap = {
    warning: '⚠️',
    prohibition: '🚫',
    indication: '➡️'
  }
  return iconMap[categoryType] || '🚦'
}

// 根据分类类型获取分类ID（这里是简化实现）
const getCategoryId = (categoryType: CategoryType): number | undefined => {
  // 实际项目中应该从分类列表中查找对应的ID
  // 这里返回undefined表示不按分类筛选，而是使用search参数
  return undefined
}

// 更新可用形状列表
const updateAvailableShapes = () => {
  const validShapes = ['circle', 'triangle', 'rectangle', 'diamond', 'octagon']
  const shapes = new Set<string>()
  
  trafficSigns.value.forEach(sign => {
    if (sign.shape && validShapes.includes(sign.shape)) {
      shapes.add(sign.shape)
    }
  })
  
  availableShapes.value = Array.from(shapes).sort()
}

// 获取形状的中文显示名称
const getShapeDisplayName = (shape: string): string => {
  const shapeNames: Record<string, string> = {
    circle: '圆形',
    triangle: '三角形',
    rectangle: '矩形',
    diamond: '菱形',
    octagon: '八角形'
  }
  return shapeNames[shape] || shape
}

// 应用所有筛选条件
const applyFilters = () => {
  let filtered = [...trafficSigns.value]
  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(sign => sign.category_type === selectedCategory.value)
  }
  // 形状筛选
  if (selectedShape.value) {
    filtered = filtered.filter(sign => sign.shape === selectedShape.value)
  }
  filteredTrafficSigns.value = filtered
}
const debouncedSearch = debounce(applyFilters, 300)

// 形状筛选处理
const filterByShape = () => {
  applyFilters()
}

// 重置筛选条件
const onResetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedShape.value = ''
  loadData()
}

// 查看详情
const viewDetail = (sign: TrafficSign) => {
  console.log('查看标志详情:', sign)
  // 这里可以跳转到详情页面或打开模态框
  // 可以使用 router.push 或显示模态框
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-scale {
  animation: fadeInScale 0.5s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

/* 卡片悬停效果 */
.sign-card {
  transition: all 0.3s ease !important;

  transform: scale(1);
  will-change: transform, box-shadow, background-color;
}

.sign-card:hover {
  transform: scale(1.07) translateY(-2px) rotateZ(-1deg);
  box-shadow: 0 16px 32px -6px rgba(60, 80, 180, 0.12), 0 6px 12px -2px rgba(60, 80, 180, 0.08);
  background-color: #f3f6fd;
}

/* 图标区域动画增强 */
.group:hover .text-3xl {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* 列表过渡动画 */
.sign-list-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sign-list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.sign-list-enter-from {
  opacity: 0;
  transform: scale(0.8) rotateY(90deg);
}

.sign-list-leave-to {
  opacity: 0;
  transform: scale(0.6) rotateX(45deg) rotateZ(10deg);
}

.sign-list-move {
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 搜索框聚焦动画 */
input:focus {
  transform: scale(1.02);
}

/* 按钮点击动画 */
button:active {
  transform: scale(0.98);
}
</style>
