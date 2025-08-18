import WebSocketClient from '@/http/WebSocket'
import type {
  ClientMessage,
  ServerMessage,
  VideoFrameMessage,
  GetDetectionResultsMessage,
  ClearResultsMessage,
  ConnectionEstablishedMessage,
  DetectionResultMessage,
  DetectionSuccessMessage,
  ErrorMessage,
  WebSocketStatus,
  TrafficDetectionWebSocketOptions,
  DetectionConfig
} from '@/types/apis/yolo_websocket_T'

// 默认配置
const DEFAULT_CONFIG: Required<TrafficDetectionWebSocketOptions> = {
  url: "ws://192.168.124.3:8002/ws/traffic-detection/",
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 20000,
};

const DEFAULT_DETECTION_CONFIG: DetectionConfig = {
  detectionThreshold: 5,
  confidenceThreshold: 0.5,
  imageSize: {
    width: 640,
    height: 480
  }
}

// 交通标志检测WebSocket客户端类
export class TrafficDetectionWebSocket {
  private wsClient: WebSocketClient | null = null
  private config: Required<TrafficDetectionWebSocketOptions>
  private detectionConfig: DetectionConfig
  private status: WebSocketStatus = 'disconnected'
  private sessionId: string | null = null
  
  // 事件回调
  private onStatusChange?: (status: WebSocketStatus) => void
  private onConnectionEstablished?: (data: ConnectionEstablishedMessage) => void
  private onDetectionResult?: (data: DetectionResultMessage) => void
  private onDetectionSuccess?: (data: DetectionSuccessMessage) => void
  private onError?: (error: ErrorMessage) => void

  constructor(
    options: TrafficDetectionWebSocketOptions = {},
    detectionConfig: Partial<DetectionConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...options }
    this.detectionConfig = { ...DEFAULT_DETECTION_CONFIG, ...detectionConfig }
  }

  // 设置事件监听器
  setEventListeners(listeners: {
    onStatusChange?: (status: WebSocketStatus) => void
    onConnectionEstablished?: (data: ConnectionEstablishedMessage) => void
    onDetectionResult?: (data: DetectionResultMessage) => void
    onDetectionSuccess?: (data: DetectionSuccessMessage) => void
    onError?: (error: ErrorMessage) => void
  }) {
    this.onStatusChange = listeners.onStatusChange
    this.onConnectionEstablished = listeners.onConnectionEstablished
    this.onDetectionResult = listeners.onDetectionResult
    this.onDetectionSuccess = listeners.onDetectionSuccess
    this.onError = listeners.onError
  }

  // 连接WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.wsClient?.isConnected()) {
        console.warn('WebSocket已连接')
        resolve()
        return
      }

      this.updateStatus('connecting')

      this.wsClient = new WebSocketClient(
        this.config.url,
        {
          onOpen: () => {
            this.updateStatus('connected')
            resolve()
          },
          onMessage: (data) => {
            this.handleMessage(data)
          },
          onClose: () => {
            this.updateStatus('disconnected')
            this.sessionId = null
          },
          onError: (event) => {
            this.updateStatus('error')
            this.onError?.({
              type: 'error',
              message: '连接错误'
            })
            reject(new Error('WebSocket连接失败'))
          }
        },
        {
          reconnectInterval: this.config.reconnectInterval,
          maxReconnectAttempts: this.config.maxReconnectAttempts,
          heartbeatInterval: this.config.heartbeatInterval
        }
      )

      this.wsClient.connect()
    })
  }

  // 断开连接
  disconnect() {
    if (this.wsClient) {
      this.wsClient.close()
      this.wsClient = null
    }
    this.updateStatus('disconnected')
    this.sessionId = null
  }

  // 发送视频帧
  sendVideoFrame(frameBase64: string) {
    const message: VideoFrameMessage = {
      type: 'video_frame',
      frame: frameBase64
      }
      console.log('=== 发送视频帧 ===', message)
    this.sendMessage(message)
  }

  // 获取检测结果
  getDetectionResults() {
    const message: GetDetectionResultsMessage = {
      type: 'get_detection_results'
    }
    this.sendMessage(message)
  }

  // 清空检测结果
  clearResults() {
    const message: ClearResultsMessage = {
      type: 'clear_results'
    }
    this.sendMessage(message)
  }

  // 发送消息
  private sendMessage(message: ClientMessage) {
    if (!this.wsClient?.isConnected()) {
      console.error('WebSocket未连接，无法发送消息')
      return
    }
    this.wsClient.send(message)
  }

  // 处理接收到的消息
  private handleMessage(data: string | ArrayBuffer | Blob) {
    try {
      if (typeof data !== 'string') {
        console.error('收到非字符串消息')
        return
      }

      const message: ServerMessage = JSON.parse(data)

      switch (message.type) {
        case 'connection_established':
          this.sessionId = message.session_id
          this.onConnectionEstablished?.(message)
          break

        case 'detection_result':
          this.onDetectionResult?.(message)
          break

        case 'detection_success':
          this.onDetectionSuccess?.(message)
          break

        case 'error':
          this.onError?.(message)
          break

        default:
          console.warn('未知消息类型:', message)
      }
    } catch (error) {
      console.error('解析消息失败:', error)
      this.onError?.({
        type: 'error',
        message: '消息解析失败'
      })
    }
  }

  // 更新连接状态
  private updateStatus(status: WebSocketStatus) {
    this.status = status
    this.onStatusChange?.(status)
  }

  // 获取当前状态
  getStatus(): WebSocketStatus {
    return this.status
  }

  // 获取会话ID
  getSessionId(): string | null {
    return this.sessionId
  }

  // 是否已连接
  isConnected(): boolean {
    return this.wsClient?.isConnected() ?? false
  }

  // 获取检测配置
  getDetectionConfig(): DetectionConfig {
    return { ...this.detectionConfig }
  }

  // 更新检测配置
  updateDetectionConfig(config: Partial<DetectionConfig>) {
    this.detectionConfig = { ...this.detectionConfig, ...config }
  }
}

// 创建单例实例
let trafficDetectionWS: TrafficDetectionWebSocket | null = null

// 获取或创建WebSocket实例
export function getTrafficDetectionWebSocket(
  options?: TrafficDetectionWebSocketOptions,
  detectionConfig?: Partial<DetectionConfig>
): TrafficDetectionWebSocket {
  if (!trafficDetectionWS) {
    trafficDetectionWS = new TrafficDetectionWebSocket(options, detectionConfig)
  }
  return trafficDetectionWS
}

// 销毁WebSocket实例
export function destroyTrafficDetectionWebSocket() {
  if (trafficDetectionWS) {
    trafficDetectionWS.disconnect()
    trafficDetectionWS = null
  }
}

// 导出默认实例
export default getTrafficDetectionWebSocket
