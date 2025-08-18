<script setup lang="ts">
import { Motion } from "motion-v";
import { ref, onMounted, computed } from 'vue';
import { getTrafficCategoriesAPI, createTrafficCategoryAPI, updateTrafficCategoryAPI, deleteTrafficCategoryAPI } from '@/api/hzsystem_traffic/hzsystem_traffic';
import type { TrafficCategory, CreateTrafficCategoryRequest, UpdateTrafficCategoryRequest } from '@/types/apis/hzsystem_traffic_T';
import { ElMessage, ElMessageBox } from 'element-plus';

// 交通标志分类数据
const categories = ref<TrafficCategory[]>([]);
const loading = ref(false);

// 统计数据（计算属性）- 基于分类数据
const classificationData = computed(() => {
  if (!categories.value.length) {
    return {
      totalCategories: {
        value: 0,
        change: "+0%",
        label: "总分类数",
      },
      warningCount: {
        value: 0,
        change: "+0%",
        label: "警告标志",
      },
      prohibitionCount: {
        value: 0,
        change: "+0%",
        label: "禁令标志",
      },
      indicationCount: {
        value: 0,
        change: "+0%",
        label: "指示标志",
      },
    };
  }

  const cats = categories.value;

  // 计算总分类数
  const totalCategories = cats.length;

  // 计算各类型数量
  const warningCount = cats.filter(cat => cat.category_type === 'warning').length;
  const prohibitionCount = cats.filter(cat => cat.category_type === 'prohibition').length;
  const indicationCount = cats.filter(cat => cat.category_type === 'indication').length;

  return {
    totalCategories: {
      value: totalCategories,
      change: "+0%",
      label: "总分类数",
    },
    warningCount: {
      value: warningCount,
      change: "+0%",
      label: "警告标志",
    },
    prohibitionCount: {
      value: prohibitionCount,
      change: "+0%",
      label: "禁令标志",
    },
    indicationCount: {
      value: indicationCount,
      change: "+0%",
      label: "指示标志",
    },
  };
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 15, 20];

// 新增/编辑分类对话框
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const formData = ref<CreateTrafficCategoryRequest>({
  name: '',
  category_type: 'warning',
  description: '',
  usage_scenario: '',
  icon: '',
  color: ''
});

// 获取交通标志分类数据
const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await getTrafficCategoriesAPI();
    // 检查响应格式并提取数据
    const data = response.data;
    // 按ID从小到大排序
    categories.value = Array.isArray(data) ? data.sort((a, b) => a.id - b.id) : [];
  } catch (error) {
    console.error('获取交通标志分类失败:', error);
    ElMessage.error('获取交通标志分类失败');
  } finally {
    loading.value = false;
  }
};

// 分页数据
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return categories.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(categories.value.length / pageSize.value);
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

// 格式化分类类型
const formatCategoryType = (type: string) => {
  const typeMap: Record<string, string> = {
    'warning': '警告标志',
    'prohibition': '禁令标志',
    'indication': '指示标志',
    'guide': '指路标志',
    'tourist': '旅游区标志',
    'construction': '道路施工安全标志'
  };
  return typeMap[type] || type;
};

// 获取类型标签颜色
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    'warning': 'warning',
    'prohibition': 'danger',
    'indication': 'success',
    'guide': 'info',
    'tourist': 'primary',
    'construction': 'warning'
  };
  return typeMap[type] || 'info';
};

// 打开新增对话框
const openAddDialog = () => {
  isEditing.value = false;
  editingId.value = null;
  formData.value = {
    name: '',
    category_type: 'warning',
    description: '',
    usage_scenario: '',
    icon: '',
    color: ''
  };
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (category: TrafficCategory) => {
  isEditing.value = true;
  editingId.value = category.id;
  formData.value = {
    name: category.name,
    category_type: category.category_type,
    description: category.description,
    usage_scenario: category.usage_scenario || '',
    icon: category.icon || '',
    color: category.color || ''
  };
  dialogVisible.value = true;
};



// 提交表单（新增或编辑）
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入分类名称');
    return;
  }




  try {
    loading.value = true;
    if (isEditing.value && editingId.value) {
      await updateTrafficCategoryAPI(editingId.value, formData.value as UpdateTrafficCategoryRequest);
      ElMessage.success('更新分类成功');
    } else {
      await createTrafficCategoryAPI(formData.value);
      ElMessage.success('创建分类成功');
    }
    dialogVisible.value = false;
    await fetchCategories(); // 刷新列表
  } catch (error) {
    console.error(isEditing.value ? '更新分类失败:' : '创建分类失败:', error);
    ElMessage.error(isEditing.value ? '更新分类失败' : '创建分类失败');
  } finally {
    loading.value = false;
  }
};

// 删除分类
const deleteCategory = async (category: TrafficCategory) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    loading.value = true;
    await deleteTrafficCategoryAPI(category.id);
    ElMessage.success('删除分类成功');
    await fetchCategories(); // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error);
      ElMessage.error('删除分类失败');
    }
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchCategories();
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
  <div class="classification">
    <!-- 垃圾分类管理页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">垃圾分类管理</span>
            <div class="flex gap-2">
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
                <el-button type="primary" size="small" @click="openAddDialog">新增分类</el-button>
              </Motion>
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.6 }">
                <el-button type="default" size="small" @click="fetchCategories" :loading="loading">刷新数据</el-button>
              </Motion>
            </div>
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
                  {{ classificationData.totalCategories.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-blue-900">
                    {{ classificationData.totalCategories.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    {{ classificationData.totalCategories.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <el-icon size="32">
                  <Grid />
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
                  {{ classificationData.warningCount.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-green-900">
                    {{ classificationData.warningCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-green-600 mt-1">
                    {{ classificationData.warningCount.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <el-icon size="32">
                  <Refresh />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">
                  {{ classificationData.prohibitionCount.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-red-900">
                    {{ classificationData.prohibitionCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-red-600 mt-1">
                    {{ classificationData.prohibitionCount.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-red-500">
                <el-icon size="32">
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">
                  {{ classificationData.indicationCount.label }}
                </p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-2xl font-bold text-yellow-900">
                    {{ classificationData.indicationCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-yellow-600 mt-1">
                    {{ classificationData.indicationCount.change }}
                  </p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <Delete />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 分类列表表格 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.5 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">分类列表</span>
            <span class="text-sm text-gray-500">共 {{ categories.length }} 个分类</span>
          </div>
        </template>

        <el-table :data="paginatedCategories" v-loading="loading" stripe style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }">
          <el-table-column prop="id" label="ID" width="80" sortable />

          <el-table-column prop="name" label="分类名称" width="200" />

          <el-table-column prop="category_type" label="分类类型" width="150">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.category_type)">
                {{ formatCategoryType(row.category_type) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="icon" label="图标" width="80" align="center">
            <template #default="{ row }">
              <span v-if="row.icon">{{ row.icon }}</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>

          <el-table-column prop="color" label="颜色" width="100" align="center">
            <template #default="{ row }">
              <div v-if="row.color" class="flex items-center justify-center">
                <div class="w-4 h-4 rounded border border-gray-300 mr-2" :style="{ backgroundColor: row.color }"></div>
                <span class="text-xs">{{ row.color }}</span>
              </div>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>

          <el-table-column prop="usage_scenario" label="使用场景" width="150" show-overflow-tooltip />

          <el-table-column prop="description" label="描述" show-overflow-tooltip />

          <el-table-column prop="created_at" label="创建时间" width="180" sortable>
            <template #default="{ row }">
              {{ new Date(row.created_at).toLocaleString('zh-CN') }}
            </template>
          </el-table-column>

          <el-table-column prop="updated_at" label="更新时间" width="180" sortable>
            <template #default="{ row }">
              {{ new Date(row.updated_at).toLocaleString('zh-CN') }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="openEditDialog(row)" :disabled="loading">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteCategory(row)" :disabled="loading">
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

          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="categories.length"
            layout="prev, pager, next, jumper" @current-change="handleCurrentChange" small />
        </div>
      </el-card>
    </Motion>

    <!-- 新增/编辑分类对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑交通标志分类' : '新增交通标志分类'" width="500px"
      :before-close="() => dialogVisible = false">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="分类类型" required>
          <el-select v-model="formData.category_type" placeholder="请选择分类类型" style="width: 100%">
            <el-option label="警告标志" value="warning" />
            <el-option label="禁令标志" value="prohibition" />
            <el-option label="指示标志" value="indication" />
            <el-option label="指路标志" value="guide" />
            <el-option label="旅游区标志" value="tourist" />
            <el-option label="道路施工安全标志" value="construction" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>

        <el-form-item label="使用场景">
          <el-input v-model="formData.usage_scenario" placeholder="请输入使用场景，如：高速公路、城市道路" />
        </el-form-item>

        <el-form-item label="图标">
          <el-input v-model="formData.icon" placeholder="请输入图标符号或emoji" />
        </el-form-item>

        <el-form-item label="颜色">
          <el-input v-model="formData.color" placeholder="请输入颜色值，如：#FF0000" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ isEditing ? '更新' : '确定' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.classification {
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
</style>