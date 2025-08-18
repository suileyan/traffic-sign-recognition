<template>
  <div class="statistics-page">
    <!-- 页面标题 -->
    <div class="page-header animate-fade-in-up">
      <h1 class="page-title">统计信息</h1>
      <p class="page-subtitle">查看检测统计数据和分析报告</p>
    </div>

    <!-- 统计数据卡片 -->
    <div class="stats-cards animate-fade-in-up animation-delay-200">
      <div class="stat-card">
        <div class="stat-value">{{ statsData.totalDetections }}</div>
        <div class="stat-label">总检测次数</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ statsData.accuracyRate }}</div>
        <div class="stat-label">平均准确率</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ statsData.avgDetectionTime }}</div>
        <div class="stat-label">平均检测时间</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ statsData.weeklyDetections }}</div>
        <div class="stat-label">本周检测量</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section animate-fade-in-up animation-delay-400">
      <!-- 检测类型分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">检测类型分布</h3>
          <span class="chart-type">饼图</span>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="typeDistributionOption"
            autoresize
          />
        </div>
      </div>

      <!-- 检测量趋势 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">检测量趋势</h3>
          <span class="chart-type">折线图</span>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="detectionVolumeOption"
            autoresize
          />
        </div>
      </div>

      <!-- 识别准确率趋势 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">识别准确率趋势</h3>
          <span class="chart-type">折线图</span>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="accuracyTrendOption"
            autoresize
          />
        </div>
      </div>
    </div>

    <!-- 最近记录 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">最近检测记录</h3>
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>
      <div v-else-if="userStatistics?.recent_records?.length" class="space-y-3">
        <div
          v-for="record in userStatistics.recent_records"
          :key="record.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ record.detection_type_display }}</p>
              <p class="text-sm text-gray-500">用户: {{ record.user_name }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center space-x-2">
              <span
                :class="{
                  'bg-green-100 text-green-800': record.status_display === '成功',
                  'bg-red-100 text-red-800': record.status_display === '失败',
                  'bg-yellow-100 text-yellow-800': record.status_display === '处理中'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ record.status_display }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              耗时: {{ record.processing_time?.toFixed(2) }}s
            </p>
            <p class="text-xs text-gray-400">
              {{ new Date(record.created_at).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="mt-2 text-gray-500">暂无检测记录</p>
      </div>
     </div>

     <!-- 成就展示 -->
     <div class="bg-white rounded-lg shadow-sm p-6">
       <h3 class="text-lg font-semibold text-gray-800 mb-4">我的成就</h3>
       <div v-if="loading" class="text-center py-8">
         <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
         <p class="mt-2 text-gray-500">加载中...</p>
       </div>
       <div v-else-if="userStatistics?.achievements?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <div
           v-for="achievement in userStatistics.achievements"
           :key="achievement.id"
           class="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
         >
           <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
             <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
             </svg>
           </div>
           <div>
             <h4 class="font-medium text-gray-900">{{ achievement.title }}</h4>
             <p class="text-sm text-gray-600">{{ achievement.description }}</p>
             <p class="text-xs text-gray-500 mt-1">
               获得时间: {{ new Date(achievement.earned_at).toLocaleDateString() }}
             </p>
           </div>
         </div>
       </div>
       <div v-else class="text-center py-8">
         <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
         </svg>
         <p class="mt-2 text-gray-500">暂无成就</p>
         <p class="text-sm text-gray-400">继续使用系统来解锁更多成就吧！</p>
       </div>
     </div>
   </div>
 </template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { getUserDetailedStatisticsAPI } from '@/api/hzsystem_traffic/hzsystem_traffic'
import type { UserDetailedStatistics } from '@/types/apis/hzsystem_traffic_T'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const userStatistics = ref<UserDetailedStatistics | null>(null)
const loading = ref(false)

// 计算属性 - 统计卡片数据
const statsData = computed(() => {
  if (!userStatistics.value) {
    return {
      totalDetections: 0,
      accuracyRate: '0%',
      avgDetectionTime: '0s'
    }
  }

  return {
    totalDetections: userStatistics.value.total_detections,
    accuracyRate: (userStatistics.value.accuracy_rate * 100).toFixed(1) + '%',
    avgDetectionTime: userStatistics.value.recent_records.length > 0
      ? (userStatistics.value.recent_records.reduce((sum, record) => sum + record.processing_time, 0) / userStatistics.value.recent_records.length).toFixed(2) + 's'
      : '0s',
    weeklyDetections: userStatistics.value.weekly_detections
  }
})

// 获取用户统计数据
const fetchUserStatistics = async () => {
  try {
    loading.value = true
    // 假设当前用户ID为1，实际应该从用户状态中获取
    const response = await getUserDetailedStatisticsAPI(1)
    userStatistics.value = response.data
  } catch (error) {
    console.error('获取用户统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 检测类型分布图表配置
const typeDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#666'
    }
  },
  series: [{
    name: '检测类型',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['60%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 8,
      borderColor: '#fff',
      borderWidth: 2
    },
    label: {
      show: false,
      position: 'center'
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
      },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    labelLine: {
      show: false
    },
    data: [
      { value: 320, name: '禁令标志', itemStyle: { color: '#3b82f6' } },
      { value: 280, name: '警告标志', itemStyle: { color: '#10b981' } },
      { value: 190, name: '指示标志', itemStyle: { color: '#f59e0b' } },
      { value: 150, name: '指路标志', itemStyle: { color: '#ef4444' } },
      { value: 80, name: '旅游标志', itemStyle: { color: '#8b5cf6' } }
    ]
  }]
}))

// 检测量趋势图表配置
const detectionVolumeOption = computed(() => {
  // 基于用户统计数据生成模拟的月度趋势
  const monthlyData = userStatistics.value ? [
    Math.floor(userStatistics.value.monthly_detections * 0.6),
    Math.floor(userStatistics.value.monthly_detections * 0.7),
    Math.floor(userStatistics.value.monthly_detections * 0.8),
    Math.floor(userStatistics.value.monthly_detections * 0.9),
    Math.floor(userStatistics.value.monthly_detections * 0.95),
    userStatistics.value.monthly_detections,
    Math.floor(userStatistics.value.monthly_detections * 1.1)
  ] : [0, 0, 0, 0, 0, 0, 0]

  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [{
      name: '检测量',
      type: 'line',
      data: monthlyData,
      smooth: true,
      lineStyle: {
        color: '#10b981',
        width: 3
      },
      itemStyle: {
        color: '#10b981'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(16, 185, 129, 0.3)'
          }, {
            offset: 1, color: 'rgba(16, 185, 129, 0.05)'
          }]
        }
      }
    }]
  }
})

// 识别准确率趋势图表配置
const accuracyTrendOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    axisLabel: {
      color: '#666'
    }
  },
  yAxis: {
    type: 'value',
    min: 95,
    max: 100,
    axisLabel: {
      color: '#666',
      formatter: '{value}%'
    }
  },
  series: [{
    name: '准确率',
    type: 'line',
    data: [97.2, 98.1, 97.8, 98.5, 97.9, 98.7, 98.5],
    smooth: true,
    lineStyle: {
      color: '#f59e0b',
      width: 3
    },
    itemStyle: {
      color: '#f59e0b'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(245, 158, 11, 0.3)'
        }, {
          offset: 1, color: 'rgba(245, 158, 11, 0.05)'
        }]
      }
    }
  }]
})

onMounted(async () => {
  // 组件挂载后的初始化逻辑
  console.log('统计页面已加载')
  await fetchUserStatistics()
})
</script>

<style scoped>
.statistics-page {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stat-icon {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  color: #9ca3af;
  opacity: 0.6;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-type {
  font-size: 12px;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .statistics-page {
    padding: 16px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .charts-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card,
  .chart-card {
    padding: 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .stat-value {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .statistics-page {
    padding: 12px;
  }

  .stat-card,
  .chart-card {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .stat-value {
    font-size: 28px;
  }

  .chart-container {
    height: 250px;
  }
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
</style>