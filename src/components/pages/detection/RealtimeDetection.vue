<template>
  <div class="text-center">
    <div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
      <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    </div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">实时检测</h2>
    <p class="text-gray-600 mb-8">使用摄像头进行实时视频流检测，即时识别交通标志</p>
    
    <!-- 摄像头设备选择 -->
    <div v-if="cameraDevices.length > 0" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">选择摄像头设备</label>
      <select 
        v-model="selectedDeviceId" 
        @change="switchCamera"
        class="w-full max-w-md mx-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">请选择摄像头</option>
        <option 
          v-for="device in cameraDevices" 
          :key="device.deviceId" 
          :value="device.deviceId"
        >
          {{ device.label || `摄像头 ${device.deviceId.slice(0, 8)}` }}
        </option>
      </select>
    </div>
    
    <!-- 摄像头预览区域 -->
    <div class="bg-gray-900 rounded-xl mb-6 relative overflow-hidden" style="aspect-ratio: 16/9; max-width: 800px; margin: 0 auto;">
      <!-- 视频预览 -->
      <video 
        ref="videoElement"
        v-show="isStreaming"
        autoplay 
        muted 
        playsinline
        class="w-full h-full object-cover"
      ></video>
      
      <!-- 占位符 -->
      <div v-if="!isStreaming" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <p class="text-lg text-gray-300 mb-2">摄像头预览区域</p>
          <p class="text-sm text-gray-400 mb-4">{{ statusMessage }}</p>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p class="text-white text-sm">正在启动摄像头...</p>
        </div>
      </div>
    </div>
    
    <!-- WebSocket连接状态 -->
    <div class="mb-4 p-3 rounded-lg" :class="isWSConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
      <div class="flex items-center justify-center">
        <div class="w-2 h-2 rounded-full mr-2" :class="isWSConnected ? 'bg-green-500' : 'bg-red-500'"></div>
        <span class="text-sm font-medium">
          WebSocket {{ isWSConnected ? '已连接' : '未连接' }}
        </span>
      </div>
    </div>

    <!-- 检测进度显示 -->
    <div v-if="isDetecting" class="mb-4 p-4 bg-blue-50 rounded-lg">
      <div class="text-center mb-2">
        <span class="text-sm font-medium text-blue-700">{{ detectionStatus }}</span>
      </div>
      <div class="w-full bg-blue-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: detectionProgress + '%' }"></div>
      </div>
      <div class="text-center mt-1">
        <span class="text-xs text-blue-600">{{ detectionProgress }}%</span>
      </div>
    </div>

    <!-- 检测错误显示 -->
    <div v-if="detectionError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-sm text-red-700">{{ detectionError }}</span>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="flex justify-center gap-4 mb-6">
      <button 
        v-if="!isStreaming"
        @click="startCamera"
        :disabled="isLoading"
        class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? '启动中...' : '启动摄像头' }}
      </button>
      
      <button 
        v-if="isStreaming"
        @click="stopCamera"
        class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        停止摄像头
      </button>
      
      <button 
        v-if="isStreaming"
        @click="captureFrame"
        :disabled="!isWSConnected || isDetecting"
        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isDetecting ? '检测中...' : '拍照检测' }}
      </button>
      
      <button 
        v-if="!isWSConnected"
        @click="connectWebSocket"
        class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        连接WebSocket
      </button>
      
      <button 
         v-if="isWSConnected"
         @click="disconnectWebSocket"
         class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
       >
         断开WebSocket
       </button>
       
       <button 
         v-if="isDetecting"
         @click="cancelDetection"
         class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
       >
         取消检测
       </button>
       
       <button 
         v-if="detectionResults.length > 0 || detectionError"
         @click="clearResults"
         class="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
       >
         清除结果
       </button>
     </div>

    <!-- 检测结果显示 -->
    <div v-if="detectionResults.length > 0" class="mb-6 p-4 bg-green-50 rounded-lg">
      <h3 class="text-lg font-semibold text-green-800 mb-3">检测结果</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="(result, index) in detectionResults" 
          :key="index"
          class="p-3 bg-white rounded border border-green-200"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium text-gray-800">{{ result.class_name }}</span>
            <span class="text-sm text-green-600">{{ Math.round(result.confidence * 100) }}%</span>
          </div>
          <div class="text-xs text-gray-600">
            位置: ({{ Math.round(result.bbox[0]) }}, {{ Math.round(result.bbox[1]) }}) - 
            ({{ Math.round(result.bbox[2]) }}, {{ Math.round(result.bbox[3]) }})
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
        <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        实时响应
      </div>
      <div class="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
        <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        0.1s延迟
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/common/file'
import serverConfig from '@/configs'
import { 
  createWebSocketAPI, 
  type HzSystemWebSocketAPI,
  type WebSocketEventHandlers,
  type DetectionStartData,
  type DetectionProgressData,
  type DetectionCompleteData,
  type DetectionErrorData,
  type DetectionResult,
  type CancelDetectionPayload,
  type StartDetectionPayload
} from '@/api/hzsystem_websocket/hzsystem_websocket'

// 响应式变量
const videoElement = ref<HTMLVideoElement | null>(null)
const isStreaming = ref(false)
const isLoading = ref(false)
const statusMessage = ref('点击开始按钮启动摄像头')
const cameraDevices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref('')
const currentStream = ref<MediaStream | null>(null)

// WebSocket 相关变量
const wsAPI = ref<HzSystemWebSocketAPI | null>(null)
const isWSConnected = ref(false)
const isDetecting = ref(false)
const detectionProgress = ref(0)
const detectionStatus = ref('')
const detectionResults = ref<DetectionResult[]>([])
const currentTaskId = ref('')
const detectionError = ref('')

// WebSocket 连接管理
const connectWebSocket = async () => {
  try {
    const eventHandlers: WebSocketEventHandlers = {
      onOpen: () => {
        isWSConnected.value = true
        ElMessage.success('WebSocket 连接成功')
      },
      onClose: () => {
        isWSConnected.value = false
        ElMessage.info('WebSocket 连接已断开')
      },
      onDetectionStart: (data: DetectionStartData) => {
        currentTaskId.value = data.task_id
        isDetecting.value = true
        detectionProgress.value = 0
        detectionStatus.value = '检测开始'
        detectionError.value = ''
        ElMessage.info('开始检测...')
      },
      onDetectionProgress: (data: DetectionProgressData) => {
        detectionProgress.value = data.progress
        detectionStatus.value = data.current_step
      },
      onDetectionComplete: (data: DetectionCompleteData) => {
        isDetecting.value = false
        detectionProgress.value = 100
        detectionStatus.value = '检测完成'
        detectionResults.value = data.results?.detections || []
        ElMessage.success(`检测完成！发现 ${data.results?.total_detections || 0} 个交通标志`)
      },
      onDetectionError: (data: DetectionErrorData) => {
        isDetecting.value = false
        detectionError.value = data.error_message
        detectionStatus.value = '检测失败'
        ElMessage.error(`检测失败: ${data.error_message}`)
      },
      onRawError: (event) => {
        console.error('WebSocket 错误:', event)
        ElMessage.error('WebSocket 连接错误')
      }
    }

    wsAPI.value = createWebSocketAPI(undefined, eventHandlers)
    await wsAPI.value.connect()
  } catch (error) {
    console.error('WebSocket 连接失败:', error)
    ElMessage.error('WebSocket 连接失败')
  }
}

const disconnectWebSocket = () => {
  if (wsAPI.value) {
    wsAPI.value.disconnect()
    wsAPI.value = null
    isWSConnected.value = false
  }
}

// 取消检测
const cancelDetection = async () => {
  if (!wsAPI.value || !currentTaskId.value) {
    ElMessage.warning('没有正在进行的检测任务')
    return
  }

  try {
    const payload: CancelDetectionPayload = {
      task_id: currentTaskId.value
    }
    
    await wsAPI.value.cancelDetection(payload)
    
    // 重置状态
    isDetecting.value = false
    detectionProgress.value = 0
    detectionStatus.value = '检测已取消'
    currentTaskId.value = ''
    
    ElMessage.info('检测已取消')
  } catch (error) {
    console.error('取消检测失败:', error)
    ElMessage.error('取消检测失败')
  }
}

// 清除检测结果
const clearResults = () => {
  detectionResults.value = []
  detectionError.value = ''
  detectionStatus.value = ''
  detectionProgress.value = 0
}

// 获取摄像头设备列表
const getCameraDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameraDevices.value = devices.filter(device => device.kind === 'videoinput')
    
    // 如果没有选择设备且有可用设备，选择第一个
    if (cameraDevices.value.length > 0 && !selectedDeviceId.value) {
      selectedDeviceId.value = cameraDevices.value[0].deviceId
    }
  } catch (error) {
    console.error('获取摄像头设备失败:', error)
    ElMessage.error('无法获取摄像头设备列表')
  }
}

// 启动摄像头
const startCamera = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    ElMessage.error('您的浏览器不支持摄像头功能')
    statusMessage.value = '浏览器不支持摄像头功能'
    return
  }

  isLoading.value = true
  statusMessage.value = '正在启动摄像头...'

  try {
    // 先获取设备列表
    await getCameraDevices()
    
    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: selectedDeviceId.value ? { exact: selectedDeviceId.value } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment' // 优先使用后置摄像头
      },
      audio: false
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      currentStream.value = stream
      isStreaming.value = true
      statusMessage.value = '摄像头已启动'
      ElMessage.success('摄像头启动成功')
    }
  } catch (error) {
    console.error('启动摄像头失败:', error)
    let errorMessage = '启动摄像头失败'
    
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        errorMessage = '请允许访问摄像头权限'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '未找到摄像头设备'
      } else if (error.name === 'NotReadableError') {
        errorMessage = '摄像头被其他应用占用'
      }
    }
    
    ElMessage.error(errorMessage)
    statusMessage.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

// 文件上传功能
const uploadCapturedFrame = async (canvas: HTMLCanvasElement): Promise<string | null> => {
  try {
    // 将canvas转换为blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/jpeg', 0.8)
    })

    // 创建文件对象
    const timestamp = new Date().getTime()
    const file = new File([blob], `realtime_capture_${timestamp}.jpg`, {
      type: 'image/jpeg'
    })

    // 上传文件
    const response = await uploadFile(file, serverConfig.FileUploadUrl)
    return response.url || response.path || null
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('图片上传失败')
    return null
  }
}

// 停止摄像头
const stopCamera = () => {
  if (currentStream.value) {
    currentStream.value.getTracks().forEach(track => track.stop())
    currentStream.value = null
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  
  isStreaming.value = false
  statusMessage.value = '摄像头已停止'
  ElMessage.info('摄像头已停止')
}

// 切换摄像头
const switchCamera = async () => {
  if (isStreaming.value) {
    stopCamera()
    // 等待一小段时间再启动新摄像头
    setTimeout(() => {
      startCamera()
    }, 500)
  }
}

// 拍照检测
const captureFrame = async () => {
  if (!videoElement.value || !isStreaming.value) {
    ElMessage.warning('请先启动摄像头')
    return
  }

  if (!isWSConnected.value) {
    ElMessage.warning('WebSocket未连接，请先连接')
    return
  }

  if (isDetecting.value) {
    ElMessage.warning('检测正在进行中，请等待完成')
    return
  }

  try {
    isLoading.value = true
    statusMessage.value = '正在捕获图片...'

    // 创建canvas元素
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) {
      ElMessage.error('无法创建画布上下文')
      return
    }

    // 设置canvas尺寸与视频相同
    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight

    // 将当前视频帧绘制到canvas上
    context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)

    // 上传图片到服务器
    statusMessage.value = '正在上传图片...'
    const imageUrl = await uploadCapturedFrame(canvas)
    
    if (!imageUrl) {
      ElMessage.error('图片上传失败')
      return
    }

    // 发送检测请求
    statusMessage.value = '正在发送检测请求...'
    const payload: StartDetectionPayload = {
      file_path: imageUrl,
      detection_type: 'image',
      options: {
        confidence_threshold: 0.5,
        save_result: true
      }
    }

    await wsAPI.value!.startDetection(payload)
    statusMessage.value = '检测请求已发送，等待结果...'
    ElMessage.success('图片捕获成功，开始检测！')
    
  } catch (error) {
    console.error('拍照检测失败:', error)
    ElMessage.error('拍照检测失败，请重试')
    statusMessage.value = '检测失败'
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时获取设备列表并连接WebSocket
onMounted(() => {
  getCameraDevices()
  connectWebSocket()
})

// 组件卸载时停止摄像头并断开WebSocket
onUnmounted(() => {
  stopCamera()
  disconnectWebSocket()
})
</script>

<style scoped>
/* 组件样式 */
</style>
