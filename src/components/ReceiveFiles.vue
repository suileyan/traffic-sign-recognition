<template>
  <div
    class="upload-area"
    @drop.prevent="handleDrop"
    @dragover.prevent
    style="width:100%;height:100%;"
    @click="triggerInput"
  >
    <div class="upload-content">
      <div class="upload-icon">
        <div v-if="props.customIcon" v-html="props.customIcon" class="custom-icon"></div>
        <svg v-else width="64" height="64" fill="#3498db" viewBox="0 0 1024 1024">
          <path d="M512 128l192 192h-128v256h-128V320H320z" />
          <path d="M832 832H192a64 64 0 0 1-64-64V576h64v192h640V576h64v192a64 64 0 0 1-64 64z" />
        </svg>
      </div>
      <div class="upload-title">{{ props.customTitle || '点击或拖拽文件到此处' }}</div>
      <div class="upload-desc">{{ props.customDesc || `支持 ${acceptText}` }}</div>
      <input
        type="file"
        class="upload-input"
        :accept="acceptString"
        @change="handleChange"
        style="display:none"
        ref="fileInput"
      />
      <!-- 给按钮加 .stop 修饰符，阻止冒泡 -->
      <button class="upload-btn" @click.stop="triggerInput">选择文件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

interface ReceiveFilesProps {
  allowSuffix?: string[]
  denySuffix?: string[]
  model?: string
  maxSize?: number
  customIcon?: string
  customTitle?: string
  customDesc?: string
}

const props = defineProps<ReceiveFilesProps>()
const emit = defineEmits(['file-selected'])
const fileInput = ref<HTMLInputElement | null>(null)

const presetConfig = computed(() => {
  let allowSuffix: string[] = []
  let desc = ''
  let maxSize = 10 * 1024 * 1024
  switch (props.model) {
    case 'image':
      allowSuffix = ['jpg', 'jpeg', 'png']
      desc = 'JPG、PNG、JPEG 格式'
      maxSize = 10 * 1024 * 1024
      break
    case 'excel':
      allowSuffix = ['xls', 'xlsx']
      desc = 'XLS、XLSX 格式'
      maxSize = 5 * 1024 * 1024
      break
    case 'pdf':
      allowSuffix = ['pdf']
      desc = 'PDF 格式'
      maxSize = 20 * 1024 * 1024
      break
    default:
      allowSuffix = props.allowSuffix || []
      desc = ''
      maxSize = props.maxSize || 10 * 1024 * 1024
  }
  if (props.allowSuffix?.length) {
    allowSuffix = props.allowSuffix
  }
  if (props.denySuffix?.length && allowSuffix.length) {
    allowSuffix = allowSuffix.filter(
      s => !props.denySuffix!.map(d => d.toLowerCase()).includes(s.toLowerCase())
    )
  }
  return { allowSuffix, desc, maxSize }
})

const acceptString = computed(() => {
  const allow = presetConfig.value.allowSuffix
  return allow?.length ? allow.map(s => '.' + s.toLowerCase()).join(',') : ''
})

const acceptText = computed(() => {
  const allow = presetConfig.value.allowSuffix
  const deny = props.denySuffix || []
  const maxSize = presetConfig.value.maxSize || 10 * 1024 * 1024
  if (presetConfig.value.desc) {
    return `${presetConfig.value.desc}，文件大小不超过 ${Math.round(maxSize / 1024 / 1024)}MB`
  }
  if (allow?.length) {
    return `${allow.join('、').toUpperCase()} 格式，文件大小不超过 ${Math.round(maxSize / 1024 / 1024)}MB`
  } else if (deny.length) {
    return `除 ${deny.join('、').toUpperCase()} 外的文件格式，文件大小不超过 ${Math.round(maxSize / 1024 / 1024)}MB`
  }
  return '支持所有文件类型，文件大小不超过 10MB'
})

function validateFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const allow = presetConfig.value.allowSuffix
  const deny = props.denySuffix || []
  const maxSize = presetConfig.value.maxSize || 10 * 1024 * 1024

  if (allow?.length && !allow.map(s => s.toLowerCase()).includes(ext)) return false
  if (!allow?.length && deny.length && deny.map(s => s.toLowerCase()).includes(ext)) return false
  if (file.size > maxSize) return false
  return true
}

// 公共处理文件方法
function processFile(file: File) {
  if (!validateFile(file)) {
    ElMessage.error('文件格式或大小不符合要求，请重新选择！')
    return
  }
  emit('file-selected', file)
}

// 点击选择文件
function triggerInput() {
  if (fileInput.value) {
    fileInput.value.value = '' // 清空，保证选择同一文件也会触发 change
    fileInput.value.click()
  }
}

// input 选择文件事件
function handleChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) {
    processFile(files[0])
  }
  // 选择完文件后，清空输入，保证可重新选同一文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 拖拽文件
function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files?.length) {
    processFile(files[0])
    if (fileInput.value) {
      fileInput.value.value = '' // 拖拽后也清空，保证可重复拖同一文件
    }
  }
}
</script>

<style scoped lang="scss">
.upload-area {
  width: 100%;
  height: 100%;
  padding: 40px;
  background: #f8f9fa;
  border: 3px dashed #3498db;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background 0.2s;
  cursor: pointer;
}
.upload-area:hover {
  background: #e3f2fd;
}
.upload-content {
  text-align: center;
}
.upload-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
}
.custom-icon svg {
  width: 100%;
  height: 100%;
}
.upload-title {
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2d5c88;
}
.upload-desc {
  font-size: 1rem;
  color: #7b8fa1;
  margin-bottom: 24px;
}
.upload-btn {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 12px 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-btn:hover {
  background: #217dbb;
}
</style>
