/**
 * hzsystem_websocket 模块 API 类型定义
 */

// 通用消息格式
export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp?: string;
  user_id?: number | null;
}

// 2.3 检测相关消息

// 检测开始消息 (服务器 -> 客户端)
export interface DetectionStartData {
  task_id: string;
  detection_type: 'image' | 'video' | 'realtime';
  file_name: string;
  file_size: number;
  estimated_time: number;
}

export type DetectionStartMessage = WebSocketMessage<DetectionStartData>;

// 检测进度更新消息 (服务器 -> 客户端)
export interface DetectionProgressData {
  task_id: string;
  progress: number;
  current_step: string;
  total_steps: number;
  current_step_index: number;
  elapsed_time: number;
  remaining_time: number;
}

export type DetectionProgressMessage = WebSocketMessage<DetectionProgressData>;

// 检测完成消息 (服务器 -> 客户端)
export interface DetectionResult {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface DetectionCompleteData {
  task_id: string;
  record_id: number;
  status: 'success' | 'failed';
  processing_time: number;
  results: {
    total_detections: number;
    detections: DetectionResult[];
    result_image_url: string;
  };
}

export type DetectionCompleteMessage = WebSocketMessage<DetectionCompleteData>;

// 检测错误消息 (服务器 -> 客户端)
export interface DetectionErrorData {
  task_id: string;
  error_code: string;
  error_message: string;
  error_details?: any;
  retry_available: boolean;
}

export type DetectionErrorMessage = WebSocketMessage<DetectionErrorData>;

// 2.4 系统通知消息

// 系统通知消息 (服务器 -> 客户端)
export interface SystemNotificationData {
  notification_id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'maintenance' | 'update' | 'security' | 'general';
  action_required: boolean;
  action_url: string | null;
  expires_at: string;
}

export type SystemNotificationMessage = WebSocketMessage<SystemNotificationData>;

// 2.5 用户消息

// 客户端发送的用户消息 payload
export interface StartDetectionPayload {
  file_path: string;
  detection_type: 'image' | 'video';
  options?: {
    confidence_threshold?: number;
    save_result?: boolean;
  };
}

export interface CancelDetectionPayload {
  task_id: string;
}

export interface GetStatusPayload {
  task_id: string;
}

export interface PingPayload {
  // No specific payload for ping
}

export type UserMessagePayload = StartDetectionPayload | CancelDetectionPayload | GetStatusPayload | PingPayload;

// 客户端发送的用户消息 (客户端 -> 服务器)
export interface UserMessageData<T extends UserMessagePayload = any> {
  message_type: 'start_detection' | 'cancel_detection' | 'get_status' | 'ping';
  payload: T;
}

export type UserMessageClient = WebSocketMessage<UserMessageData>;

// 用户消息响应 (服务器 -> 客户端)
export interface UserMessageResponseData {
  request_id: string;
  status: 'success' | 'failed';
  message: string;
  data?: any;
}

export type UserMessageResponse = WebSocketMessage<UserMessageResponseData>;

// 2.6 连接管理

// 连接确认消息 (服务器 -> 客户端)
export interface ConnectionEstablishedData {
  connection_id: string;
  user_id: number;
  server_time: string;
  supported_features: string[];
}

export type ConnectionEstablishedMessage = WebSocketMessage<ConnectionEstablishedData>;

// 连接断开消息 (服务器 -> 客户端)
export interface ConnectionClosingData {
  reason: string;
  message: string;
  reconnect_after?: number;
}

export type ConnectionClosingMessage = WebSocketMessage<ConnectionClosingData>;

// 2.7 错误处理

// 错误消息格式 (服务器 -> 客户端)
export interface ErrorData {
  error_code: number;
  error_type: string;
  message: string;
  details?: any;
}

export type ErrorMessage = WebSocketMessage<ErrorData>;

// WebSocket 错误代码常量
export const WebSocketCloseCode = {
  NORMAL_CLOSURE: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  NO_STATUS_RCVD: 1005, // Not a real close code, but used internally
  ABNORMAL_CLOSURE: 1006,
  INVALID_FRAME_PAYLOAD_DATA: 1007,
  POLICY_VIOLATION: 1008,
  MESSAGE_TOO_BIG: 1009,
  MANDATORY_EXT: 1010,
  INTERNAL_ERROR: 1011,
  SERVICE_RESTART: 1012,
  TRY_AGAIN_LATER: 1013,
  BAD_GATEWAY: 1014,
  TLS_HANDSHAKE: 1015,

  // Custom codes (example)
  AUTHENTICATION_FAILED: 4000,
  PERMISSION_DENIED: 4001,
  CONNECTION_LIMIT_EXCEEDED: 4002,
} as const;

export type WebSocketCloseCode = typeof WebSocketCloseCode[keyof typeof WebSocketCloseCode];

// WebSocket 连接配置
export interface WebSocketConnectionConfig {
  token?: string;
  user_id?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

// WebSocket 事件处理器类型
export interface WebSocketEventHandlers {
  onDetectionStart?: (data: DetectionStartData) => void;
  onDetectionProgress?: (data: DetectionProgressData) => void;
  onDetectionComplete?: (data: DetectionCompleteData) => void;
  onDetectionError?: (data: DetectionErrorData) => void;
  onSystemNotification?: (data: SystemNotificationData) => void;
  onUserMessageResponse?: (data: UserMessageResponseData) => void;
  onConnectionEstablished?: (data: ConnectionEstablishedData) => void;
  onConnectionClosing?: (data: ConnectionClosingData) => void;
  onError?: (data: ErrorData) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onRawError?: (event: Event) => void;
}
