<template>
  <div class="statistics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">统计信息</h1>
      <p class="page-subtitle">查看检测统计数据和分析报告</p>
    </div>

    <!-- 统计数据卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">1,234</div>
        <div class="stat-label">总检测次数</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">98.5%</div>
        <div class="stat-label">平均准确率</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">0.12s</div>
        <div class="stat-label">平均检测时间</div>
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

// 检测类型分布图表配置
const typeDistributionOption = ref({
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
})

// 检测量趋势图表配置
const detectionVolumeOption = ref({
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
    data: [120, 132, 101, 134, 90, 230, 210],
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

onMounted(() => {
  // 组件挂载后的初始化逻辑
  console.log('统计页面已加载')
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
</style>