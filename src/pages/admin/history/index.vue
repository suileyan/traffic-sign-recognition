<script setup lang="ts">
import { Motion } from "motion-v";
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { View } from '@element-plus/icons-vue';
import { getDetectionRecordsAPI, getSystemStatisticsOverviewAPI } from '@/api/hzsystem_traffic/hzsystem_traffic';
import type { DetectionRecord, SystemStatisticsOverview } from '@/types/apis/hzsystem_traffic_T';// 统计概览数据
const statisticsOverview = ref<SystemStatisticsOverview>();

// 检测历史数据（计算属性）- 基于检测记录详情数据
const historyData = computed(() => {
  if (!detectionRecords.value.length) {
    return {
      todayDetection: {
        value: 0,
        change: "0%",
        label: "总检测数",
      },
      weekDetection: {
        value: 0,
        change: "0%",
        label: "成功检测数",
      },
      monthDetection: {
        value: 0,
        change: "0%",
        label: "成功率",
      },
      errorDetection: {
        value: 0,
        change: "0%",
        label: "平均处理时间",
      },
    };
  }

  const records = detectionRecords.value;

  // 计算总检测数
  const totalDetections = records.length;

  // 计算成功检测数（基于status_display）
  const successfulDetections = records.filter(record => 
    record.status_display === 'completed' || record.status_display === '成功'
  ).length;

  // 计算成功率
  const successRate = totalDetections > 0 ? Math.round((successfulDetections / totalDetections) * 1000) / 10 : 0;

  // 计算平均处理时间
  const validProcessingTimes = records.filter(record => record.processing_time > 0);
  const avgProcessingTime = validProcessingTimes.length > 0
    ? validProcessingTimes.reduce((sum, record) => sum + record.processing_time, 0) / validProcessingTimes.length
    : 0;

  return {
    todayDetection: {
      value: totalDetections,
      change: "+0%",
      label: "总检测数",
    },
    weekDetection: {
      value: successfulDetections,
      change: "+0%",
      label: "成功检测数",
    },
    monthDetection: {
      value: successRate,
      change: "+0%",
      label: "成功率(%)",
    },
    errorDetection: {
      value: Math.round(avgProcessingTime * 1000) / 1000,
      change: "+0%",
      label: "平均处理时间(s)",
    },
  };
});

// 检测记录数据
const detectionRecords = ref<DetectionRecord[]>([]);
const loading = ref(false);
const serverPath = import.meta.env.VITE_SERVER_PATH;

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 15, 20];

// 获取检测记录数据
const fetchDetectionRecords = async () => {
  try {
    loading.value = true;
    const response = await getDetectionRecordsAPI();
    console.log('API响应数据:', response);
    // 根据实际API响应结构处理数据
    if (response && response.results && response.results.data) {
      // 按ID从大到小排序（最新的在前面）
      detectionRecords.value = response.results.data.sort((a, b) => b.id - a.id);
    } else {
      detectionRecords.value = [];
    }
  } catch (error) {
    console.error('获取检测记录失败:', error);
    detectionRecords.value = [];
  } finally {
    loading.value = false;
  }
};

// 分页数据
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return detectionRecords.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(detectionRecords.value.length / pageSize.value);
});

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
};

// 拼接图片URL
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return '';
  return `${serverPath}${imagePath}`;
};

// 格式化检测类型
const formatDetectionType = (type: string) => {
  const typeMap: Record<string, string> = {
    'image': '图片检测',
    'video': '视频检测',
    'camera': '摄像头检测'
  };
  return typeMap[type] || type;
};

// 格式化处理时间
const formatProcessingTime = (time: number) => {
  return `${time.toFixed(2)}s`;
};

// 获取统计概览数据
const fetchStatisticsOverview = async () => {
  try {
    const response = await getSystemStatisticsOverviewAPI();
    if (response.data) {
      statisticsOverview.value = response.data;
    }
  } catch (error) {
    console.error('获取统计概览失败:', error);
  }
};

// 查看详情处理函数
const handleViewDetail = (row: DetectionRecord) => {
  // TODO: 实现查看详情功能
  ElMessage.info(`查看记录 ${row.id} 的详情功能待实现`);
  console.log('查看详情:', row);
};

// 页面加载时获取数据
onMounted(() => {
  fetchDetectionRecords();
  fetchStatisticsOverview();
});

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
</script>

<template>
  <div class="history">
    <!-- 检测历史页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">检测历史</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" @click="fetchDetectionRecords" :loading="loading">刷新数据</el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">
                  {{ historyData.todayDetection.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-blue-900">
                    {{ historyData.todayDetection.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    {{ historyData.todayDetection.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <el-icon size="32">
                  <Calendar />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">
                  {{ historyData.weekDetection.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-green-900">
                    {{ historyData.weekDetection.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-green-600 mt-1">
                    {{ historyData.weekDetection.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <el-icon size="32">
                  <Clock />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">
                  {{ historyData.monthDetection.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-yellow-900">
                    {{ historyData.monthDetection.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-yellow-600 mt-1">
                    {{ historyData.monthDetection.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <DataAnalysis />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">
                  {{ historyData.errorDetection.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-2xl font-bold text-red-900">
                    {{ historyData.errorDetection.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-red-600 mt-1">
                    {{ historyData.errorDetection.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-red-500">
                <el-icon size="32">
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 检测记录表格 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.5 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">检测记录详情</span>
            <span class="text-sm text-gray-500">共 {{ detectionRecords.length }} 条记录</span>
          </div>
        </template>

        <el-table :data="paginatedRecords" v-loading="loading" stripe style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }">
          <el-table-column prop="id" label="ID" width="80" sortable />



          <el-table-column label="检测结果" width="120">
            <template #default="{ row }">
              <el-image v-if="row.result_image" :src="getImageUrl(row.result_image)"
                :preview-src-list="[getImageUrl(row.result_image)]" fit="cover"
                style="width: 60px; height: 60px; border-radius: 4px;" :preview-teleported="true" />
              <span v-else class="text-gray-400">无结果</span>
            </template>
          </el-table-column>



          <el-table-column prop="processing_time" label="处理时间" width="100" sortable>
            <template #default="{ row }">
              {{ formatProcessingTime(row.processing_time) }}
            </template>
          </el-table-column>

          <el-table-column prop="status_display" label="检测状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status_display === 'completed' || row.status_display === '成功' ? 'success' : row.status_display === 'processing' ? 'warning' : row.status_display === 'failed' ? 'danger' : 'info'">
                {{ row.status_display }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleViewDetail(row)"
                :icon="View">
                查看详情
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="created_at" label="检测时间" width="180" sortable>
            <template #default="{ row }">
              {{ new Date(row.created_at).toLocaleString('zh-CN') }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="flex justify-between items-center mt-4">
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">每页显示</span>
            <el-select v-model="pageSize" @change="handleSizeChange" size="small" style="width: 80px">
              <el-option v-for="size in pageSizeOptions" :key="size" :label="size" :value="size" />
            </el-select>
            <span class="text-sm text-gray-500 ml-2">条</span>
          </div>

          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="detectionRecords.length"
            layout="prev, pager, next, jumper" @current-change="handleCurrentChange" small />
        </div>
      </el-card>
    </Motion>
  </div>
</template>

<style scoped>
.history {
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

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__header) {
  background-color: #f8fafc;
}

:deep(.el-table__row:hover) {
  background-color: #f1f5f9;
}

/* 图片预览样式 */
:deep(.el-image) {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.el-image:hover) {
  border-color: #3b82f6;
  transform: scale(1.05);
}
</style>