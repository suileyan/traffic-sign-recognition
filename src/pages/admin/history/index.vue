<script setup lang="ts">
import { Motion } from "motion-v";
import { ref, onMounted, computed } from 'vue';
import { getDetectionRecordsAPI, getStatisticsOverviewAPI, getDetectionRecordAPI, updateDetectionRecordAPI, deleteDetectionRecordAPI } from '@/api/hzsystem_traffic/hzsystem_traffic'
import type { DetectionRecord, StatisticsOverview, UpdateDetectionRecordRequest } from '@/types/apis/hzsystem_traffic_T';
import { ElMessage, ElMessageBox } from 'element-plus';

// 统计概览数据
const statisticsOverview = ref<StatisticsOverview>();

// 检测历史数据（计算属性）- 优先使用统计概览API数据
const historyData = computed(() => {
  // 优先使用统计概览API的数据
  if (statisticsOverview.value) {
    const overview = statisticsOverview.value;
    return {
      todayDetection: {
        value: overview.total_detections || 0,
        change: "+0%",
        label: "总检测数",
      },
      weekDetection: {
        value: overview.total_users || 0,
        change: "+0%",
        label: "总用户数",
      },
      monthDetection: {
        value: Math.round((overview.average_accuracy || 0) * 100 * 10) / 10,
        change: "+0%",
        label: "平均准确率(%)",
      },
      errorDetection: {
        value: Math.round((overview.system_availability || 0) * 10) / 10,
        change: "+0%",
        label: "系统可用性(%)",
      },
    };
  }

  // 如果没有统计概览数据，使用检测记录计算
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
        label: "总用户数",
      },
      monthDetection: {
        value: 0,
        change: "0%",
        label: "准确率(%)",
      },
      errorDetection: {
        value: 0,
        change: "0%",
        label: "高置信度检测数",
      },
    };
  }

  const records = detectionRecords.value;

  // 计算总检测数
  const totalDetections = records.length;

  // 计算总用户数（去重）
  const uniqueUsers = new Set(records.map(record => record.user));
  const totalUsers = uniqueUsers.size;

  // 计算准确率（基于置信度平均值）
  const avgConfidence = records.length > 0
    ? records.reduce((sum, record) => sum + record.confidence, 0) / records.length
    : 0;
  const accuracyRate = Math.round(avgConfidence * 1000) / 10; // 保留一位小数

  // 计算高置信度检测数（置信度>0.8）
  const highConfidenceDetections = records.filter(record => record.confidence > 0.8).length;

  return {
    todayDetection: {
      value: totalDetections,
      change: "+0%",
      label: "总检测数",
    },
    weekDetection: {
      value: totalUsers,
      change: "+0%",
      label: "总用户数",
    },
    monthDetection: {
      value: accuracyRate,
      change: "+0%",
      label: "准确率(%)",
    },
    errorDetection: {
      value: highConfidenceDetections,
      change: "+0%",
      label: "高置信度检测数",
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
    console.log('API Response Structure:', response);
    console.log('response.results:', response.results);
    console.log('response.results.data:', response.results?.data);

    // 处理API响应数据结构
    if (response.results && response.results.data) {
      // 按ID从小到大排序
      detectionRecords.value = response.results.data.sort((a, b) => a.id - b.id);
      console.log('Detection records loaded:', detectionRecords.value.length);
    } else {
      console.log('No data found in expected structure');
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

// 格式化处理时间
const formatProcessingTime = (time: number) => {
  return `${time.toFixed(2)}s`;
};

// 格式化状态 - 保留用于编辑对话框
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'processing': '处理中',
    'completed': '已完成',
    'failed': '失败'
  };
  return statusMap[status] || status;
};

// 编辑相关
const editDialogVisible = ref(false);
const editForm = ref<UpdateDetectionRecordRequest>({});
const editingRecord = ref<DetectionRecord | null>(null);
const editFormRef = ref();

// 编辑表单规则
const editRules = {
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  processing_time: [
    { required: true, message: '请输入处理时间', trigger: 'blur' },
    { type: 'number', min: 0, message: '处理时间必须大于0', trigger: 'blur' }
  ],
  confidence: [
    { required: true, message: '请输入置信度', trigger: 'blur' },
    { type: 'number', min: 0, max: 1, message: '置信度必须在0-1之间', trigger: 'blur' }
  ],
  user_feedback: [
    { max: 500, message: '用户反馈不能超过500个字符', trigger: 'blur' }
  ],
  detected_category: [
    { required: true, message: '请输入检测类别ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '检测类别ID必须大于0', trigger: 'blur' }
  ],
  original_file: [
    { required: true, message: '请输入原始文件路径', trigger: 'blur' }
  ],
  file_size_mb: [
    { type: 'number', min: 0, message: '文件大小必须大于等于0', trigger: 'blur' }
  ]
};

// 打开编辑对话框
const openEditDialog = async (record: DetectionRecord) => {
  console.log('openEditDialog called with record:', record);
  console.log('editDialogVisible before:', editDialogVisible.value);

  try {
    // 调用详情接口获取完整数据
    const response = await getDetectionRecordAPI(record.id);
    console.log('详情API响应:', response);

    const detailData = response.data || response.results?.data || response;
    editingRecord.value = detailData;

    // 计算平均置信度
    let avgConfidence = 0;
    if (detailData.detection_data && detailData.detection_data.frame_detections) {
      const allDetections = detailData.detection_data.frame_detections.flatMap(frame => frame.detections);
      if (allDetections.length > 0) {
        const totalConfidence = allDetections.reduce((sum, detection) => sum + detection.confidence, 0);
        avgConfidence = totalConfidence / allDetections.length;
      }
    }

    // 设置编辑表单数据，包含更多字段
    editForm.value = {
      status: detailData.status,
      processing_time: detailData.processing_time,
      confidence: avgConfidence,
      detected_category: detailData.detected_category,
      original_file: detailData.original_file,
      result_image: detailData.result_image,
      file_size_mb: detailData.file_size_mb,
      user_feedback: detailData.user_feedback || ''
    };

    editDialogVisible.value = true;
    console.log('editDialogVisible after:', editDialogVisible.value);
    console.log('editForm:', editForm.value);
  } catch (error) {
    console.error('获取记录详情失败:', error);
    ElMessage.error('获取记录详情失败');
  }
};

// 关闭编辑对话框
const closeEditDialog = () => {
  editDialogVisible.value = false;
  editingRecord.value = null;
  editForm.value = {};
  editFormRef.value?.resetFields();
};

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value || !editingRecord.value) return;

  try {
    await editFormRef.value.validate();
    
    // 只提交允许更新的字段
    const updateData = {
      status: editForm.value.status,
      confidence: editForm.value.confidence,
      processing_time: editForm.value.processing_time,
      user_feedback: editForm.value.user_feedback
    };
    
    await updateDetectionRecordAPI(editingRecord.value.id, updateData);
    ElMessage.success('更新记录成功');
    closeEditDialog();
    await fetchDetectionRecords(); // 刷新数据
  } catch (error) {
    console.error('更新记录失败:', error);
    ElMessage.error('更新记录失败');
  }
};

// 删除记录
const deleteRecord = async (record: DetectionRecord) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除ID为 ${record.id} 的检测记录吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await deleteDetectionRecordAPI(record.id);
    ElMessage.success('删除记录成功');
    await fetchDetectionRecords(); // 刷新数据
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除记录失败:', error);
      ElMessage.error('删除记录失败');
    }
  }
};

// 获取统计概览数据
const fetchStatisticsOverview = async () => {
  try {
    const response = await getStatisticsOverviewAPI();
    // 处理API响应数据结构
    if (response.data) {
      statisticsOverview.value = response.data;
    }
  } catch (error) {
    console.error('获取统计概览失败:', error);
  }
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

          <el-table-column prop="user_name" label="用户" width="120" />

          <el-table-column prop="detection_type_display" label="检测类型" width="120">
            <template #default="{ row }">
              <el-tag
                :type="row.detection_type_display === '图片检测' ? 'primary' : row.detection_type_display === '视频检测' ? 'success' : 'warning'">
                {{ row.detection_type_display }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="status_display" label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                :type="row.status_display === '成功' ? 'success' : row.status_display === '处理中' ? 'warning' : row.status_display === '失败' ? 'danger' : 'info'">
                {{ row.status_display }}
              </el-tag>
            </template>
          </el-table-column>



          <el-table-column prop="processing_time" label="处理时间" width="100" sortable>
            <template #default="{ row }">
              {{ formatProcessingTime(row.processing_time) }}
            </template>
          </el-table-column>



          <el-table-column prop="created_at" label="检测时间" width="180" sortable>
            <template #default="{ row }">
              {{ new Date(row.created_at).toLocaleString('zh-CN') }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="openEditDialog(row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteRecord(row)">
                删除
              </el-button>
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

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" title="检测记录详情" width="600px" :before-close="closeEditDialog">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="用户名">
          <el-input :value="editingRecord?.user_name" readonly />
        </el-form-item>

        <el-form-item label="检测类型">
          <el-input :value="editingRecord?.detection_type_display" readonly />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>

        <!-- 检测信息 -->
        <el-divider content-position="left">检测信息</el-divider>

        <el-form-item label="置信度" prop="confidence">
          <el-input-number v-model="editForm.confidence" :min="0" :max="1" :step="0.01" :precision="2"
            placeholder="请输入置信度" style="width: 100%" />
        </el-form-item>

        <el-form-item label="检测类别ID" prop="detected_category">
          <el-input-number v-model="editForm.detected_category" :min="1" placeholder="请输入检测类别ID" style="width: 100%" />
        </el-form-item>

        <el-form-item label="处理时间(秒)" prop="processing_time">
          <el-input-number v-model="editForm.processing_time" :min="0" :step="0.01" :precision="2" placeholder="请输入处理时间"
            style="width: 100%" />
        </el-form-item>

        <!-- 文件信息 -->
        <el-divider content-position="left">文件信息</el-divider>

        <el-form-item label="原始文件" prop="original_file">
          <el-input v-model="editForm.original_file" placeholder="请输入原始文件路径" />
        </el-form-item>

        <el-form-item label="结果图片" prop="result_image">
          <el-input v-model="editForm.result_image" placeholder="请输入结果图片路径" />
        </el-form-item>

        <el-form-item label="文件大小(MB)" prop="file_size_mb">
          <el-input-number v-model="editForm.file_size_mb" :min="0" :step="0.1" :precision="1" placeholder="请输入文件大小"
            style="width: 100%" />
        </el-form-item>

        <el-form-item label="文件大小(字节)">
          <el-input :value="editingRecord?.file_size" readonly />
        </el-form-item>

        <el-form-item label="用户反馈" prop="user_feedback">
          <el-input v-model="editForm.user_feedback" type="textarea" :rows="3" placeholder="请输入用户反馈" />
        </el-form-item>

        <!-- 时间信息 -->
        <el-divider content-position="left">时间信息</el-divider>

        <el-form-item label="创建时间">
          <el-input :value="editingRecord?.created_at" readonly />
        </el-form-item>

        <el-form-item label="更新时间">
          <el-input :value="editingRecord?.updated_at" readonly />
        </el-form-item>

        <!-- 检测结果 -->
        <el-divider content-position="left">检测结果</el-divider>

        <el-form-item label="检测结果" v-if="editingRecord?.detection_results?.length">
          <el-table :data="editingRecord.detection_results" size="small" max-height="200">
            <el-table-column prop="traffic_sign_name" label="标志名称" width="120" />
            <el-table-column prop="traffic_sign_code" label="标志代码" width="100" />
            <el-table-column prop="confidence_percent" label="置信度" width="80" />
            <el-table-column prop="is_correct" label="是否正确" width="80">
              <template #default="{ row }">
                <el-tag :type="row.is_correct ? 'success' : 'danger'" size="small">
                  {{ row.is_correct ? '正确' : '错误' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item v-else>
          <el-text type="info">暂无检测结果</el-text>
        </el-form-item>

        <!-- 检测数据详情 -->
        <el-divider content-position="left">检测数据详情</el-divider>

        <el-form-item label="检测成功状态">
          <el-tag :type="editingRecord?.detection_data?.success ? 'success' : 'danger'" size="small">
            {{ editingRecord?.detection_data?.success ? '成功' : '失败' }}
          </el-tag>
        </el-form-item>

        <el-form-item label="帧检测数据" v-if="editingRecord?.detection_data?.frame_detections?.length">
          <el-collapse>
            <el-collapse-item 
              v-for="(frame, index) in editingRecord.detection_data.frame_detections.slice(0, 5)" 
              :key="index"
              :title="`帧 ${frame.frame_index} (时间戳: ${frame.timestamp.toFixed(3)}s)`"
            >
              <el-table :data="frame.detections" size="small" max-height="200">
                <el-table-column prop="sign_name" label="标志名称" width="100" />
                <el-table-column prop="category" label="类别" width="100" />
                <el-table-column label="置信度" width="80">
                  <template #default="{ row }">
                    {{ (row.confidence * 100).toFixed(1) }}%
                  </template>
                </el-table-column>
                <el-table-column prop="class_id" label="类别ID" width="80" />
                <el-table-column label="边界框" min-width="120">
                  <template #default="{ row }">
                    [{{ row.bbox.join(', ') }}]
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-text type="info" size="small" v-if="editingRecord?.detection_data?.frame_detections?.length > 5">
            仅显示前5帧数据，共{{ editingRecord.detection_data.frame_detections.length }}帧
          </el-text>
        </el-form-item>

        <el-form-item v-else-if="editingRecord?.detection_data">
          <el-text type="info">暂无帧检测数据</el-text>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditDialog">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
