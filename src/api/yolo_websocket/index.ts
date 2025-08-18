// 交通标志检测 WebSocket API 导出

export {
  TrafficDetectionWebSocket,
  getTrafficDetectionWebSocket,
  destroyTrafficDetectionWebSocket
} from './yolo_websocket'

export type {
  ClientMessage,
  ServerMessage,
  VideoFrameMessage,
  GetDetectionResultsMessage,
  ClearResultsMessage,
  ConnectionEstablishedMessage,
  DetectionResultMessage,
  DetectionSuccessMessage,
  ErrorMessage,
  Detection,
  DetectionSuccess,
  WebSocketStatus,
  TrafficDetectionWebSocketOptions,
  DetectionConfig
} from '@/types/apis/yolo_websocket_T'

// 默认导出
export { default } from './yolo_websocket'