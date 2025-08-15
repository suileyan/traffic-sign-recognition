<template>
  <div class="file-upload-container">
    <el-upload ref="uploadRef" class="upload-demo" :drag="drag" :action="action" :accept="accept" :disabled="disabled"
      :auto-upload="false" :show-file-list="true" :before-upload="handleBeforeUpload" v-model:file-list="fileList">
      <div class="upload-content">
        <div class="upload-icon">
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
        </div>
        <div class="upload-text">
          <div class="el-upload__text">
            拖拽文件到此处或<em>点击上传</em>
          </div>
          <div class="el-upload__tip">
            支持格式: {{ acceptText }}
          </div>
        </div>
      </div>
    </el-upload>

    <!-- 操作按钮 -->
    <div class="upload-actions">
      <el-button type="primary" @click="submitUpload" :loading="isUploading"
        :disabled="fileList.length === 0 || disabled">
        {{ isUploading ? '上传中...' : '开始上传' }}
      </el-button>
      <el-button @click="clearFiles" :disabled="isUploading" v-if="fileList.length > 0">
        清空文件
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadUserFile, ElUpload } from 'element-plus'
import serverConfig from '@/configs'
import { uploadFile } from '@/api/common/file'

// 定义属性
interface Props {
  disabled?: boolean
  accept?: string
  action?: string
  autoUpload?: boolean
  drag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  accept: '',
  action: serverConfig.FileUploadUrl,
  autoUpload: false,
  drag: true
})

// 定义事件
interface Emits {
  (e: 'success', response: any, file: UploadUserFile): void
  (e: 'error', error: any, file: UploadUserFile): void
  (e: 'change', fileList: UploadUserFile[]): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const fileList = ref<UploadUserFile[]>([])
const isUploading = ref(false)

// 计算属性
const acceptText = computed(() => {
  if (!props.accept) return '图片、文档、视频等所有格式'
  return props.accept.split(',').map(type => type.trim().replace('.', '')).join(', ')
})

// 方法
const handleBeforeUpload = (rawFile: File) => {
  // 阻止自动上传，只添加到文件列表
  return false
}

// 监听文件列表变化，触发 change 事件
watch(fileList, (newFileList) => {
  console.log('fileList', newFileList);

  emit('change', newFileList)
}, { deep: true })

const submitUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择文件')
    return
  }

  if (isUploading.value) return

  isUploading.value = true

  try {
    // 手动触发每个文件的上传
    for (const file of fileList.value) {
      if (file.raw && file.status !== 'success') {
        await uploadSingleFile(file)
      }
    }
    ElMessage.success('所有文件上传成功')
  } catch (error) {
    ElMessage.error('文件上传失败')
    console.error('Upload error:', error)
  } finally {
    isUploading.value = false
  }
}

const uploadSingleFile = (file: UploadUserFile): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!(file.raw instanceof File)) {
      reject(new Error('文件数据不存在'))
      return
    }

    uploadFile(file.raw, props.action)
      .then(data => {
        file.status = 'success'
        emit('success', data, file)
        resolve()
      })
      .catch(error => {
        file.status = 'fail'
        emit('error', error, file)
        reject(error)
      })
  })
}


const clearFiles = () => {
  fileList.value = []
  uploadRef.value?.clearFiles()
  emit('change', [])
}
</script>

<style scoped>
.file-upload-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.upload-demo {
  width: 100%;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.upload-icon {
  font-size: 48px;
  color: #8c939d;
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.upload-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

/* 自定义 el-upload 拖拽区域样式 */
:deep(.el-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 40px 20px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background-color: #f5f7fa;
}

:deep(.el-upload-dragger.is-dragover) {
  border-color: #409eff;
  background-color: #ecf5ff;
  transform: scale(1.02);
}

/* 文件列表样式 */
:deep(.el-upload-list) {
  margin-top: 16px;
}

:deep(.el-upload-list__item) {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

:deep(.el-upload-list__item:hover) {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

:deep(.el-upload-list__item-name) {
  color: #606266;
  font-size: 14px;
}

:deep(.el-upload-list__item-status-label) {
  color: #67c23a;
}

:deep(.el-upload-list__item .el-icon--close) {
  color: #c0c4cc;
  transition: color 0.3s ease;
}

:deep(.el-upload-list__item .el-icon--close:hover) {
  color: #f56c6c;
}

/* 响应式设计 */
@media (max-width: 640px) {
  :deep(.el-upload-dragger) {
    padding: 30px 15px;
    min-height: 150px;
  }

  .upload-actions {
    flex-direction: column;
  }

  .upload-actions .el-button {
    width: 100%;
  }
}
</style>