<script setup lang="ts">
import { Motion } from "motion-v";
import { ref, onMounted ,computed} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, Refresh, DataAnalysis, Picture, VideoCamera, Timer } from '@element-plus/icons-vue';
import {
  getYoloModelInfo,
  getYoloModels,
  getYoloDetectionTasks,
  getYoloDetectionStatistics,
  createYoloModel,
  updateYoloModel,
  deleteYoloModel
} from '@/api/admin/hzsystem_rubbish';
import type {
  YoloModelInfo,
  YoloModel,
  YoloDetectionTask,
  YoloDetectionStatistics,
  CreateYoloModelRequest
} from '@/types/apis/hzsystem_rubbish_T';

// 响应式数据
const loading = ref(false);
const modelInfo = ref<YoloModelInfo>();
const models = ref<YoloModel[]>([]);
const tasks = ref<YoloDetectionTask[]>([]);
const statistics = ref<YoloDetectionStatistics>();

// 分页相关 - 检测任务
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 分页相关 - 模型列表
const modelCurrentPage = ref(1);
const modelPageSize = ref(5);
const modelTotal = ref(0);

// 对话框状态
const createDialogVisible = ref(false);
const editDialogVisible = ref(false);
const currentEditModel = ref<YoloModel | null>(null);

// 表单引用
const createFormRef = ref();
const editFormRef = ref();

// 表单数据
const modelForm = ref<CreateYoloModelRequest>({
  name: '',
  model_path: '',
  confidence_threshold: 0.5,
  iou_threshold: 0.45,
  max_detections: 1000,
  input_size: 640,
  is_active: true
});

// 表单验证规则
const modelFormRules = {
  name: [
    { required: true, message: '请输入模型名称', trigger: 'blur' }
  ],
  model_path: [
    { required: true, message: '请输入模型路径', trigger: 'blur' }
  ],
  confidence_threshold: [
    { required: true, message: '请输入置信度阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1, message: '置信度阈值必须在0-1之间', trigger: 'blur' }
  ],
  iou_threshold: [
    { required: true, message: '请输入IOU阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1, message: 'IOU阈值必须在0-1之间', trigger: 'blur' }
  ],
  max_detections: [
    { required: true, message: '请输入最大检测数', trigger: 'blur' },
    { type: 'number', min: 1, message: '最大检测数必须大于0', trigger: 'blur' }
  ],
  input_size: [
    { required: true, message: '请输入输入尺寸', trigger: 'blur' },
    { type: 'number', min: 1, message: '输入尺寸必须大于0', trigger: 'blur' }
  ]
};

// 计算属性：当前页显示的任务
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tasks.value.slice(start, end);
});

// 计算属性：当前页显示的模型
const paginatedModels = computed(() => {
  const start = (modelCurrentPage.value - 1) * modelPageSize.value;
  const end = start + modelPageSize.value;
  return models.value.slice(start, end);
});

// 获取模型信息
const fetchModelInfo = async () => {
  try {
    modelInfo.value = await getYoloModelInfo();
  } catch (error) {
    console.error('获取模型信息失败:', error);
  }
};

// 获取模型列表
const fetchModels = async () => {
  try {
    const response = await getYoloModels();
    models.value = response;
    modelTotal.value = response.length;
  } catch (error) {
    console.error('获取模型列表失败:', error);
  }
};

// 获取检测任务
const fetchTasks = async () => {
  try {
    const response = await getYoloDetectionTasks();
    tasks.value = response;
    total.value = response.length;
  } catch (error) {
    ElMessage.error('获取检测任务失败');
  }
};

// 分页处理函数 - 检测任务
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

// 分页处理函数 - 模型列表
const handleModelPageChange = (page: number) => {
  modelCurrentPage.value = page;
};

const handleModelSizeChange = (size: number) => {
  modelPageSize.value = size;
  modelCurrentPage.value = 1;
};

// 获取统计信息
const fetchStatistics = async () => {
  try {
    statistics.value = await getYoloDetectionStatistics();
  } catch (error) {
    console.error('获取统计信息失败:', error);
  }
};

// 刷新所有数据
const refreshData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchModelInfo(),
      fetchModels(),
      fetchTasks(),
      fetchStatistics()
    ]);
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  modelForm.value = {
    name: '',
    model_path: '',
    confidence_threshold: 0.5,
    iou_threshold: 0.45,
    max_detections: 1000,
    input_size: 640,
    is_active: true
  };
};

// 打开创建对话框
const openCreateDialog = () => {
  resetForm();
  createDialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (model: YoloModel) => {
  currentEditModel.value = model;
  modelForm.value = {
    name: model.name,
    model_path: model.model_path,
    confidence_threshold: model.confidence_threshold,
    iou_threshold: model.iou_threshold,
    max_detections: model.max_detections,
    input_size: model.input_size,
    is_active: model.is_active
  };
  editDialogVisible.value = true;
};

// 创建模型
const handleCreateModel = async () => {
  if (!createFormRef.value) return;
  
  try {
    await createFormRef.value.validate();
    await createYoloModel(modelForm.value);
    ElMessage.success('模型创建成功');
    createDialogVisible.value = false;
    await fetchModels();
  } catch (error) {
    if (error !== false) {
      ElMessage.error('模型创建失败');
      console.error('创建模型失败:', error);
    }
  }
};

// 更新模型
const handleUpdateModel = async () => {
  if (!currentEditModel.value || !editFormRef.value) return;
  
  try {
    await editFormRef.value.validate();
    await updateYoloModel(currentEditModel.value.id, modelForm.value);
    ElMessage.success('模型更新成功');
    editDialogVisible.value = false;
    await fetchModels();
  } catch (error) {
    if (error !== false) {
      ElMessage.error('模型更新失败');
      console.error('更新模型失败:', error);
    }
  }
};

// 删除模型
const handleDeleteModel = async (model: YoloModel) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除模型 "${model.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    await deleteYoloModel(model.id);
    ElMessage.success('模型删除成功');
    await fetchModels();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('模型删除失败');
      console.error('删除模型失败:', error);
    }
  }
};

// 关闭对话框
const closeCreateDialog = () => {
  createDialogVisible.value = false;
  resetForm();
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
  currentEditModel.value = null;
  resetForm();
};







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

// 页面加载时获取数据
onMounted(() => {
  refreshData();
});
</script>

<template>
  <div class="model-parameter">
    <!-- 模型参数管理页面 -->
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">模型参数管理</span>
            <Motion
              :initial="{ scale: 0.8, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }"
              :transition="{ duration: 0.3, delay: 0.5 }"
            >
              <div class="flex gap-2">
                 <el-button type="primary" size="small" @click="openCreateDialog">
                   <el-icon><Plus /></el-icon>
                   创建模型
                 </el-button>
                 <el-button type="default" size="small" @click="refreshData" :loading="loading">
                   <el-icon><Refresh /></el-icon>
                   刷新数据
                 </el-button>
               </div>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" v-if="statistics">
          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总检测次数</p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }"
                >
                  <p class="text-2xl font-bold text-blue-900">
                    {{ statistics.total_detections.toLocaleString() }}
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
                  <DataAnalysis />
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
                <p class="text-green-600 text-sm font-medium">图片检测</p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }"
                >
                  <p class="text-2xl font-bold text-green-900">
                    {{ statistics.detection_types.image.toLocaleString() }}
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
                  <Picture />
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
                <p class="text-yellow-600 text-sm font-medium">视频检测</p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }"
                >
                  <p class="text-2xl font-bold text-yellow-900">
                    {{ statistics.detection_types.video.toLocaleString() }}
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
                  <VideoCamera />
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
                <p class="text-purple-600 text-sm font-medium">平均处理时间</p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }"
                >
                  <p class="text-2xl font-bold text-purple-900">
                    {{ statistics.avg_processing_time.toFixed(2) }}s
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
                  <Timer />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 当前模型信息 -->
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.8 } as any"
    >
      <el-card class="mb-6" v-if="modelInfo">
        <template #header>
          <span class="font-medium">当前模型信息</span>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">模型名称</p>
            <p class="font-medium">{{ modelInfo?.model_name || '未知' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">模型大小</p>
            <p class="font-medium">{{ modelInfo?.model_size || '未知' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">输入尺寸</p>
            <p class="font-medium">{{ modelInfo?.input_size?.join(' × ') || '未知' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">类别数量</p>
            <p class="font-medium">{{ modelInfo?.num_classes || 0 }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">置信度阈值</p>
            <p class="font-medium">{{ modelInfo?.confidence_threshold || 0 }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">设备</p>
            <p class="font-medium">{{ modelInfo?.device || '未知' }}</p>
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 模型列表和检测任务 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 模型列表 -->
      <Motion
        :initial="cardVariants.initial"
        :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 0.9 } as any"
      >
        <el-card>
          <template #header>
            <span class="font-medium">模型列表</span>
          </template>
          <el-table :data="paginatedModels" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" min-width="60" />
            <el-table-column prop="name" label="模型名称" min-width="150" />
            <el-table-column prop="model_path" label="模型路径" min-width="200" show-overflow-tooltip />
            <el-table-column prop="confidence_threshold" label="置信度" min-width="100">
              <template #default="{ row }">
                {{ row.confidence_threshold }}
              </template>
            </el-table-column>
            <el-table-column prop="iou_threshold" label="IOU阈值" min-width="100">
              <template #default="{ row }">
                {{ row.iou_threshold }}
              </template>
            </el-table-column>
            <el-table-column prop="is_active" label="状态" min-width="100">
              <template #default="{ row }">
                <el-tag :type="row.is_active ? 'success' : 'danger'">
                  {{ row.is_active ? '激活' : '未激活' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" min-width="180">
              <template #default="{ row }">
                {{ new Date(row.created_at).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" fixed="right">
              <template #default="{ row }">
                <div class="flex gap-2">
                  <el-button type="primary" size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="handleDeleteModel(row)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页组件 -->
          <div class="flex justify-center mt-4">
            <el-pagination
              v-model:current-page="modelCurrentPage"
              v-model:page-size="modelPageSize"
              :page-sizes="[5, 10, 15, 20]"
              :total="modelTotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleModelSizeChange"
              @current-change="handleModelPageChange"
            />
          </div>
        </el-card>
      </Motion>

      <!-- 检测任务 -->
      <Motion
        :initial="cardVariants.initial"
        :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any"
        :transition="{ ...cardVariants.transition, delay: 1.0 } as any"
      >
        <el-card>
          <template #header>
            <span class="font-medium">检测任务</span>
          </template>
          <el-table :data="paginatedTasks" style="width: 100%" v-loading="loading">
            <el-table-column prop="task_id" label="任务ID" min-width="120" />
            <el-table-column prop="task_type" label="类型" min-width="100" />
            <el-table-column prop="status" label="状态" min-width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
                  {{ row.status === 'completed' ? '完成' : '处理中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="processing_time" label="处理时间" min-width="120">
              <template #default="{ row }">
                {{ row.processing_time?.toFixed(2) }}s
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" min-width="180">
              <template #default="{ row }">
                {{ new Date(row.created_at).toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页组件 -->
          <div class="flex justify-center mt-4">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[5, 10, 20, 50]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </Motion>
    </div>

    <!-- 创建模型对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建模型"
      width="600px"
      @close="closeCreateDialog"
    >
      <el-form
        ref="createFormRef"
        :model="modelForm"
        :rules="modelFormRules"
        label-width="120px"
      >
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="模型路径" prop="model_path">
          <el-input v-model="modelForm.model_path" placeholder="请输入模型文件路径" />
        </el-form-item>
        <el-form-item label="置信度阈值" prop="confidence_threshold">
          <el-input-number
            v-model="modelForm.confidence_threshold"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="IOU阈值" prop="iou_threshold">
          <el-input-number
            v-model="modelForm.iou_threshold"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="最大检测数" prop="max_detections">
          <el-input-number
            v-model="modelForm.max_detections"
            :min="1"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="输入尺寸" prop="input_size">
          <el-input-number
            v-model="modelForm.input_size"
            :min="1"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="modelForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeCreateDialog">取消</el-button>
          <el-button type="primary" @click="handleCreateModel">创建</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑模型对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑模型"
      width="600px"
      @close="closeEditDialog"
    >
      <el-form
        ref="editFormRef"
        :model="modelForm"
        :rules="modelFormRules"
        label-width="120px"
      >
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="模型路径" prop="model_path">
          <el-input v-model="modelForm.model_path" placeholder="请输入模型文件路径" />
        </el-form-item>
        <el-form-item label="置信度阈值" prop="confidence_threshold">
          <el-input-number
            v-model="modelForm.confidence_threshold"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="IOU阈值" prop="iou_threshold">
          <el-input-number
            v-model="modelForm.iou_threshold"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="最大检测数" prop="max_detections">
          <el-input-number
            v-model="modelForm.max_detections"
            :min="1"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="输入尺寸" prop="input_size">
          <el-input-number
            v-model="modelForm.input_size"
            :min="1"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="modelForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeEditDialog">取消</el-button>
          <el-button type="primary" @click="handleUpdateModel">更新</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped>
.model-parameter {
  padding: 20px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

/* 颜色类 */
.bg-blue-50 { background-color: #eff6ff; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-yellow-50 { background-color: #fefce8; }
.bg-purple-50 { background-color: #faf5ff; }
.bg-gray-50 { background-color: #f9fafb; }

.text-blue-600 { color: #2563eb; }
.text-blue-900 { color: #1e3a8a; }
.text-blue-500 { color: #3b82f6; }

.text-green-600 { color: #16a34a; }
.text-green-900 { color: #14532d; }
.text-green-500 { color: #22c55e; }

.text-yellow-600 { color: #ca8a04; }
.text-yellow-900 { color: #713f12; }
.text-yellow-500 { color: #eab308; }

.text-purple-600 { color: #9333ea; }
.text-purple-900 { color: #581c87; }
.text-purple-500 { color: #a855f7; }

.text-gray-600 { color: #4b5563; }
</style>
