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
              >
            </div>
          </div>
          
          <!-- 分类筛选 -->
          <div class="flex gap-2">
            <select v-model="selectedCategory" class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400">
              <option value="">全部分类</option>
              <option value="warning">警告标志</option>
              <option value="prohibition">禁令标志</option>
              <option value="mandatory">指示标志</option>
              <option value="guide">指路标志</option>
            </select>
            
            <button 
              @click="resetFilters" 
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 交通标志网格 -->
      <TransitionGroup 
        name="sign-list" 
        tag="div" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up animation-delay-400"
      >
        <div 
          v-for="(sign, index) in filteredSigns" 
          :key="sign.id" 
          class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md overflow-hidden group cursor-pointer sign-card"
          @click="viewDetail(sign)"
        >
          <!-- 图标区域 -->
          <div class="p-6 text-center border-b border-gray-100">
            <div class="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full" :style="{ backgroundColor: sign.iconBg }">
              <span class="text-3xl">{{ sign.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all duration-300">{{ sign.name }}</h3>
          </div>
          
          <!-- 信息区域 -->
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ sign.info }}</p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in sign.tags" 
                :key="tag" 
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-all duration-200 cursor-pointer"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="filteredSigns.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-base font-medium text-gray-900 mb-1">未找到相关标志</h3>
        <p class="text-sm text-gray-500">请尝试调整搜索条件</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, TransitionGroup } from 'vue'

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('')

// 交通标志数据
const trafficSigns = ref([
  {
    id: 1,
    icon: '🛑',
    iconBg: '#fee2e2',
    name: '停车标志',
    info: '表示车辆必须停车。设在停车线前适当位置，无停车线的设在路口前适当位置。',
    tags: ['禁令标志', '必须停车', '路口'],
    category: 'prohibition'
  },
  {
    id: 2,
    icon: '⚠️',
    iconBg: '#fef3c7',
    name: '注意危险',
    info: '用以警告车辆、行人注意危险地点的标志。设在危险地点前适当位置。',
    tags: ['警告标志', '危险', '注意'],
    category: 'warning'
  },
  {
    id: 3,
    icon: '🚫',
    iconBg: '#fee2e2',
    name: '禁止通行',
    info: '表示禁止一切车辆和行人通行。设在禁止通行的道路入口处。',
    tags: ['禁令标志', '禁止通行', '道路封闭'],
    category: 'prohibition'
  },
  {
    id: 4,
    icon: '➡️',
    iconBg: '#dbeafe',
    name: '直行',
    info: '表示只准一切车辆直行。设在直行的路段前适当位置。',
    tags: ['指示标志', '直行', '方向'],
    category: 'mandatory'
  },
  {
    id: 5,
    icon: '↩️',
    iconBg: '#dbeafe',
    name: '向左转弯',
    info: '表示只准一切车辆向左转弯。设在车辆必须向左转弯的路口前适当位置。',
    tags: ['指示标志', '左转', '转弯'],
    category: 'mandatory'
  },
  {
    id: 6,
    icon: '↪️',
    iconBg: '#dbeafe',
    name: '向右转弯',
    info: '表示只准一切车辆向右转弯。设在车辆必须向右转弯的路口前适当位置。',
    tags: ['指示标志', '右转', '转弯'],
    category: 'mandatory'
  },
  {
    id: 7,
    icon: '🚷',
    iconBg: '#fee2e2',
    name: '禁止行人通行',
    info: '表示禁止行人通行。设在禁止行人通行的道路入口处。',
    tags: ['禁令标志', '禁止行人', '人行道'],
    category: 'prohibition'
  },
  {
    id: 8,
    icon: '🚴‍♂️',
    iconBg: '#dcfce7',
    name: '非机动车道',
    info: '表示该车道专供非机动车行驶。设在非机动车道的起点和入口处。',
    tags: ['指示标志', '非机动车', '车道'],
    category: 'mandatory'
  },
  {
    id: 9,
    icon: '🏫',
    iconBg: '#fef3c7',
    name: '注意儿童',
    info: '用以警告车辆驾驶人注意慢行，注意儿童。设在小学、幼儿园、少年宫等儿童经常出入地点前适当位置。',
    tags: ['警告标志', '儿童', '学校'],
    category: 'warning'
  },
  {
    id: 10,
    icon: '🚧',
    iconBg: '#fef3c7',
    name: '注意施工',
    info: '用以警告车辆驾驶人注意前方道路施工，车辆应减速慢行或绕道行驶。',
    tags: ['警告标志', '施工', '减速'],
    category: 'warning'
  },
  {
    id: 11,
    icon: '🚶‍♂️',
    iconBg: '#dcfce7',
    name: '人行横道',
    info: '表示该处为专供行人横穿马路的通道。设在人行横道的两侧。',
    tags: ['指示标志', '人行横道', '行人'],
    category: 'mandatory'
  },
  {
    id: 12,
    icon: '🔇',
    iconBg: '#fee2e2',
    name: '禁止鸣笛',
    info: '表示禁止机动车鸣喇叭。设在需要禁止鸣喇叭的地方。',
    tags: ['禁令标志', '禁止鸣笛', '噪音'],
    category: 'prohibition'
  },
  {
    id: 13,
    icon: '🏥',
    iconBg: '#e0f2fe',
    name: '医院',
    info: '表示医院的位置。设在医院附近适当位置。',
    tags: ['指路标志', '医院', '公共设施'],
    category: 'guide'
  },
  {
    id: 14,
    icon: '⛽',
    iconBg: '#e0f2fe',
    name: '加油站',
    info: '表示加油站的位置。设在加油站附近适当位置。',
    tags: ['指路标志', '加油站', '服务设施'],
    category: 'guide'
  },
  {
    id: 15,
    icon: '🅿️',
    iconBg: '#dbeafe',
    name: '停车场',
    info: '表示停车场的位置。设在停车场附近适当位置。',
    tags: ['指示标志', '停车场', '停车'],
    category: 'mandatory'
  },
  {
    id: 16,
    icon: '🔄',
    iconBg: '#fef3c7',
    name: '环形交叉',
    info: '用以警告车辆驾驶人注意前方是环形交叉路口。设在环形交叉路口前适当位置。',
    tags: ['警告标志', '环形交叉', '路口'],
    category: 'warning'
  }
])

// 筛选后的标志
const filteredSigns = computed(() => {
  return trafficSigns.value.filter(sign => {
    // 搜索筛选
    const matchesSearch = !searchQuery.value || 
      sign.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sign.info.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sign.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 分类筛选
    const matchesCategory = !selectedCategory.value || sign.category === selectedCategory.value
    
    return matchesSearch && matchesCategory
  })
})

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

// 查看详情
const viewDetail = (sign) => {
  console.log('查看标志详情:', sign)
  // 这里可以跳转到详情页面或打开模态框
}
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
