<script setup lang="ts">
import { Motion } from "motion-v";
import { ref, onMounted, computed } from 'vue';
import { getRubbishCategoriesAPI, createRubbishCategoryAPI, updateRubbishCategoryAPI, deleteRubbishCategoryAPI } from '@/api/admin/hzsystem_rubbish';
import type { RubbishCategory, CreateRubbishCategoryRequest, UpdateRubbishCategoryRequest } from '@/types/apis/hzsystem_rubbish_T';
import { ElMessage, ElMessageBox } from 'element-plus';

// 垃圾分类数据
const categories = ref<RubbishCategory[]>([]);
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
      recyclableCount: {
        value: 0,
        change: "+0%",
        label: "可回收垃圾",
      },
      hazardousCount: {
        value: 0,
        change: "+0%",
        label: "有害垃圾",
      },
      otherCount: {
        value: 0,
        change: "+0%",
        label: "其他垃圾",
      },
    };
  }
  
  const cats = categories.value;
  
  // 计算总分类数
  const totalCategories = cats.length;
  
  // 计算各类型数量
  const recyclableCount = cats.filter(cat => cat.category_type === 'recyclable').length;
  const hazardousCount = cats.filter(cat => cat.category_type === 'hazardous').length;
  const kitchenCount = cats.filter(cat => cat.category_type === 'kitchen').length;
  const otherCount = cats.filter(cat => cat.category_type === 'other').length;
  
  return {
    totalCategories: {
      value: totalCategories,
      change: "+0%",
      label: "总分类数",
    },
    recyclableCount: {
      value: recyclableCount,
      change: "+0%",
      label: "可回收垃圾",
    },
    hazardousCount: {
      value: hazardousCount,
      change: "+0%",
      label: "有害垃圾",
    },
    otherCount: {
      value: kitchenCount + otherCount,
      change: "+0%",
      label: "其他垃圾",
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
const formData = ref<CreateRubbishCategoryRequest>({
  name: '',
  category_type: 'recyclable',
  description: '',
  disposal_method: '',
  icon: '',
  color: '#409EFF'
});

// 获取垃圾分类数据
const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await getRubbishCategoriesAPI();
    // 按ID从小到大排序
    categories.value = response.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('获取垃圾分类失败:', error);
    ElMessage.error('获取垃圾分类失败');
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
    'recyclable': '可回收垃圾',
    'hazardous': '有害垃圾',
    'kitchen': '厨余垃圾',
    'other': '其他垃圾'
  };
  return typeMap[type] || type;
};

// 获取类型标签颜色
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    'recyclable': 'success',
    'hazardous': 'danger',
    'kitchen': 'warning',
    'other': 'info'
  };
  return typeMap[type] || 'info';
};

// 打开新增对话框
const openAddDialog = () => {
  isEditing.value = false;
  editingId.value = null;
  formData.value = {
    name: '',
    category_type: 'recyclable',
    description: '',
    disposal_method: '',
    icon: '',
    color: '#409EFF'
  };
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (category: RubbishCategory) => {
  isEditing.value = true;
  editingId.value = category.id;
  formData.value = {
    name: category.name,
    category_type: category.category_type,
    description: category.description,
    disposal_method: category.disposal_method,
    icon: category.icon,
    color: category.color ? category.color.replace('#', '') : ''
  };
  dialogVisible.value = true;
};

// 验证emoji
const isValidEmoji = (str: string): boolean => {
  if (!str) return true; // 允许为空
  // 使用更简单但更准确的emoji检测方法
  const emojiRegex = /^[\p{Emoji_Presentation}\p{Emoji}\u{FE0F}\u{200D}]+$/u;
  return emojiRegex.test(str);
};

// 验证16进制颜色格式
const isValidHexColor = (str: string): boolean => {
  if (!str) return true; // 允许为空
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(str);
};

// RGB转16进制颜色格式
const rgbToHex = (rgb: string): string => {
  if (!rgb) return '';
  
  // 如果已经是16进制格式，直接返回
  if (rgb.startsWith('#')) return rgb;
  
  // 匹配rgb(r, g, b)格式
  const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  return rgb;
};

// 监听颜色变化，处理颜色选择器的RGB格式转换
const handleColorChange = (color: string) => {
  if (color) {
    const hexColor = rgbToHex(color);
    // 更新formData中的颜色值，去掉#前缀用于输入框显示
    formData.value.color = hexColor.replace('#', '');
  }
};

// 提交表单（新增或编辑）
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入分类名称');
    return;
  }
  
  // 验证emoji
  if (formData.value.icon && !isValidEmoji(formData.value.icon)) {
    ElMessage.warning('请输入有效的emoji图标');
    return;
  }
  
  // 处理颜色格式转换和验证
  if (formData.value.color) {
    // 先转换RGB格式到16进制
    let colorValue = rgbToHex(formData.value.color);
    
    // 如果不是#开头，添加#前缀
    if (!colorValue.startsWith('#')) {
      colorValue = `#${colorValue}`;
    }
    
    // 验证16进制格式
    if (!isValidHexColor(colorValue)) {
      ElMessage.warning('请输入有效的16进制颜色格式，如：FF5722 或 F57');
      return;
    }
    
    formData.value.color = colorValue;
  }
  
  try {
    loading.value = true;
    if (isEditing.value && editingId.value) {
      await updateRubbishCategoryAPI(editingId.value, formData.value as UpdateRubbishCategoryRequest);
      ElMessage.success('更新分类成功');
    } else {
      await createRubbishCategoryAPI(formData.value);
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
const deleteCategory = async (category: RubbishCategory) => {
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
    await deleteRubbishCategoryAPI(category.id);
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
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">垃圾分类管理</span>
            <div class="flex gap-2">
              <Motion
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }"
                :transition="{ duration: 0.3, delay: 0.5 }"
              >
                <el-button type="primary" size="small" @click="openAddDialog">新增分类</el-button>
              </Motion>
              <Motion
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }"
                :transition="{ duration: 0.3, delay: 0.6 }"
              >
                <el-button type="default" size="small" @click="fetchCategories" :loading="loading">刷新数据</el-button>
              </Motion>
            </div>
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
                  {{ classificationData.totalCategories.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }"
                >
                  <p class="text-2xl font-bold text-blue-900">
                    {{ classificationData.totalCategories.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    {{ classificationData.totalCategories.change }}
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
                  <Grid />
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
                  {{ classificationData.recyclableCount.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }"
                >
                  <p class="text-2xl font-bold text-green-900">
                    {{ classificationData.recyclableCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-green-600 mt-1">
                    {{ classificationData.recyclableCount.change }}
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
                  <Refresh />
                </el-icon>
              </Motion>
            </div>
          </Motion>

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
                  {{ classificationData.hazardousCount.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }"
                >
                  <p class="text-2xl font-bold text-red-900">
                    {{ classificationData.hazardousCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-red-600 mt-1">
                    {{ classificationData.hazardousCount.change }}
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
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion
            :initial="statsCardVariants.initial"
            :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">
                  {{ classificationData.otherCount.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }"
                >
                  <p class="text-2xl font-bold text-yellow-900">
                    {{ classificationData.otherCount.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-yellow-600 mt-1">
                    {{ classificationData.otherCount.change }}
                  </p>
                </Motion>
              </div>
              <Motion
                :initial="iconVariants.initial"
                :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any"
                class="text-yellow-500"
              >
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
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.5 } as any"
    >
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">分类列表</span>
            <span class="text-sm text-gray-500">共 {{ categories.length }} 个分类</span>
          </div>
        </template>

        <el-table 
          :data="paginatedCategories" 
          v-loading="loading"
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }"
        >
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
              <span style="font-size: 20px;">{{ row.icon || '📦' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="color" label="颜色" width="80" align="center">
            <template #default="{ row }">
              <div 
                :style="{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: row.color || '#409EFF', 
                  borderRadius: '4px',
                  margin: '0 auto',
                  border: '1px solid #dcdfe6'
                }"
              ></div>
            </template>
          </el-table-column>
          
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
              <el-button 
                type="primary" 
                size="small" 
                @click="openEditDialog(row)"
                :disabled="loading"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="deleteCategory(row)"
                :disabled="loading"
              >
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
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="size"
                :value="size"
              />
            </el-select>
            <span class="text-sm text-gray-500 ml-2">条</span>
          </div>
          
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="categories.length"
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </el-card>
    </Motion>

    <!-- 新增/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑垃圾分类' : '新增垃圾分类'"
      width="500px"
      :before-close="() => dialogVisible = false"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        
        <el-form-item label="分类类型" required>
          <el-select v-model="formData.category_type" placeholder="请选择分类类型" style="width: 100%">
            <el-option label="可回收垃圾" value="recyclable" />
            <el-option label="有害垃圾" value="hazardous" />
            <el-option label="厨余垃圾" value="kitchen" />
            <el-option label="其他垃圾" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入分类描述"
          />
        </el-form-item>
        
        <el-form-item label="处理方法">
          <el-input 
            v-model="formData.disposal_method" 
            type="textarea" 
            :rows="2" 
            placeholder="请输入处理方法"
          />
        </el-form-item>
        
        <el-form-item label="图标">
          <el-input 
            v-model="formData.icon" 
            placeholder="请输入emoji图标，如：🗑️ ♻️ ⚠️ 🍎"
            maxlength="2"
            show-word-limit
          >
            <template #prepend>
              <span style="font-size: 16px;">{{ formData.icon || '📦' }}</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-500 mt-1">
            建议使用emoji表情符号作为图标
          </div>
        </el-form-item>
        
        <el-form-item label="颜色">
          <div class="flex items-center space-x-3">
            <el-color-picker 
              v-model="formData.color" 
              :predefine="[
                '#409EFF',
                '#67C23A', 
                '#E6A23C',
                '#F56C6C',
                '#909399',
                '#FF5722',
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0'
              ]"
              show-alpha
              @change="handleColorChange"
            />
            <el-input 
              v-model="formData.color" 
              placeholder="409EFF"
              style="width: 200px;"
              maxlength="6"
            >
              <template #prepend>
                #
              </template>
            </el-input>
          </div>
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