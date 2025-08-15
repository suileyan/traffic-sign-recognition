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

    <!-- 实时检测状态显示 -->
    <div v-if="isRealTimeDetecting" class="mb-4 p-4 bg-blue-50 rounded-lg">
      <div class="text-center mb-2">
        <span class="text-sm font-medium text-blue-700">实时检测进行中</span>
      </div>
      <div class="flex items-center justify-center">
        <div class="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
        <div class="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-1" style="animation-delay: 0.2s"></div>
        <div class="animate-pulse w-2 h-2 bg-blue-500 rounded-full" style="animation-delay: 0.4s"></div>
      </div>
      <div class="text-center mt-2">
        <span class="text-xs text-blue-600">已处理帧数: {{ frameCount }}</span>
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
        v-if="isStreaming && !isRealTimeDetecting"
        @click="startRealTimeDetection"
        :disabled="!isWSConnected"
        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        开始实时检测
      </button>
      
      <button 
        v-if="isStreaming && isRealTimeDetecting"
        @click="stopRealTimeDetection"
        class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        停止实时检测
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
         v-if="detectionResults.length > 0 || detectionError"
         @click="clearResults"
         class="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
       >
         清除结果
       </button>
     </div>

    <!-- 检测结果显示 -->
    <div v-if="detectionResults.length > 0 || detectionSuccessResults.length > 0" class="mb-6">
      <!-- 实时检测结果 -->
      <div v-if="detectionResults.length > 0" class="mb-4 p-4 bg-green-50 rounded-lg">
        <h3 class="text-lg font-semibold text-green-800 mb-3">实时检测结果</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(result, index) in detectionResults" 
            :key="index"
            class="p-4 bg-white rounded-lg border border-green-200 shadow-sm"
          >
            <div class="flex justify-between items-center mb-3">
              <span class="font-semibold text-gray-800">{{ result.sign_name || result.class_name }}</span>
              <span class="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">{{ Math.round(result.confidence * 100) }}%</span>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">类别:</span>
                <span class="text-gray-800 font-medium">{{ result.category || '未知' }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">类别ID:</span>
                <span class="text-gray-800">{{ result.class_id }}</span>
              </div>
              
              <div class="border-t pt-2">
                <div class="text-gray-600 mb-1">边界框坐标:</div>
                <div class="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                  X: {{ Math.round(result.bbox[0]) }}, Y: {{ Math.round(result.bbox[1]) }}<br>
                  宽: {{ Math.round(result.bbox[2]) }}, 高: {{ Math.round(result.bbox[3]) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 检测成功结果 -->
      <div v-if="detectionSuccessResults.length > 0" class="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-800 mb-3">检测完成结果</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(result, index) in detectionSuccessResults" 
            :key="'success-' + index"
            class="p-4 bg-white rounded-lg border border-blue-200 shadow-sm"
          >
            <div class="flex justify-between items-center mb-3">
              <span class="font-semibold text-gray-800">{{ result.sign_name || result.class_name }}</span>
              <span class="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">{{ Math.round(result.confidence * 100) }}%</span>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">类别:</span>
                <span class="text-gray-800 font-medium">{{ result.category || '未知' }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">类别ID:</span>
                <span class="text-gray-800">{{ result.class_id }}</span>
              </div>
              
              <div class="border-t pt-2">
                <div class="text-gray-600 mb-1">边界框坐标:</div>
                <div class="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                  X: {{ Math.round(result.bbox[0]) }}, Y: {{ Math.round(result.bbox[1]) }}<br>
                  宽: {{ Math.round(result.bbox[2]) }}, 高: {{ Math.round(result.bbox[3]) }}
                </div>
              </div>
            </div>
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
import { 
  getTrafficDetectionWebSocket,
  destroyTrafficDetectionWebSocket,
  type TrafficDetectionWebSocket
} from '@/api/yolo_websocket'
import type {
  Detection,
  DetectionSuccess,
  DetectionResultMessage,
  DetectionSuccessMessage,
  ErrorMessage,
  ConnectionEstablishedMessage,
  WebSocketStatus
} from '@/types/apis/yolo_websocket_T'

// 响应式变量
const videoElement = ref<HTMLVideoElement | null>(null)
const isStreaming = ref(false)
const isLoading = ref(false)
const statusMessage = ref('点击开始按钮启动摄像头')
const cameraDevices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref('')
const currentStream = ref<MediaStream | null>(null)

// WebSocket 相关变量
const wsClient = ref<TrafficDetectionWebSocket | null>(null)
const isWSConnected = ref(false)
const wsStatus = ref<WebSocketStatus>('disconnected')
const sessionId = ref('')
const detectionResults = ref<Detection[]>([])
const detectionSuccessResults = ref<DetectionSuccess[]>([])
const detectionError = ref('')
const frameCount = ref(0)
const receivedMessages = ref<any[]>([]) // 存储所有收到的消息

// 实时检测相关变量
const isRealTimeDetecting = ref(false)
const detectionTimer = ref<number | null>(null)
const DETECTION_INTERVAL = 500 // 每500ms发送一次，即每秒2次

// WebSocket 连接管理
const connectWebSocket = async () => {
  try {
    // 创建WebSocket客户端
    wsClient.value = getTrafficDetectionWebSocket()
    
    // 设置事件监听器
    wsClient.value.setEventListeners({
      onStatusChange: (status: WebSocketStatus) => {
        wsStatus.value = status
        isWSConnected.value = status === 'connected'
        const message = { type: 'status_change', status, timestamp: new Date().toISOString() }
        receivedMessages.value.push(message)
        console.log('=== WebSocket消息 ===', message)
        
        if (status === 'connected') {
          ElMessage.success('WebSocket 连接成功')
        } else if (status === 'disconnected') {
          const logMessage = { type: 'disconnect', timestamp: new Date().toISOString() }
          receivedMessages.value.push(logMessage)
          console.log('=== WebSocket消息 ===', logMessage)
          // 移除频繁的断开连接提示
          stopRealTimeDetection() // 断开连接时停止实时检测
        } else if (status === 'error') {
          ElMessage.error('WebSocket 连接错误')
          stopRealTimeDetection()
        }
       },
        onConnectionEstablished: (data: ConnectionEstablishedMessage) => {
        sessionId.value = data.session_id
        const logMessage = { type: 'connection_established', data, timestamp: new Date().toISOString() }
        receivedMessages.value.push(logMessage)
        console.log('=== WebSocket消息 ===', logMessage)
      },
      onDetectionResult: (data: DetectionResultMessage) => {
        detectionResults.value = data.detections
        frameCount.value = data.frame_count
        detectionError.value = '' // 清除错误信息
        const logMessage = { type: 'detection_result', data, timestamp: new Date().toISOString() }
        receivedMessages.value.push(logMessage)
        console.log('=== WebSocket消息 ===', logMessage)
        // 移除频繁的检测结果提示
      },
      onDetectionSuccess: (data: DetectionSuccessMessage) => {
        detectionSuccessResults.value = data.detections
        const logMessage = { type: 'detection_success', data, timestamp: new Date().toISOString() }
        receivedMessages.value.push(logMessage)
        console.log('=== WebSocket消息 ===', logMessage)
        // 保留重要的检测成功提示，但减少频率
        if (data.detections.length > 0) {
          ElMessage.success(`检测成功！发现 ${data.detections.length} 个交通标志`)
        }
      },
      onError: (error: ErrorMessage) => {
        detectionError.value = error.message
        const logMessage = { type: 'error', data: error, timestamp: new Date().toISOString() }
        receivedMessages.value.push(logMessage)
        console.log('=== WebSocket消息 ===', logMessage)
        ElMessage.error(`检测错误: ${error.message}`)
      }
    })
    
    // 连接WebSocket
    await wsClient.value.connect()
  } catch (error) {
    console.error('WebSocket 连接失败:', error)
    ElMessage.error('WebSocket 连接失败')
  }
}

const disconnectWebSocket = () => {
  stopRealTimeDetection() // 先停止实时检测
  
  if (wsClient.value) {
    wsClient.value.disconnect()
    wsClient.value = null
    isWSConnected.value = false
    wsStatus.value = 'disconnected'
  }
}

// 开始实时检测
const startRealTimeDetection = () => {
  if (!isWSConnected.value || !wsClient.value) {
    ElMessage.warning('WebSocket未连接，请先连接')
    return
  }
  
  if (!isStreaming.value || !videoElement.value) {
    ElMessage.warning('请先启动摄像头')
    return
  }
  
  if (isRealTimeDetecting.value) {
    ElMessage.warning('实时检测已在进行中')
    return
  }
  
  isRealTimeDetecting.value = true
  detectionError.value = ''
  
  // 设置定时器，每500ms发送一次视频帧
  detectionTimer.value = setInterval(() => {
    sendVideoFrame()
  }, DETECTION_INTERVAL)
  
  ElMessage.success('开始实时检测')
}

// 停止实时检测
const stopRealTimeDetection = () => {
  if (detectionTimer.value) {
    clearInterval(detectionTimer.value)
    detectionTimer.value = null
  }
  
  isRealTimeDetecting.value = false
  
  if (isRealTimeDetecting.value) {
    ElMessage.info('实时检测已停止')
  }
}

// 发送视频帧进行检测
const sendVideoFrame = () => {
  if (!videoElement.value || !isStreaming.value || !wsClient.value?.isConnected()) {
    return
  }
  
  try {
    // 创建canvas来捕获当前视频帧
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    if (!context) {
      console.error('无法创建画布上下文')
      return
    }
    
    // 设置canvas尺寸
    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight
    
    // 绘制当前视频帧
    context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
    
    // 转换为base64
    const frameBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1] // 移除data:image/jpeg;base64,前缀，只保留纯base64数据   
    // 记录发送的消息
    const sendMessage = {
      type: 'video_frame',
      data: {
        frame_size: frameBase64.length,
        session_id: sessionId.value
      },
      timestamp: new Date().toISOString()
    }
    receivedMessages.value.push(sendMessage)
    console.log('=== WebSocket消息 ===', sendMessage)
    
    // 发送到服务器
    wsClient.value.sendVideoFrame(frameBase64)
    
  } catch (error) {
    console.error('发送视频帧失败:', error)
  }
}

// 清除检测结果
const clearResults = () => {
  if (wsClient.value?.isConnected()) {
    wsClient.value.clearResults()
  }
  
  detectionResults.value = []
  detectionSuccessResults.value = []
  detectionError.value = ''
  frameCount.value = 0
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



// 组件挂载时获取设备列表并连接WebSocket
onMounted(() => {
  getCameraDevices()
  connectWebSocket()
})

// 组件卸载时停止摄像头并断开WebSocket
onUnmounted(() => {
  stopRealTimeDetection()
  stopCamera()
  disconnectWebSocket()
  destroyTrafficDetectionWebSocket()
})
</script>

<style scoped>
/* 组件样式 */
</style>
