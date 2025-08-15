<template>
  <div class="file-manager-container">
    <!-- 头部操作区 -->
    <div class="header-section">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-gray-800">文件管理</h2>
          <el-tag type="info" size="small">{{ fileStats.total }} 个文件</el-tag>
        </div>
        <div class="flex items-center space-x-3">
          <el-select v-model="filters.fileType" placeholder="文件类型" clearable size="default" style="width: 120px">
            <el-option label="图片" value="image" />
            <el-option label="文档" value="document" />
            <el-option label="视频" value="media" />
            <el-option label="音频" value="audio" />
          </el-select>
          <el-button type="primary" @click="showUploadDialog = true" :icon="Upload">
            上传文件
          </el-button>
        </div>
      </div>
    </div>

    <!-- 文件列表区域 -->
    <div class="file-list-section" @contextmenu.prevent="handleAreaContextMenu($event)">
      <div class="file-grid" v-loading="loading.list">
        <transition-group name="file-item" tag="div" class="file-grid-container">
          <div v-for="file in fileList" :key="file.id" class="file-item" @click="handleFileClick(file)"
            @contextmenu.prevent="handleFileContextMenu($event, file)">
            <!-- 文件图标/预览 -->
            <div class="file-thumbnail">
              <!-- 图片预览 -->
              <div v-if="file.file_type === 'image'" class="thumbnail-image">
                <el-image :src="getFileUrl(file.file_path)" fit="cover" class="image-thumb"
                  :preview-src-list="[getFileUrl(file.file_path)]" @click.stop />
              </div>
              <!-- 视频预览 -->
              <div v-else-if="file.file_type === 'media'" class="thumbnail-video">
                <video :src="getFileUrl(file.file_path)" class="video-thumb" preload="metadata" muted>
                  您的浏览器不支持视频播放
                </video>
                <div class="video-play-icon">
                  <el-icon :size="20">
                    <VideoPlay />
                  </el-icon>
                </div>
              </div>
              <!-- 其他文件类型图标 -->
              <div v-else class="thumbnail-icon">
                <el-icon :size="32" class="file-type-icon">
                  <component :is="getFileIcon(file.file_type)" />
                </el-icon>
              </div>
            </div>

            <!-- 文件信息 -->
            <div class="file-content">
              <div class="file-header">
                <h4 class="file-title" :title="file.file_name">{{ file.file_name }}</h4>
                <div class="file-actions">
                  <el-button size="small" text type="primary" @click.stop="viewFileDetail(file)">
                    <el-icon>
                      <View />
                    </el-icon>
                  </el-button>
                  <el-button size="small" text type="danger" @click.stop="deleteFile(file)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </div>
              <div class="file-details">
                <span class="file-size">{{ formatFileSize(file.file_size) }}</span>
                <span class="file-separator">•</span>
                <span class="file-time">{{ formatTime(file.upload_time) }}</span>
              </div>
              <div class="file-type-badge">
                <el-tag size="small" :type="getFileTypeColor(file.file_type)">{{ getFileTypeLabel(file.file_type)
                  }}</el-tag>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading.list && fileList.length === 0" description="暂无文件" />

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="fileStats.total > 0">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="fileStats.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 上传弹窗 -->
    <FileUploadModal v-model:visible="showUploadDialog" :max-file-size="10 * 1024 * 1024"
      accepted-types=".jpg,.jpeg,.png,.doc,.docx,.rar,.zip,.7z,.pptx,.pdf,.mp3,.mp4,.avi" :multiple="true"
      @upload="handleFileUpload" @success="handleUploadSuccess" @error="handleUploadError" />

    <!-- 文件详情对话框 -->
    <el-dialog v-model="showDetailDialog" :title="null" width="700px" :show-close="false" class="file-detail-dialog"
      align-center>
      <div v-if="selectedFile" class="file-detail-container">
        <!-- 弹窗头部 -->
        <div class="detail-header">
          <div class="header-left">
            <div class="file-icon-large">
              <el-icon :size="32" class="file-icon">
                <component :is="getFileIcon(selectedFile.file_type)" />
              </el-icon>
            </div>
            <div class="header-info">
              <h3 class="file-name" :title="selectedFile.file_name">{{ selectedFile.file_name }}</h3>
              <div class="file-meta">
                <el-tag size="small" :type="getFileTypeColor(selectedFile.file_type)" class="type-tag">
                  {{ getFileTypeLabel(selectedFile.file_type) }}
                </el-tag>
                <span class="file-size">{{ formatFileSize(selectedFile.file_size) }}</span>
              </div>
            </div>
          </div>
          <el-button type="info" :icon="Delete" circle size="large" @click="showDetailDialog = false"
            class="close-btn" />
        </div>

        <!-- 文件预览区域 -->
        <div class="preview-section">
          <!-- 图片预览 -->
          <div v-if="selectedFile.file_type === 'image'" class="image-preview-container">
            <div class="preview-wrapper">
              <el-image :src="getFileUrl(selectedFile.file_path)"
                :preview-src-list="[getFileUrl(selectedFile.file_path)]" fit="contain" class="preview-image"
                @click.stop>
                <template #error>
                  <div class="image-error">
                    <el-icon :size="48">
                      <Picture />
                    </el-icon>
                    <p>图片加载失败</p>
                  </div>
                </template>
              </el-image>
            </div>
          </div>

          <!-- 视频预览 -->
          <div v-else-if="selectedFile.file_type === 'media'" class="video-preview-container">
            <div class="preview-wrapper">
              <video :src="getFileUrl(selectedFile.file_path)" controls preload="metadata" class="preview-video">
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>

          <!-- 其他文件类型 -->
          <div v-else class="file-placeholder">
            <div class="placeholder-content">
              <el-icon :size="64" class="placeholder-icon">
                <component :is="getFileIcon(selectedFile.file_type)" />
              </el-icon>
              <p class="placeholder-text">{{ getFileTypeLabel(selectedFile.file_type) }}文件</p>
              <p class="placeholder-desc">此文件类型不支持预览</p>
            </div>
          </div>
        </div>

        <!-- 文件信息区域 -->
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">文件名称</label>
              <div class="info-value">{{ selectedFile.file_name }}</div>
            </div>
            <div class="info-item">
              <label class="info-label">文件大小</label>
              <div class="info-value">{{ formatFileSize(selectedFile.file_size) }}</div>
            </div>
            <div class="info-item">
              <label class="info-label">文件类型</label>
              <div class="info-value">{{ selectedFile.file_type }}</div>
            </div>
            <div class="info-item">
              <label class="info-label">MIME类型</label>
              <div class="info-value">{{ selectedFile.mime_type || '未知' }}</div>
            </div>
            <div class="info-item full-width">
              <label class="info-label">上传时间</label>
              <div class="info-value">{{ formatTime(selectedFile.upload_time) }}</div>
            </div>
            <div class="info-item full-width">
              <label class="info-label">文件描述</label>
              <div class="info-value description">{{ selectedFile.description || '无描述' }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-section">
          <el-button type="primary" :icon="View" @click="downloadFile(selectedFile)">
            下载文件
          </el-button>
          <el-button type="danger" :icon="Delete" @click="deleteFileFromDetail(selectedFile)">
            删除文件
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 右键菜单 -->
    <div v-show="contextMenu.visible" class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }" @click.stop @contextmenu.prevent>
      <!-- 文件右键菜单 -->
      <div v-if="contextMenu.type === 'file'" class="menu-items">
        <div class="menu-item" @click="viewFileDetail(contextMenu.file!)">
          <el-icon>
            <View />
          </el-icon>
          <span>查看详情</span>
        </div>
        <div class="menu-item" @click="deleteFile(contextMenu.file!)">
          <el-icon>
            <Delete />
          </el-icon>
          <span>删除</span>
        </div>
        <div class="menu-item" @click="copyFileAddress(contextMenu.file!)">
          <el-icon>
            <CopyDocument />
          </el-icon>
          <span>复制地址</span>
        </div>
      </div>

      <!-- 空白区域右键菜单 -->
      <div v-if="contextMenu.type === 'area'" class="menu-items">
        <div class="menu-item" @click="refreshFileList">
          <el-icon>
            <Refresh />
          </el-icon>
          <span>刷新</span>
        </div>
        <div class="menu-item has-submenu" @mouseenter="showSortSubmenu = true" @mouseleave="showSortSubmenu = false">
          <el-icon>
            <Sort />
          </el-icon>
          <span>排序方式</span>
          <el-icon class="arrow-icon">
            <ArrowRight />
          </el-icon>

          <!-- 排序子菜单 -->
          <div v-show="showSortSubmenu" class="submenu">
            <div class="menu-item" @click="setSortBy('name')">
              <span>按名称</span>
              <el-icon v-if="sortBy === 'name'">
                <Check />
              </el-icon>
            </div>
            <div class="menu-item" @click="setSortBy('size')">
              <span>按大小</span>
              <el-icon v-if="sortBy === 'size'">
                <Check />
              </el-icon>
            </div>
            <div class="menu-item" @click="setSortBy('time')">
              <span>按时间</span>
              <el-icon v-if="sortBy === 'time'">
                <Check />
              </el-icon>
            </div>
            <div class="menu-item" @click="setSortBy('type')">
              <span>按类型</span>
              <el-icon v-if="sortBy === 'type'">
                <Check />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩层，用于关闭右键菜单 -->
    <div v-show="contextMenu.visible" class="context-menu-overlay" @click="hideContextMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  View,
  Delete,
  Document,
  Picture,
  VideoPlay,
  Headset,
  Files,
  CopyDocument,
  Refresh,
  Sort,
  ArrowRight,
  Check
} from '@element-plus/icons-vue'

import { getUserFiles, getUserFileDetail, deleteUserFiles } from '@/api/admin/files'
import type { FileItem, } from '@/types/factory'
import FileUploadModal from '@/components/common/FileUploadModal/index.vue'

// 响应式数据
const loading = reactive({
  list: false,
  upload: false,
  detail: false
})

const pagination = reactive({
  page: 1,
  pageSize: 20
})

const filters = reactive({
  fileType: ''
})

const fileStats = reactive({
  total: 0
})

const fileList = ref<FileItem[]>([])
const selectedFile = ref<FileItem | null>(null)
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const showSortSubmenu = ref(false)
const sortBy = ref('time')

// 右键菜单相关
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  type: '' as 'file' | 'area',
  file: null as FileItem | null
})

// 计算属性

// 方法
const loadFileList = async () => {
  loading.list = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...(filters.fileType && { file_type: filters.fileType })
    }

    const response = await getUserFiles(params)
    let files = response.data.files

    // 应用排序
    if (sortBy.value) {
      files = files.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.file_name.localeCompare(b.file_name)
          case 'size':
            return a.file_size - b.file_size
          case 'time':
            return new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime()
          case 'type':
            return a.file_type.localeCompare(b.file_type)
          default:
            return 0
        }
      })
    }

    fileList.value = files
    fileStats.total = response.data.total
  } catch (error) {
    ElMessage.error('获取文件列表失败')
  } finally {
    loading.list = false
  }
}

const handleFileClick = (file: FileItem) => {
  selectedFile.value = file
}

// 右键菜单相关方法
const handleFileContextMenu = (event: MouseEvent, file: FileItem) => {
  event.stopPropagation()

  // 先隐藏现有菜单，然后在新位置显示
  hideContextMenu()

  // 使用 nextTick 确保隐藏操作完成后再显示新菜单
  setTimeout(() => {
    contextMenu.visible = true
    contextMenu.x = event.clientX
    contextMenu.y = event.clientY
    contextMenu.type = 'file'
    contextMenu.file = file
    showSortSubmenu.value = false
  }, 10)
}

const handleAreaContextMenu = (event: MouseEvent) => {
  // 检查是否点击在文件项上
  const target = event.target as HTMLElement
  if (target.closest('.file-item')) {
    return
  }

  // 先隐藏现有菜单，然后在新位置显示
  hideContextMenu()

  // 使用 nextTick 确保隐藏操作完成后再显示新菜单
  setTimeout(() => {
    contextMenu.visible = true
    contextMenu.x = event.clientX
    contextMenu.y = event.clientY
    contextMenu.type = 'area'
    contextMenu.file = null
    showSortSubmenu.value = false
  }, 10)
}

const hideContextMenu = () => {
  contextMenu.visible = false
  showSortSubmenu.value = false
}

const copyFileAddress = async (file: FileItem) => {
  try {
    const fileUrl = getFileUrl(file.file_path)
    await navigator.clipboard.writeText(fileUrl)
    ElMessage.success('文件地址已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
  hideContextMenu()
}

const refreshFileList = () => {
  loadFileList()
  hideContextMenu()
}

const setSortBy = (sort: string) => {
  sortBy.value = sort
  // 这里可以添加排序逻辑
  loadFileList()
  hideContextMenu()
}

const viewFileDetail = async (file: FileItem) => {
  // 隐藏右键菜单
  hideContextMenu()

  loading.detail = true
  try {
    const response = await getUserFileDetail(file.id)
    selectedFile.value = response.data
    showDetailDialog.value = true
  } catch (error) {
    ElMessage.error('获取文件详情失败')
  } finally {
    loading.detail = false
  }
}

const deleteFile = async (file: FileItem) => {
  // 隐藏右键菜单
  hideContextMenu()

  try {
    await ElMessageBox.confirm(
      `确定要删除文件 "${file.file_name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteUserFiles({ file_ids: [file.id] })
    ElMessage.success('删除成功')
    await loadFileList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleFileUpload = async (files: File[]) => {
  loading.upload = true
  try {
    // 这里可以添加批量上传逻辑
    // 目前使用FileUpload组件内部的上传逻辑
  } catch (error) {
    ElMessage.error('上传失败')
  } finally {
    loading.upload = false
  }
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('上传成功')
  loadFileList()
  showUploadDialog.value = false
}

const handleUploadError = (error: Error) => {
  ElMessage.error('上传失败')
}



const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadFileList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadFileList()
}

const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, any> = {
    image: Picture,
    document: Document,
    media: VideoPlay,
    audio: Headset,
    default: Files
  }
  return iconMap[fileType] || iconMap.default
}

const getFileTypeLabel = (fileType: string) => {
  const labelMap: Record<string, string> = {
    image: '图片',
    document: '文档',
    media: '视频',
    audio: '音频',
    default: '文件'
  }
  return labelMap[fileType] || labelMap.default
}

const getFileTypeColor = (fileType: string) => {
  const colorMap: Record<string, string> = {
    image: 'success',
    document: 'info',
    media: 'warning',
    audio: 'danger',
    default: ''
  }
  return colorMap[fileType] || colorMap.default
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const formatTime = (time: string): string => {
  return new Date(time).toLocaleString('zh-CN')
}

const getFileUrl = (filePath: string): string => {
  return `${import.meta.env.VITE_SERVER_PATH}/${filePath}`
}

const downloadFile = (file: FileItem) => {
  const url = getFileUrl(file.file_path)
  const link = document.createElement('a')
  link.href = url
  link.download = file.file_name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const deleteFileFromDetail = async (file: FileItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件 "${file.file_name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteUserFiles({ file_ids: [file.id] })
    ElMessage.success('删除成功')
    showDetailDialog.value = false
    await loadFileList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 监听筛选条件变化
watch(
  () => filters.fileType,
  () => {
    pagination.page = 1 // 重置到第一页
    loadFileList()
  }
)

// 全局右键事件处理函数
const handleGlobalContextMenu = (e: MouseEvent) => {
  // 只在文件管理页面阻止默认右键菜单
  const fileManagerContainer = document.querySelector('.file-manager-container')
  if (fileManagerContainer && fileManagerContainer.contains(e.target as Node)) {
    e.preventDefault()
  }
}

// 生命周期
onMounted(() => {
  loadFileList()

  // 阻止整个页面的默认右键菜单
  document.addEventListener('contextmenu', handleGlobalContextMenu)
})

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener('contextmenu', handleGlobalContextMenu)
})
</script>

<style scoped>
.file-manager-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.file-list-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 文件网格布局 */
.file-grid {
  width: 100%;
}

.file-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 4px;
}

/* 文件项样式 */
.file-item {
  background: white;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  position: relative;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

/* 文件缩略图 */
.file-thumbnail {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图片缩略图 */
.thumbnail-image {
  width: 100%;
  height: 100%;
}

.image-thumb {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* 视频缩略图 */
.thumbnail-video {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(4px);
}

/* 文件类型图标 */
.thumbnail-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.file-type-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 文件内容区域 */
.file-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文件头部 */
.file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.file-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  line-height: 1.4;
}

.file-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-item:hover .file-actions {
  opacity: 1;
}

/* 文件详情 */
.file-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1;
}

.file-separator {
  color: #dcdfe6;
}

/* 文件类型标签 */
.file-type-badge {
  align-self: flex-start;
}

/* 过渡动画 */
.file-item-enter-active,
.file-item-leave-active {
  transition: all 0.3s ease;
}

.file-item-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.file-item-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.file-item-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-grid-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .file-item {
    padding: 12px;
    gap: 12px;
  }

  .file-thumbnail {
    width: 48px;
    height: 48px;
  }

  .file-title {
    font-size: 13px;
  }

  .file-details {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .file-list-section {
    padding: 12px;
  }

  .file-grid-container {
    gap: 8px;
  }

  .file-item {
    padding: 10px;
    gap: 10px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}



/* 文件详情弹窗样式 */
.file-detail-dialog {
  --el-dialog-border-radius: 16px;
}

.file-detail-dialog .el-dialog__body {
  padding: 0;
}

.file-detail-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  overflow: hidden;
}

/* 弹窗头部 */
.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: relative;
}

.detail-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.file-icon-large {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.file-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.header-info {
  flex: 1;
}

.file-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-tag {
  background: rgba(255, 255, 255, 0.9) !important;
  border: none !important;
  font-weight: 500;
}

.file-size {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.close-btn {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05);
}

/* 预览区域 */
.preview-section {
  padding: 24px;
  background: white;
}

.preview-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

/* 图片预览 */
.image-preview-container {
  text-align: center;
}

.preview-image {
  width: 100%;
  max-height: 350px;
  border-radius: 12px;
}

.image-error {
  padding: 60px 20px;
  color: #909399;
  text-align: center;
}

.image-error p {
  margin: 12px 0 0 0;
  font-size: 14px;
}

/* 视频预览 */
.video-preview-container {
  text-align: center;
}

.preview-video {
  width: 100%;
  max-height: 400px;
  border-radius: 12px;
  background: #000;
}

/* 文件占位符 */
.file-placeholder {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder-icon {
  color: #64748b;
  opacity: 0.7;
}

.placeholder-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #475569;
}

.placeholder-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* 信息区域 */
.info-section {
  padding: 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.info-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  word-break: break-all;
}

.info-value.description {
  min-height: 40px;
  word-break: break-word;
}

/* 操作区域 */
.action-section {
  padding: 20px 24px 24px;
  background: white;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
}

.action-section .el-button {
  padding: 10px 20px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-section .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-detail-dialog {
    width: 95vw !important;
    margin: 0 auto;
  }

  .detail-header {
    padding: 20px;
  }

  .file-name {
    font-size: 18px;
    max-width: 200px;
  }

  .preview-section,
  .info-section {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .action-section {
    padding: 16px 20px 20px;
    flex-direction: column;
  }

  .action-section .el-button {
    width: 100%;
  }
}

/* 动画效果 */
.file-card-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.file-card-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-manager-container {
    padding: 10px;
  }

  .header-section,
  .file-list-section {
    padding: 15px;
  }

  .file-preview {
    height: 100px;
  }
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 160px;
  padding: 4px 0;
  backdrop-filter: blur(10px);
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #409eff;
}

.menu-item .el-icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item span {
  flex: 1;
}

.menu-item.has-submenu {
  position: relative;
}

.arrow-icon {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.6;
}

.submenu {
  position: absolute;
  left: 100%;
  top: 0;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  padding: 4px 0;
  z-index: 10000;
}

.submenu .menu-item {
  padding: 6px 12px;
  font-size: 13px;
  justify-content: space-between;
}

.submenu .menu-item .el-icon {
  font-size: 14px;
  margin-left: 8px;
}

.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: transparent;
}

/* 右键菜单动画 */
.context-menu {
  animation: contextMenuFadeIn 0.2s ease-out;
}

@keyframes contextMenuFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>