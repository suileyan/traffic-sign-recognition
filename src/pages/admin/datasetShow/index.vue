<script setup lang="ts">
import { Motion } from "motion-v";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";
import { getDatasetAPI } from '@/api/hzsystem_traffic/hzsystem_traffic';
import type { DatasetResponse } from '@/types/apis/hzsystem_traffic_T';
import { ref, onMounted, computed } from 'vue';
import { DataAnalysis, PieChart as PieChartIcon, TrendCharts as BarChartIcon, Picture } from '@element-plus/icons-vue';

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// 数据集数据
const datasetData = ref<DatasetResponse>();
const loading = ref(false);

// 获取环境变量中的服务器路径
const serverPath = import.meta.env.VITE_SERVER_PATH || 'http://localhost:8000';

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);

// 图片预览对话框
const imageDialogVisible = ref(false);
const selectedCategoryImages = ref<string[]>([]);
const selectedCategoryName = ref('');

// 图片URL处理函数
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // 如果已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // 拼接服务器路径
  return `${serverPath}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// 获取数据集数据
const fetchDatasetData = async () => {
  loading.value = true;
  try {
    const response = await getDatasetAPI();
    datasetData.value = response;
  } catch (error) {
    console.error('获取数据集数据失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDatasetData();
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

// 计算属性
const overviewStats = computed(() => {
  if (!datasetData.value?.data) {
    return {
      totalFolders: { value: 0, label: '总文件夹数' },
      totalImages: { value: 0, label: '总图片数' },
      avgImagesPerFolder: { value: 0, label: '平均每文件夹图片数' },
      imageFormat: { value: '-', label: '图片格式' },
      datasetSize: { value: '0 MB', label: '数据集大小' }
    };
  }

  const { overview } = datasetData.value.data;
  return {
    totalFolders: {
      value: overview.total_folders,
      label: '总文件夹数'
    },
    totalImages: {
      value: overview.total_images,
      label: '总图片数'
    },
    avgImagesPerFolder: {
      value: overview.avg_images_per_folder,
      label: '平均每文件夹图片数'
    },
    imageFormat: {
      value: overview.image_format,
      label: '图片格式'
    },
    datasetSize: {
      value: `${overview.dataset_size.toFixed(1)} MB`,
      label: '数据集大小'
    }
  };
});

// 分页相关计算属性
const paginatedFolders = computed(() => {
  if (!datasetData.value?.data?.folder_stats) return [];
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return datasetData.value.data.folder_stats.slice(start, end);
});

const totalFolders = computed(() => {
  return datasetData.value?.data?.folder_stats?.length || 0;
});

// 分页处理函数
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

// 显示更多图片
const showMoreImages = (categoryName: string, images: string[]) => {
  selectedCategoryName.value = categoryName;
  selectedCategoryImages.value = images.map(img => getImageUrl(img));
  imageDialogVisible.value = true;
};

// 查看文件夹详情
const viewFolderDetails = (folder: any) => {
  console.log('查看文件夹详情:', folder);
  // 这里可以添加查看详情的逻辑，比如跳转到详情页面或打开弹窗
};

// 文件夹分布图表数据
const folderDistributionData = computed((): EChartsOption => {
  if (!datasetData.value?.data?.folder_stats?.length) {
    return {
      title: { text: '文件夹分布', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  const folders = datasetData.value.data.folder_stats.slice(0, 10); // 显示前10个文件夹
  return {
    title: {
      text: '文件夹分布 (前10)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      name: '图片数量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      data: folders.map(folder => ({
        value: folder.image_count,
        name: folder.folder_name
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      }
    }]
  };
});

// 文件夹图片数量对比图表
const folderComparisonData = computed((): EChartsOption => {
  if (!datasetData.value?.data?.folder_stats?.length) {
    return {
      title: { text: '文件夹图片数量对比', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: [] },
      yAxis: { type: 'value' },
      series: []
    };
  }

  const folders = datasetData.value.data.folder_stats.slice(0, 8); // 显示前8个文件夹
  return {
    title: {
      text: '文件夹图片数量对比 (前8)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: folders.map(folder => folder.folder_name),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '图片数量'
    },
    series: [
      {
        name: '图片数量',
        type: 'bar',
        data: folders.map(folder => folder.image_count),
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
  };
});
</script>

<template>
  <div class="dataset-show p-6">
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">数据集概览</span>
            <Motion
              :initial="{ scale: 0.8, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }"
              :transition="{ duration: 0.3, delay: 0.3 }"
            >
              <el-button 
                type="primary" 
                size="small" 
                :loading="loading"
                @click="fetchDatasetData"
              >
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <!-- 总类别数 -->
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">
                  {{ overviewStats.totalFolders.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }"
                >
                  <p class="text-2xl font-bold text-blue-900">
                    {{ overviewStats.totalFolders.value.toLocaleString() }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.3 } as any"
                class="text-blue-500"
              >
                <el-icon size="32">
                  <DataAnalysis />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <!-- 总图片数 -->
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">
                  {{ overviewStats.totalImages.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }"
                >
                  <p class="text-2xl font-bold text-green-900">
                    {{ overviewStats.totalImages.value.toLocaleString() }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.4 } as any"
                class="text-green-500"
              >
                <el-icon size="32">
                  <Picture />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <!-- 训练图片 -->
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">
                  {{ overviewStats.avgImagesPerFolder.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }"
                >
                  <p class="text-2xl font-bold text-purple-900">
                    {{ overviewStats.avgImagesPerFolder.value.toLocaleString() }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any"
                class="text-purple-500"
              >
                <el-icon size="32">
                  <BarChartIcon />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <!-- 验证图片 -->
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-orange-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-600 text-sm font-medium">
                  {{ overviewStats.imageFormat.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }"
                >
                  <p class="text-2xl font-bold text-orange-900">
                    {{ overviewStats.imageFormat.value }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any"
                class="text-orange-500"
              >
                <el-icon size="32">
                  <PieChartIcon />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <!-- 数据集大小 -->
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">
                  {{ overviewStats.datasetSize.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }"
                >
                  <p class="text-2xl font-bold text-red-900">
                    {{ overviewStats.datasetSize.value }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any"
                class="text-red-500"
              >
                <el-icon size="32">
                  <DataAnalysis />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 文件夹分布饼图 -->
      <Motion
        :initial="cardVariants.initial"
        :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.7 } as any"
      >
        <el-card>
          <template #header>
            <span class="font-medium">文件夹分布</span>
          </template>
          <div class="h-80">
            <Motion
              class="h-full"
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, delay: 0.9 }"
            >
              <v-chart :option="folderDistributionData" class="w-full h-full" autoresize />
            </Motion>
          </div>
        </el-card>
      </Motion>

      <!-- 文件夹图片数量对比 -->
      <Motion
        :initial="cardVariants.initial"
        :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.8 } as any"
      >
        <el-card>
          <template #header>
            <span class="font-medium">文件夹图片数量对比</span>
          </template>
          <div class="h-80">
            <Motion
              class="h-full"
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, delay: 1.0 }"
            >
              <v-chart :option="folderComparisonData" class="w-full h-full" autoresize />
            </Motion>
          </div>
        </el-card>
      </Motion>
    </div>

    <!-- 文件夹详情列表 -->
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.9 } as any"
    >
      <el-card>
        <template #header>
          <span class="font-medium">文件夹详情</span>
        </template>
        
        <el-table 
          :data="paginatedFolders"
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="folder_name" label="文件夹名称" min-width="200" />
          <el-table-column prop="image_count" label="图片数量" width="120" align="center" />
          <el-table-column label="样本图片" min-width="200">
            <template #default="{ row }">
              <div class="flex gap-2">
                <el-image
                  v-for="(image, index) in row.sample_images.slice(0, 3)"
                  :key="index"
                  :src="getImageUrl(image)"
                  class="w-12 h-12 rounded"
                  fit="cover"
                  :preview-src-list="row.sample_images.map((img: string) => getImageUrl(img))"
                  :initial-index="index"
                />
                <span 
                  v-if="row.sample_images.length > 3" 
                  class="text-blue-500 text-sm self-center cursor-pointer hover:text-blue-700 hover:underline"
                  @click="showMoreImages(row.folder_name, row.sample_images)"
                >
                  +{{ row.sample_images.length - 3 }} 更多
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页组件 -->
        <div class="flex justify-center mt-4">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="totalFolders"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
       </el-card>
     </Motion>

     <!-- 图片预览对话框 -->
     <el-dialog
       v-model="imageDialogVisible"
       :title="`${selectedCategoryName} - 所有样本图片`"
       width="80%"
       top="5vh"
     >
       <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
         <el-image
           v-for="(image, index) in selectedCategoryImages"
           :key="index"
           :src="image"
           class="w-full h-32 rounded-lg"
           fit="cover"
           :preview-src-list="selectedCategoryImages"
           :initial-index="index"
           loading="lazy"
         >
           <template #error>
             <div class="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg">
               <el-icon class="text-gray-400" size="24">
                 <Picture />
               </el-icon>
             </div>
           </template>
         </el-image>
       </div>
       <template #footer>
         <div class="text-center">
           <el-button @click="imageDialogVisible = false">关闭</el-button>
         </div>
       </template>
     </el-dialog>
   </div>
 </template>

<style scoped>
.dataset-show {
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
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
