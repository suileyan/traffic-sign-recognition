// 交通标志检测 WebSocket 类型定义

// 客户端发送消息类型
export interface VideoFrameMessage {
  type: 'video_frame'
  frame: string // base64编码的图像数据
}

export interface GetDetectionResultsMessage {
  type: 'get_detection_results'
}

export interface ClearResultsMessage {
  type: 'clear_results'
}

// 客户端发送消息联合类型
export type ClientMessage = VideoFrameMessage | GetDetectionResultsMessage | ClearResultsMessage

// 服务器响应消息类型
export interface ConnectionEstablishedMessage {
  type: 'connection_established'
  message: string
  session_id: string
}

// 检测结果中的单个检测项
export interface Detection {
  sign_name: string
  category: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
  class_id: number
  class_name?: string // 兼容旧版本
}

// 检测成功消息中的检测项
export interface DetectionSuccess {
  sign_name: string
  category: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
  class_id: number
  tracking_count?: number // 可选字段
  class_name?: string // 兼容旧版本
}

export interface DetectionResultMessage {
  type: 'detection_result'
  detections: Detection[]
  frame_count: number
  session_id: string
}

export interface DetectionSuccessMessage {
  type: 'detection_success'
  message: string
  detections: DetectionSuccess[]
}

export interface ErrorMessage {
  type: 'error'
  message: string
}

// 服务器响应消息联合类型
export type ServerMessage = 
  | ConnectionEstablishedMessage 
  | DetectionResultMessage 
  | DetectionSuccessMessage 
  | ErrorMessage

// WebSocket 连接状态
export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// WebSocket 配置选项
export interface TrafficDetectionWebSocketOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

// 检测参数配置
export interface DetectionConfig {
  detectionThreshold: number // 连续检测帧数阈值，默认5
  confidenceThreshold: number // 置信度阈值，默认0.5
  imageSize?: {
    width: number
    height: number
  }
}