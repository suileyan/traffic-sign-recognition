<script setup lang="ts">
  import { Motion } from "motion-v";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import { LineChart, BarChart, PieChart, GaugeChart } from "echarts/charts";
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  } from "echarts/components";
  import VChart from "vue-echarts";
  import type { EChartsOption } from "echarts";
  
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ]);
  
  // 仪表板数据
  // const dashboardData = {
  //   totalUsers: {
  //     value: 1421,
  //     change: "+5.2%",
  //     label: "总用户数",
  //   },
  //   totalDetections: {
  //     value: 5859,
  //     change: "+12.8%",
  //     label: "总检测次数",
  //   },
  //   averageAccuracy: {
  //     value: "94.0%",
  //     change: "+0.3%",
  //     label: "平均准确率",
  //   },
  //   averageResponseTime: {
  //     value: "+8%",
  //     change: "-0.1s",
  //     label: "平均响应时间",
  //   },
  // };
  // 用户增长趋势数据已移至计算属性中
  
  // 检测量统计数据已移至计算属性中
  
  // 垃圾分类分布数据已移至文件末尾的计算属性中
  
  // 模型性能监控数据已移至计算属性中
  
  // 动画配置
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2, ease: ["easeOut"] },
    },
    transition: { duration: 0.4, ease: ["easeOut"] },
  };
  
  const statsCardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: {
      scale: 1.05,
      y: -8,
      transition: { duration: 0.3, ease: ["easeOut"] },
    },
    transition: { duration: 0.5, ease: ["easeOut"] },
  };
  
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    whileHover: {
      scale: 1.2,
      rotate: 10,
      transition: { duration: 0.2, ease: ["easeOut"] },
    },
    transition: { duration: 0.6, delay: 0.3, ease: ["easeOut"] },
  };
  import { getStatisticsOverviewAPI, getDetectionRecordsAPI } from '@/api/admin/hzsystem_rubbish'
  import type { DetectionRecord } from '@/types/apis/hzsystem_rubbish_T'
  import { ref, onMounted, computed } from 'vue'
  const statistics = ref()
  const detectionRecords = ref<DetectionRecord[]>([])
  const loading = ref(false)
  
  const fetchStatistics = async () => {
    loading.value = true
    try {
      statistics.value = await getStatisticsOverviewAPI()
    } finally {
      loading.value = false
    }
  }
  
  const fetchDetectionRecords = async () => {
    try {
      detectionRecords.value = await getDetectionRecordsAPI()
    } catch (error) {
      console.error('获取检测记录失败:', error)
    }
  }
  
  onMounted(() => {
    fetchStatistics()
    fetchDetectionRecords()
  })
  
  const dashboardData = computed(() => {
    if (!detectionRecords.value.length) {
      return {
        totalUsers: { value: 0, change: '', label: '总用户数' },
        totalDetections: { value: 0, change: '', label: '总检测次数' },
        averageAccuracy: { value: '--', change: '', label: '平均准确率' },
        averageResponseTime: { value: '--', change: '', label: '平均响应时间' },
      };
    }
  
    const records = detectionRecords.value;
    
    // 计算总检测数（与history页面一致）
    const totalDetections = records.length;
    
    // 计算总用户数（去重，与history页面一致）
    const uniqueUsers = new Set(records.map(record => record.user));
    const totalUsers = uniqueUsers.size;
    
    // 计算准确率（基于置信度平均值，与history页面一致）
    const avgConfidence = records.length > 0 
      ? records.reduce((sum, record) => sum + record.confidence, 0) / records.length
      : 0;
    const accuracyRate = Math.round(avgConfidence * 1000) / 10; // 保留一位小数
    
    // 计算平均响应时间（基于检测记录的处理时间）
    const avgResponseTime = records.length > 0
      ? records.reduce((sum, record) => sum + record.processing_time, 0) / records.length
      : 0;
  
    return {
      totalUsers: {
        value: totalUsers,
        change: '',
        label: '总用户数',
      },
      totalDetections: {
        value: totalDetections,
        change: '',
        label: '总检测次数',
      },
      averageAccuracy: {
        value: accuracyRate > 0 ? `${accuracyRate}%` : '--',
        change: '',
        label: '平均准确率',
      },
      averageResponseTime: {
        value: avgResponseTime > 0 ? `${avgResponseTime.toFixed(2)}s` : '--',
        change: '',
        label: '平均响应时间',
      },
    };
  })
  
  // 基于检测记录的用户增长趋势（按月统计最近6个月）
  const userGrowthData = computed((): EChartsOption => {
    if (!detectionRecords.value.length) {
      return {
        title: { text: '用户增长趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
        yAxis: { type: 'value' },
        series: [{ data: [0, 0, 0, 0, 0, 0], type: 'line', smooth: true, itemStyle: { color: '#3b82f6' } }]
      }
    }
  
    // 获取最近6个月的数据
    const now = new Date()
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: `${date.getMonth() + 1}月`
      }
    })
  
    // 统计每月活跃用户数（有检测记录的用户）
    const monthlyUserCounts = last6Months.map(monthInfo => {
      const uniqueUsers = new Set()
      detectionRecords.value.forEach(record => {
        const recordDate = new Date(record.created_at)
        if (recordDate.getFullYear() === monthInfo.year && recordDate.getMonth() + 1 === monthInfo.month) {
          uniqueUsers.add(record.user)
        }
      })
      return uniqueUsers.size
    })
  
    return {
      title: { text: '用户活跃趋势（最近6个月）', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: last6Months.map(m => m.label) },
      yAxis: { type: 'value' },
      series: [{
        data: monthlyUserCounts,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#3b82f6' }
      }]
    }
  })
  
  // 基于检测记录的检测量统计（按天统计最近7天）
  const detectionStatsData = computed((): EChartsOption => {
    if (!detectionRecords.value.length) {
      return {
        title: { text: '检测量统计', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [{ 
          data: [0, 0, 0, 0, 0, 0, 0], 
          type: 'line', 
          smooth: true,
          itemStyle: { color: '#10b981' },
          lineStyle: { color: '#10b981' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
              ]
            }
          }
        }]
      }
    }
  
    // 获取最近7天的数据
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })
  
    // 统计每天的检测次数
    const dailyCounts = last7Days.map(date => {
      return detectionRecords.value.filter(record => {
        const recordDate = new Date(record.created_at).toISOString().split('T')[0]
        return recordDate === date
      }).length
    })
  
    // 生成星期标签
    const weekLabels = last7Days.map(date => {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekdays[new Date(date).getDay()]
    })
  
    return {
      title: { text: '检测量统计（最近7天）', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: weekLabels },
      yAxis: { type: 'value' },
      series: [{
        data: dailyCounts,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
            ]
          }
        }
      }]
    }
  })
  
  const wasteDistributionData = computed((): EChartsOption => statistics.value ? {
    title: { text: '垃圾分类分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '垃圾类型',
        type: 'pie',
        radius: '50%',
        data: statistics.value.category_distribution.map((item: {detected_category__name: string, count: number}) => ({ value: item.count, name: item.detected_category__name })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  } : {
    title: { text: '垃圾分类分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '垃圾类型',
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
  
  // 基于检测记录的模型性能监控（准确率与history页面一致）
  const modelPerformanceData = computed((): EChartsOption => {
    if (!detectionRecords.value.length) {
      return {
        title: { text: '模型性能监控', left: 'center' },
        tooltip: { formatter: '{a} <br/>{b} : {c}%' },
        series: [{
          name: '准确率',
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: 0, name: '准确率' }],
          axisLine: {
            lineStyle: {
              color: [
                [0.3, '#ff4757'],
                [0.7, '#ffa502'],
                [1, '#2ed573'],
              ],
            },
          },
        }]
      }
    }
  
    // 计算准确率（基于置信度平均值，与history页面逻辑一致）
    const records = detectionRecords.value
    const avgConfidence = records.length > 0 
      ? records.reduce((sum, record) => sum + record.confidence, 0) / records.length
      : 0
    const accuracyRate = Math.round(avgConfidence * 1000) / 10 // 保留一位小数
  
    return {
      title: { text: '模型性能监控', left: 'center' },
      tooltip: { formatter: '{a} <br/>{b} : {c}%' },
      series: [{
        name: '准确率',
        type: 'gauge',
        detail: { formatter: '{value}%' },
        data: [{ value: accuracyRate, name: '准确率' }],
        axisLine: {
          lineStyle: {
            color: [
              [0.3, '#ff4757'],
              [0.7, '#ffa502'],
              [1, '#2ed573'],
            ],
          },
        },
      }]
    }
  })
  </script>
  
  <template>
    <div class="dashboard">
      <!-- 仪表板页面 -->
      <Motion
        :initial="cardVariants.initial"
        :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
      >
        <el-card class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-medium">仪表板</span>
              <Motion
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }"
                :transition="{ duration: 0.3, delay: 0.5 }"
              >
                <el-button type="primary" size="small">刷新数据</el-button>
              </Motion>
            </div>
          </template>
  
          <!-- 统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Motion
              :initial="statsCardVariants.initial"
              :animate="statsCardVariants.animate"
              :whileHover="statsCardVariants.whileHover as any"
              :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
              class="bg-blue-50 p-6 rounded-lg cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-600 text-sm font-medium">
                    {{ dashboardData.totalUsers.label }}
                  </p>
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: 0.6 }"
                  >
                    <p class="text-2xl font-bold text-blue-900">
                      {{ dashboardData.totalUsers.value.toLocaleString() }}
                    </p>
                    <p class="text-sm text-blue-600 mt-1">
                      {{ dashboardData.totalUsers.change }}
                    </p>
                  </Motion>
                </div>
                <Motion
                  :initial="iconVariants.initial"
                  :animate="iconVariants.animate"
                  :whileHover="iconVariants.whileHover as any"
                  :transition="{ ...iconVariants.transition, delay: 0.5 } as any"
                  class="text-blue-500"
                >
                  <el-icon size="32">
                    <User />
                  </el-icon>
                </Motion>
              </div>
            </Motion>
  
            <Motion
              :initial="statsCardVariants.initial"
              :animate="statsCardVariants.animate"
              :whileHover="statsCardVariants.whileHover as any"
              :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
              class="bg-green-50 p-6 rounded-lg cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-600 text-sm font-medium">
                    {{ dashboardData.totalDetections.label }}
                  </p>
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: 0.7 }"
                  >
                    <p class="text-2xl font-bold text-green-900">
                      {{ dashboardData.totalDetections.value.toLocaleString() }}
                    </p>
                    <p class="text-sm text-green-600 mt-1">
                      {{ dashboardData.totalDetections.change }}
                    </p>
                  </Motion>
                </div>
                <Motion
                  :initial="iconVariants.initial"
                  :animate="iconVariants.animate"
                  :whileHover="iconVariants.whileHover as any"
                  :transition="{ ...iconVariants.transition, delay: 0.6 } as any"
                  class="text-green-500"
                >
                  <el-icon size="32">
                    <ShoppingCart />
                  </el-icon>
                </Motion>
              </div>
            </Motion>
  
            <Motion
              :initial="statsCardVariants.initial"
              :animate="statsCardVariants.animate"
              :whileHover="statsCardVariants.whileHover as any"
              :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
              class="bg-yellow-50 p-6 rounded-lg cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-600 text-sm font-medium">
                    {{ dashboardData.averageAccuracy.label }}
                  </p>
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: 0.8 }"
                  >
                    <p class="text-2xl font-bold text-yellow-900">
                      {{ dashboardData.averageAccuracy.value }}
                    </p>
                    <p class="text-sm text-yellow-600 mt-1">
                      {{ dashboardData.averageAccuracy.change }}
                    </p>
                  </Motion>
                </div>
                <Motion
                  :initial="iconVariants.initial"
                  :animate="iconVariants.animate"
                  :whileHover="iconVariants.whileHover as any"
                  :transition="{ ...iconVariants.transition, delay: 0.7 } as any"
                  class="text-yellow-500"
                >
                  <el-icon size="32">
                    <Money />
                  </el-icon>
                </Motion>
              </div>
            </Motion>
  
            <Motion
              :initial="statsCardVariants.initial"
              :animate="statsCardVariants.animate"
              :whileHover="statsCardVariants.whileHover as any"
              :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
              class="bg-purple-50 p-6 rounded-lg cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-600 text-sm font-medium">
                    {{ dashboardData.averageResponseTime.label }}
                  </p>
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: 0.9 }"
                  >
                    <p class="text-2xl font-bold text-purple-900">
                      {{ dashboardData.averageResponseTime.value }}
                    </p>
                    <p class="text-sm text-purple-600 mt-1">
                      {{ dashboardData.averageResponseTime.change }}
                    </p>
                  </Motion>
                </div>
                <Motion
                  :initial="iconVariants.initial"
                  :animate="iconVariants.animate"
                  :whileHover="iconVariants.whileHover as any"
                  :transition="{ ...iconVariants.transition, delay: 0.8 } as any"
                  class="text-purple-500"
                >
                  <el-icon size="32">
                    <TrendCharts />
                  </el-icon>
                </Motion>
              </div>
            </Motion>
          </div>
        </el-card>
      </Motion>
  
      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 用户增长趋势 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 0.8 } as any"
        >
          <el-card>
            <template #header>
              <span class="font-medium">用户增长趋势</span>
            </template>
            <div class="h-64">
              <Motion
                class="h-full"
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5, delay: 1.0 }"
              >
                <v-chart :option="userGrowthData" class="w-full h-full" autoresize />
              </Motion>
            </div>
          </el-card>
        </Motion>
  
        <!-- 检测量统计 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 0.9 } as any"
        >
          <el-card>
            <template #header>
              <span class="font-medium">检测量统计</span>
            </template>
            <div class="h-64">
              <Motion
                class="h-full"
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5, delay: 1.1 }"
              >
                <v-chart :option="detectionStatsData" class="w-full h-full" autoresize />
              </Motion>
            </div>
          </el-card>
        </Motion>
  
        <!-- 垃圾分类分布 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 1.0 } as any"
        >
          <el-card>
            <template #header>
              <span class="font-medium">垃圾分类分布</span>
            </template>
            <div class="h-64">
              <Motion
                class="h-full"
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5, delay: 1.2 }"
              >
                <v-chart :option="wasteDistributionData" class="w-full h-full" autoresize />
              </Motion>
            </div>
          </el-card>
        </Motion>
  
        <!-- 模型性能监控 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 1.1 } as any"
        >
          <el-card>
            <template #header>
              <span class="font-medium">模型性能监控</span>
            </template>
            <div class="h-64">
              <Motion
                class="h-full"
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5, delay: 1.3 }"
              >
                <v-chart :option="modelPerformanceData" class="w-full h-full" autoresize />
              </Motion>
            </div>
          </el-card>
        </Motion>
      </div>
    </div>
  </template>
  
  <style scoped>
  .dashboard {
    width: 100%;
  }
  
  /* 统计卡片增强样式 */
  .cursor-pointer {
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .cursor-pointer:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  /* 响应式动画优化 */
  @media (prefers-reduced-motion: reduce) {
    .cursor-pointer {
      transition: none;
    }
  }
  
  /* 增强卡片视觉效果 */
  .el-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  
  .el-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
  </style>
  
  const dashboardData = computed(() => statistics.value ? {
    totalUsers: {
      value: statistics.value.total_users,
      change: '',
      label: '总用户数',
    },
    totalDetections: {
      value: statistics.value.total_detections,
      change: '',
      label: '总检测次数',
    },
    averageAccuracy: {
      value: statistics.value.accuracy_rate ? (statistics.value.accuracy_rate * 100).toFixed(1) + '%' : '--',
      change: '',
      label: '平均准确率',
    },
    averageResponseTime: {
      value: '--',
      change: '',
      label: '平均响应时间',
    },
  } : {
    totalUsers: { value: 0, change: '', label: '总用户数' },
    totalDetections: { value: 0, change: '', label: '总检测次数' },
    averageAccuracy: { value: '--', change: '', label: '平均准确率' },
    averageResponseTime: { value: '--', change: '', label: '平均响应时间' },
  })
  const wasteDistributionData = computed((): EChartsOption => statistics.value ? {
    title: { text: '垃圾分类分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '垃圾类型',
        type: 'pie',
        radius: '50%',
        data: statistics.value.category_distribution.map(item => ({ value: item.count, name: item.detected_category__name })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  } : {
    title: { text: '垃圾分类分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '垃圾类型',
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
  