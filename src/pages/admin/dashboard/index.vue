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
  import { getSystemStatisticsOverviewAPI, getUserStatisticsAPI, getDetectionRecordsAPI } from '@/api/hzsystem_traffic/hzsystem_traffic'
  import type { SystemStatisticsOverviewResponse, UserStatistics, DetectionRecord } from '@/types/apis/hzsystem_traffic_T'
  import { ref, onMounted, computed } from 'vue'
  import { User, ShoppingCart, Money, Timer, TrendCharts } from '@element-plus/icons-vue'
  const statistics = ref<SystemStatisticsOverviewResponse>()
  const userStatistics = ref<UserStatistics>()
  const detectionRecords = ref<DetectionRecord[]>([])
  const loading = ref(false)

  const fetchStatistics = async () => {
    loading.value = true
    try {
      statistics.value = await getSystemStatisticsOverviewAPI()
      userStatistics.value = await getUserStatisticsAPI()
      const detectionResponse = await getDetectionRecordsAPI()
      if (detectionResponse && detectionResponse.results && detectionResponse.results.data) {
        detectionRecords.value = detectionResponse.results.data.sort((a, b) => b.id - a.id)
      } else {
        detectionRecords.value = []
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStatistics()
  })
  
  const dashboardData = computed(() => {
    if (!statistics.value) {
      return {
        totalUsers: { value: 0, change: '', label: '总用户数' },
        totalDetections: { value: 0, change: '', label: '总检测次数' },
        averageAccuracy: { value: '--', change: '', label: '平均准确率' },
        systemAvailability: { value: '--', change: '', label: '系统可用性' },
      };
    }
  
    const stats = statistics.value;
    
    return {
      totalUsers: {
        value: stats.total_users,
        change: '',
        label: '总用户数',
      },
      totalDetections: {
        value: stats.total_detections,
        change: '',
        label: '总检测次数',
      },
      averageAccuracy: {
        value: `${stats.average_accuracy}%`,
        change: '',
        label: '平均准确率',
      },
      systemAvailability: {
        value: `${stats.system_availability}%`,
        change: '',
        label: '系统可用性',
      },
    };
  })
  
  // 用户增长趋势（基于真实数据）
  const userGrowthData = computed((): EChartsOption => {
    if (!userStatistics.value || !userStatistics.value.data) {
      return {
        title: { text: '用户增长趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#3b82f6' }
        }]
      }
    }

    // 按月份统计用户注册数量
    const monthlyStats = new Map<string, number>()
    const now = new Date()
    
    // 初始化最近6个月的数据
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyStats.set(monthKey, 0)
    }

    // 统计每个月的用户注册数量
    userStatistics.value.data.forEach(user => {
      const createdDate = new Date(user.created_at)
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`
      if (monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, (monthlyStats.get(monthKey) || 0) + 1)
      }
    })

    // 生成图表数据
    const labels: string[] = []
    const data: number[] = []
    let cumulativeCount = 0

    Array.from(monthlyStats.entries()).forEach(([monthKey, count]) => {
      const [year, month] = monthKey.split('-')
      labels.push(`${month}月`)
      cumulativeCount += count
      data.push(cumulativeCount)
    })

    return {
      title: { text: '用户增长趋势（最近6个月）', left: 'center' },
      tooltip: { 
        trigger: 'axis',
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex
          const monthKey = Array.from(monthlyStats.keys())[dataIndex]
          const monthlyCount = monthlyStats.get(monthKey) || 0
          return `${params[0].name}<br/>累计用户: ${params[0].value}<br/>本月新增: ${monthlyCount}`
        }
      },
      xAxis: { type: 'category', data: labels },
      yAxis: { type: 'value', name: '用户数量' },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { color: '#3b82f6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ]
          }
        }
      }]
    }
  })
  
  // 检测量统计（基于真实数据）
  const detectionStatsData = computed((): EChartsOption => {
    if (!detectionRecords.value || detectionRecords.value.length === 0) {
      return {
        title: { text: '检测量统计（最近7天）', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{
          data: [],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#10b981' }
        }]
      }
    }

    // 生成最近7天的日期和标签
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD格式
        label: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      }
    })

    // 按日期统计检测量
    const dailyStats = new Map<string, number>()
    last7Days.forEach(day => {
      dailyStats.set(day.date, 0)
    })

    // 统计每天的检测数量
    detectionRecords.value.forEach(record => {
      const recordDate = new Date(record.created_at).toISOString().split('T')[0]
      if (dailyStats.has(recordDate)) {
        dailyStats.set(recordDate, (dailyStats.get(recordDate) || 0) + 1)
      }
    })

    // 生成图表数据
    const labels = last7Days.map(day => day.label)
    const data = last7Days.map(day => dailyStats.get(day.date) || 0)
  
    return {
      title: { text: '检测量统计（最近7天）', left: 'center' },
      tooltip: { 
        trigger: 'axis',
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex
          const date = last7Days[dataIndex].date
          return `${params[0].name}<br/>检测数量: ${params[0].value}<br/>日期: ${date}`
        }
      },
      xAxis: { type: 'category', data: labels },
      yAxis: { type: 'value', name: '检测数量' },
      series: [{
        data: data,
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
  
  const trafficSignDistributionData = computed((): EChartsOption => {
    if (!detectionRecords.value || detectionRecords.value.length === 0) {
      return {
        title: { text: '交通标志分类分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: '标志类型',
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
      }
    }

    // 统计各类交通标志的检测次数
    const categoryStats = new Map<string, number>()
    
    detectionRecords.value.forEach(record => {
      if (record.detection_results && record.detection_results.length > 0) {
        // 取置信度最高的检测结果
        const bestResult = record.detection_results.reduce((prev, current) => 
          (prev.confidence > current.confidence) ? prev : current
        )
        if (bestResult.traffic_sign_name) {
          categoryStats.set(bestResult.traffic_sign_name, (categoryStats.get(bestResult.traffic_sign_name) || 0) + 1)
        }
      }
    })

    // 转换为图表数据格式
    const chartData = Array.from(categoryStats.entries()).map(([name, count]) => ({
      name,
      value: count
    }))
  
    return {
      title: { text: '交通标志分类分布', left: 'center' },
      tooltip: { 
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '标志类型',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  })
  
  // 模型性能监控
  const modelPerformanceData = computed((): EChartsOption => {
    if (!detectionRecords.value || detectionRecords.value.length === 0) {
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

    // 计算检测准确率（与history页面保持一致的计算方式）
    const totalDetections = detectionRecords.value.length
    const successfulDetections = detectionRecords.value.filter(record =>
      record.status_display === 'completed' || record.status_display === '成功'
    ).length
    
    const accuracyRate = totalDetections > 0 ? 
      Math.round((successfulDetections / totalDetections) * 1000) / 10 : 0
  
    return {
      title: { text: '模型性能监控', left: 'center' },
      tooltip: { 
        formatter: (params: any) => {
          return `${params.name}<br/>准确率: ${params.value}%<br/>成功检测: ${successfulDetections}<br/>总检测数: ${totalDetections}`
        }
      },
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
                    {{ dashboardData.systemAvailability.label }}
                  </p>
                  <Motion
                    :initial="{ opacity: 0, y: 10 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: 0.9 }"
                  >
                    <p class="text-2xl font-bold text-purple-900">
                      {{ dashboardData.systemAvailability.value }}
                    </p>
                    <p class="text-sm text-purple-600 mt-1">
                      {{ dashboardData.systemAvailability.change }}
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
  
        <!-- 交通标志分类分布 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 1.0 } as any"
        >
          <el-card>
            <template #header>
              <span class="font-medium">交通标志分类分布</span>
            </template>
            <div class="h-64">
              <Motion
                class="h-full"
                :initial="{ opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{ duration: 0.5, delay: 1.2 }"
              >
                <v-chart :option="trafficSignDistributionData" class="w-full h-full" autoresize />
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
  