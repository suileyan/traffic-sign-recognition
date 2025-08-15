<script setup lang="ts">
    import { Motion } from "motion-v";
    import { ref, computed, onMounted } from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { Plus, Delete } from '@element-plus/icons-vue';
    import { 
      getKnowledgeArticlesAPI, 
      createKnowledgeArticleAPI, 
      updateKnowledgeArticleAPI, 
      patchKnowledgeArticleAPI, 
      deleteKnowledgeArticleAPI 
    } from '@/api/admin/hzsystem_rubbish';
    import type { 
      KnowledgeArticle, 
      CreateKnowledgeArticleRequest, 
      UpdateKnowledgeArticleRequest 
    } from '@/types/apis/hzsystem_rubbish_T';

    // 知识推广数据
    const knowledgeData = {
      totalArticles: {
        value: 156,
        change: "+8.3%",
        label: "总文章数",
      },
      publishedArticles: {
        value: 142,
        change: "+6.7%",
        label: "已发布文章",
      },
      totalViews: {
        value: 25680,
        change: "+15.2%",
        label: "总浏览量",
      },
      avgViews: {
        value: 181,
        change: "+3.8%",
        label: "平均浏览量",
      },
    };

    // 知识文章数据
    const knowledgeArticles = ref<KnowledgeArticle[]>([]);
    const loading = ref(false);
    const serverPath = import.meta.env.VITE_SERVER_PATH;
    const formRef = ref();

    // 对话框相关
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const isEditing = ref(false);
    const currentArticleId = ref<number | null>(null);
    const imagePreviewUrl = ref('');

    // 表单数据
    const articleForm = ref<CreateKnowledgeArticleRequest>({
      title: '',
      article_type: 'guide',
      content: '',
      summary: '',
      cover_image: '',
      is_published: false,
      sort_order: 1
    });
    const selectedFile = ref<File | null>(null);

    // 表单验证规则
    const formRules = {
      title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
      article_type: [
        { required: true, message: '请选择文章类型', trigger: 'change' },
        { 
          validator: (rule: any, value: any, callback: any) => {
            if (value && !['guide', 'tips', 'policy'].includes(value)) {
              callback(new Error('文章类型只能为guide/tips/policy'));
            } else {
              callback();
            }
          }, 
          trigger: 'change' 
        }
      ],
      content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
      summary: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }],
      sort_order: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
    };

    // 分页相关
    const currentPage = ref(1);
    const pageSize = ref(10);
    const pageSizeOptions = [5, 10, 15, 20];

    // 文章类型筛选
    const selectedType = ref('');
    const articleTypes = [
      { label: '全部', value: '' },
      { label: '分类指南', value: 'guide' },
      { label: '环保知识', value: 'environmental' },
      { label: '政策法规', value: 'policy' },
      { label: '实用技巧', value: 'tips' }
    ];

    // 获取知识文章数据
    const fetchKnowledgeArticles = async () => {
      try {
        loading.value = true;
        const params = selectedType.value ? { type: selectedType.value } : undefined;
        const response = await getKnowledgeArticlesAPI(params);
        // 按ID从小到大排序
        knowledgeArticles.value = response.sort((a, b) => a.id - b.id);
      } catch (error) {
        console.error('获取知识文章失败:', error);
      } finally {
        loading.value = false;
      }
    };

    // 分页数据
    const paginatedArticles = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return knowledgeArticles.value.slice(start, end);
    });

    // 总页数
    const totalPages = computed(() => {
      return Math.ceil(knowledgeArticles.value.length / pageSize.value);
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

    // 处理类型筛选变化
    const handleTypeChange = () => {
      currentPage.value = 1;
      fetchKnowledgeArticles();
    };

    // 拼接图片URL
    const getImageUrl = (imagePath: string | null) => {
      if (!imagePath) return '';
      return `${serverPath}${imagePath}`;
    };

    // 格式化文章类型
    const formatArticleType = (type: string) => {
      const typeMap: Record<string, string> = {
        'guide': '分类指南',
        'environmental': '环保知识',
        'policy': '政策法规',
        'tips': '实用技巧'
      };
      return typeMap[type] || type;
    };

    // 格式化发布状态
    const formatPublishStatus = (isPublished: boolean) => {
      return isPublished ? '已发布' : '草稿';
    };

    // 截取摘要
    const truncateSummary = (summary: string, maxLength: number = 50) => {
      if (summary.length <= maxLength) return summary;
      return summary.substring(0, maxLength) + '...';
    };

    // 创建文章
    const handleCreate = () => {
      dialogTitle.value = '创建知识文章';
      isEditing.value = false;
      currentArticleId.value = null;
      articleForm.value = {
        title: '',
        article_type: 'guide',
        content: '',
        summary: '',
        cover_image: '',
        is_published: false,
        sort_order: 1
      };
      selectedFile.value = null;
      imagePreviewUrl.value = '';
      dialogVisible.value = true;
    };

    // 编辑文章
    const handleEdit = (article: KnowledgeArticle) => {
      dialogTitle.value = '编辑知识文章';
      isEditing.value = true;
      currentArticleId.value = article.id;
      articleForm.value = {
        title: article.title,
        article_type: article.article_type,
        content: article.content,
        summary: article.summary,
        cover_image: article.cover_image || '',
        is_published: article.is_published,
        sort_order: article.sort_order
      };
      selectedFile.value = null;
      imagePreviewUrl.value = article.cover_image ? getImageUrl(article.cover_image) : '';
      dialogVisible.value = true;
    };

    // 删除文章
    const handleDelete = async (article: KnowledgeArticle) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除文章「${article.title}」吗？此操作不可恢复。`,
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        await deleteKnowledgeArticleAPI(article.id);
        ElMessage.success('删除成功');
        await fetchKnowledgeArticles();
      } catch (error: any) {
        if (error !== 'cancel') {
          console.error('删除文章失败:', error);
          ElMessage.error('删除失败');
        }
      }
    };

    // 提交表单
    const handleSubmit = async () => {
      if (!formRef.value) return;
      
      try {
        await formRef.value.validate();
        loading.value = true;
        
        let requestData: CreateKnowledgeArticleRequest | UpdateKnowledgeArticleRequest | FormData;
        
        if (selectedFile.value) {
          // 有图片文件，使用 FormData
          const formData = new FormData();
          formData.append('title', articleForm.value.title);
          formData.append('article_type', articleForm.value.article_type);
          formData.append('sort_order', articleForm.value.sort_order.toString());
          formData.append('is_published', articleForm.value.is_published.toString());
          formData.append('summary', articleForm.value.summary);
          formData.append('content', articleForm.value.content);
          formData.append('cover_image', selectedFile.value);
          requestData = formData;
        } else {
          // 没有图片文件，使用 JSON，不包含 cover_image 字段
          const { cover_image, ...formDataWithoutImage } = articleForm.value;
          requestData = formDataWithoutImage;
        }
        
        if (isEditing.value && currentArticleId.value) {
          await updateKnowledgeArticleAPI(currentArticleId.value, requestData as UpdateKnowledgeArticleRequest | FormData);
          ElMessage.success('更新成功');
        } else {
          await createKnowledgeArticleAPI(requestData as CreateKnowledgeArticleRequest | FormData);
          ElMessage.success('创建成功');
        }
        
        dialogVisible.value = false;
        await fetchKnowledgeArticles();
      } catch (error) {
        console.error('提交失败:', error);
        ElMessage.error(isEditing.value ? '更新失败' : '创建失败');
      } finally {
        loading.value = false;
      }
    };

    // 取消操作
    const handleCancel = () => {
      dialogVisible.value = false;
      selectedFile.value = null;
      imagePreviewUrl.value = '';
    };
    
    // 处理文件选择
    const handleFileChange = (file: File) => {
      selectedFile.value = file;
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      return false; // 阻止自动上传
    };
    
    // 移除图片
    const handleRemoveImage = () => {
      selectedFile.value = null;
      imagePreviewUrl.value = '';
      articleForm.value.cover_image = '';
    };

    // 快速切换发布状态
    const togglePublishStatus = async (article: KnowledgeArticle) => {
      try {
        await patchKnowledgeArticleAPI(article.id, {
          is_published: !article.is_published
        });
        ElMessage.success(article.is_published ? '已取消发布' : '已发布');
        await fetchKnowledgeArticles();
      } catch (error) {
        console.error('切换发布状态失败:', error);
        ElMessage.error('操作失败');
      }
    };

    // 页面加载时获取数据
    onMounted(() => {
      fetchKnowledgeArticles();
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
  <div class="knowledge">
    <!-- 知识推广页面 -->
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
    >
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">知识推广</span>
            <div class="flex items-center gap-3">
              <el-select 
                v-model="selectedType" 
                @change="handleTypeChange" 
                placeholder="选择文章类型" 
                size="small" 
                style="width: 140px"
              >
                <el-option
                  v-for="type in articleTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
              <Motion
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }"
                :transition="{ duration: 0.3, delay: 0.5 }"
              >
                <el-button type="success" size="small" @click="handleCreate">新建文章</el-button>
                <el-button type="primary" size="small" @click="fetchKnowledgeArticles" :loading="loading">刷新数据</el-button>
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
                  {{ knowledgeData.totalArticles.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }"
                >
                  <p class="text-2xl font-bold text-blue-900">
                    {{ knowledgeArticles.length || knowledgeData.totalArticles.value }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    {{ knowledgeData.totalArticles.change }}
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
                  <Document />
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
                  {{ knowledgeData.publishedArticles.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }"
                >
                  <p class="text-2xl font-bold text-green-900">
                    {{ knowledgeArticles.filter(a => a.is_published).length || knowledgeData.publishedArticles.value }}
                  </p>
                  <p class="text-sm text-green-600 mt-1">
                    {{ knowledgeData.publishedArticles.change }}
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
                  <Check />
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
                  {{ knowledgeData.totalViews.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }"
                >
                  <p class="text-2xl font-bold text-yellow-900">
                    {{ knowledgeArticles.reduce((sum, a) => sum + a.view_count, 0) || knowledgeData.totalViews.value.toLocaleString() }}
                  </p>
                  <p class="text-sm text-yellow-600 mt-1">
                    {{ knowledgeData.totalViews.change }}
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
                  <View />
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
                  {{ knowledgeData.avgViews.label }}
                </p>
                <Motion
                  :initial="{ opacity: 0, y: 10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }"
                >
                  <p class="text-2xl font-bold text-purple-900">
                    {{ knowledgeArticles.length > 0 ? Math.round(knowledgeArticles.reduce((sum, a) => sum + a.view_count, 0) / knowledgeArticles.length) : knowledgeData.avgViews.value }}
                  </p>
                  <p class="text-sm text-purple-600 mt-1">
                    {{ knowledgeData.avgViews.change }}
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

    <!-- 知识文章表格 -->
    <Motion
      :initial="cardVariants.initial"
      :animate="cardVariants.animate"
      :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.5 } as any"
    >
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">知识文章详情</span>
            <span class="text-sm text-gray-500">共 {{ knowledgeArticles.length }} 篇文章</span>
          </div>
        </template>

        <el-table 
          :data="paginatedArticles" 
          v-loading="loading"
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }"
        >
          <el-table-column prop="id" label="ID" width="80" sortable />
          
          <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip />
          
          <el-table-column prop="article_type" label="文章类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.article_type === 'guide' ? 'primary' : row.article_type === 'environmental' ? 'success' : row.article_type === 'policy' ? 'warning' : 'info'">
                {{ formatArticleType(row.article_type) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="封面图片" width="120">
            <template #default="{ row }">
              <el-image
                v-if="row.cover_image"
                :src="getImageUrl(row.cover_image)"
                :preview-src-list="[getImageUrl(row.cover_image)]"
                fit="cover"
                style="width: 60px; height: 60px; border-radius: 4px;"
                :preview-teleported="true"
              />
              <span v-else class="text-gray-400">无封面</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="summary" label="摘要" width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ truncateSummary(row.summary) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="is_published" label="发布状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.is_published ? 'success' : 'info'">
                {{ formatPublishStatus(row.is_published) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="view_count" label="浏览量" width="100" sortable>
            <template #default="{ row }">
              <span class="text-blue-600 font-medium">{{ row.view_count.toLocaleString() }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="sort_order" label="排序" width="80" sortable />
          
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
          
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <div class="flex gap-2">
                <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button 
                  :type="row.is_published ? 'warning' : 'success'" 
                  size="small" 
                  @click="togglePublishStatus(row)"
                >
                  {{ row.is_published ? '取消发布' : '发布' }}
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </div>
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
            :total="knowledgeArticles.length"
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </el-card>
    </Motion>

    <!-- 创建/编辑文章对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="800px" 
      :close-on-click-modal="false"
      top="5vh"
      :lock-scroll="true"
      class="article-dialog"
    >
      <div class="dialog-content">
      <el-form 
        :model="articleForm" 
        :rules="formRules" 
        label-width="100px" 
        ref="formRef"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章类型" prop="article_type">
              <el-select v-model="articleForm.article_type" placeholder="请选择文章类型" style="width: 100%">
                <el-option label="指南" value="guide" />
                <el-option label="技巧" value="tips" />
                <el-option label="政策" value="policy" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序值" prop="sort_order">
              <el-input-number 
                v-model="articleForm.sort_order" 
                :min="1" 
                :max="999" 
                style="width: 100%" 
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布状态">
              <el-switch 
                v-model="articleForm.is_published" 
                active-text="已发布" 
                inactive-text="草稿" 
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="封面图片">
          <div class="image-upload-container">
            <el-upload
              class="image-uploader"
              :before-upload="handleFileChange"
              :show-file-list="false"
              accept="image/*"
            >
              <div v-if="!imagePreviewUrl" class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">点击上传封面图片</div>
              </div>
              <div v-else class="image-preview">
                <img :src="imagePreviewUrl" alt="封面预览" class="preview-image" />
                <div class="image-overlay">
                  <el-button type="danger" size="small" @click.stop="handleRemoveImage">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-upload>
            <div class="upload-tips">
              <p>支持 JPG、PNG、GIF 格式，建议尺寸 800x600px</p>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="文章摘要" prop="summary">
          <el-input 
            v-model="articleForm.summary" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入文章摘要" 
            maxlength="200" 
            show-word-limit 
          />
        </el-form-item>
        
        <el-form-item label="文章内容" prop="content">
          <el-input 
            v-model="articleForm.content" 
            type="textarea" 
            :rows="8" 
            placeholder="请输入文章内容" 
            maxlength="5000" 
            show-word-limit 
          />
        </el-form-item>
      </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEditing ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.knowledge {
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

/* 增强图片预览样式 */
:deep(.el-image) {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.el-image:hover) {
  border-color: #3b82f6;
  transform: scale(1.05);
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  background-color: #f8fafc;
  border-radius: 12px 12px 0 0;
  padding: 20px 24px;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  background-color: #f8fafc;
  border-radius: 0 0 12px 12px;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-input__inner) {
  border-radius: 8px;
}

/* 操作按钮样式 */
.el-button + .el-button {
  margin-left: 8px;
}

/* 图片上传样式 */
.image-upload-container {
  width: 100%;
}

.image-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  width: 200px;
  height: 150px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-uploader:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c939d;
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.upload-tips p {
  margin: 0;
}

/* 对话框样式 */
.article-dialog :deep(.el-dialog) {
  max-height: 90vh;
  margin-top: 5vh !important;
  margin-bottom: 5vh !important;
  display: flex;
  flex-direction: column;
}

.article-dialog :deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
  padding: 20px;
}

.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
