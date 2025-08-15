/**
 * hzsystem_websocket 模块 API 实现
 * 基于封装的 WebSocket 客户端提供实时通信功能
 */

import WebSocketClient from '@/http/WebSocket'
import type {
  WebSocketMessage,
  WebSocketConnectionConfig,
  WebSocketEventHandlers,
  DetectionStartData,
  DetectionProgressData,
  DetectionCompleteData,
  DetectionErrorData,
  SystemNotificationData,
  UserMessageResponseData,
  ConnectionEstablishedData,
  ConnectionClosingData,
  ErrorData,
  StartDetectionPayload,
  CancelDetectionPayload,
  GetStatusPayload,
  UserMessageData,
  WebSocketCloseCode
} from '@/types/apis/hzsystem_websocket_T'

/**
 * WebSocket API 管理类
 * 提供检测进度推送、实时结果通知等功能
 */
export class HzSystemWebSocketAPI {
  private client: WebSocketClient | null = null;
  private baseUrl: string;
  private eventHandlers: WebSocketEventHandlers;
  private config: WebSocketConnectionConfig;

  constructor(
    baseUrl: string = "ws://192.168.124.3:8002/ws/traffic-detection/",
    eventHandlers: WebSocketEventHandlers = {},
    config: WebSocketConnectionConfig = {}
  ) {
    this.baseUrl = baseUrl;
    this.eventHandlers = eventHandlers;
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 20000,
      ...config,
    };
  }

  /**
   * 建立 WebSocket 连接
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 构建连接 URL
        const url = this.buildConnectionUrl();

        // 创建 WebSocket 客户端
        this.client = new WebSocketClient(
          url,
          {
            onOpen: () => {
              console.log("WebSocket 连接已建立");
              this.eventHandlers.onOpen?.();
              resolve();
            },
            onMessage: (data) => {
              this.handleMessage(data);
            },
            onClose: (event) => {
              console.log("WebSocket 连接已关闭", event);
              this.eventHandlers.onClose?.(event);
            },
            onError: (event) => {
              console.error("WebSocket 连接错误", event);
              this.eventHandlers.onRawError?.(event);
              reject(event);
            },
          },
          {
            reconnectInterval: this.config.reconnectInterval,
            maxReconnectAttempts: this.config.maxReconnectAttempts,
            heartbeatInterval: this.config.heartbeatInterval,
            heartbeatMsg: JSON.stringify({
              type: "user_message",
              data: {
                message_type: "ping",
                payload: {},
              },
            }),
          }
        );

        // 建立连接
        this.client.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 关闭 WebSocket 连接
   */
  disconnect(code?: WebSocketCloseCode, reason?: string): void {
    if (this.client) {
      this.client.close(code, reason);
      this.client = null;
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.client?.isConnected() ?? false;
  }

  /**
   * 开始检测
   */
  startDetection(payload: StartDetectionPayload): void {
    this.sendUserMessage("start_detection", payload);
  }

  /**
   * 取消检测
   */
  cancelDetection(payload: CancelDetectionPayload): void {
    this.sendUserMessage("cancel_detection", payload);
  }

  /**
   * 获取检测状态
   */
  getDetectionStatus(payload: GetStatusPayload): void {
    this.sendUserMessage("get_status", payload);
  }

  /**
   * 发送心跳
   */
  ping(): void {
    this.sendUserMessage("ping", {});
  }

  /**
   * 更新事件处理器
   */
  updateEventHandlers(handlers: Partial<WebSocketEventHandlers>): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * 构建连接 URL
   */
  private buildConnectionUrl(): string {
    const url = new URL(this.baseUrl);

    if (this.config.token) {
      url.searchParams.set("token", this.config.token);
    }

    if (this.config.user_id) {
      url.searchParams.set("user_id", this.config.user_id.toString());
    }

    return url.toString();
  }

  /**
   * 发送用户消息
   */
  private sendUserMessage(messageType: string, payload: any): void {
    if (!this.client || !this.client.isConnected()) {
      console.error("WebSocket 未连接，无法发送消息");
      return;
    }

    const message: WebSocketMessage<UserMessageData> = {
      type: "user_message",
      data: {
        message_type: messageType as any,
        payload,
      },
      timestamp: new Date().toISOString(),
      user_id: this.config.user_id || null,
    };

    this.client.send(message);
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string | ArrayBuffer | Blob): void {
    try {
      // 只处理字符串类型的消息
      if (typeof data !== "string") {
        console.warn("收到非字符串类型的消息，忽略处理");
        return;
      }

      const message: WebSocketMessage = JSON.parse(data);

      // 根据消息类型分发处理
      switch (message.type) {
        case "detection_start":
          this.eventHandlers.onDetectionStart?.(
            message.data as DetectionStartData
          );
          break;

        case "detection_progress":
          this.eventHandlers.onDetectionProgress?.(
            message.data as DetectionProgressData
          );
          break;

        case "detection_complete":
          this.eventHandlers.onDetectionComplete?.(
            message.data as DetectionCompleteData
          );
          break;

        case "detection_error":
          this.eventHandlers.onDetectionError?.(
            message.data as DetectionErrorData
          );
          break;

        case "system_notification":
          this.eventHandlers.onSystemNotification?.(
            message.data as SystemNotificationData
          );
          break;

        case "user_message_response":
          this.eventHandlers.onUserMessageResponse?.(
            message.data as UserMessageResponseData
          );
          break;

        case "connection_established":
          this.eventHandlers.onConnectionEstablished?.(
            message.data as ConnectionEstablishedData
          );
          break;

        case "connection_closing":
          this.eventHandlers.onConnectionClosing?.(
            message.data as ConnectionClosingData
          );
          break;

        case "error":
          this.eventHandlers.onError?.(message.data as ErrorData);
          break;

        default:
          console.warn(`未知的消息类型: ${message.type}`, message);
      }
    } catch (error) {
      console.error("解析 WebSocket 消息失败:", error, data);
    }
  }
}

// 创建默认实例
let defaultWebSocketAPI: HzSystemWebSocketAPI | null = null;

/**
 * 获取默认的 WebSocket API 实例
 */
export function getDefaultWebSocketAPI(): HzSystemWebSocketAPI {
  if (!defaultWebSocketAPI) {
    defaultWebSocketAPI = new HzSystemWebSocketAPI();
  }
  return defaultWebSocketAPI;
}

/**
 * 创建新的 WebSocket API 实例
 */
export function createWebSocketAPI(
  baseUrl?: string,
  eventHandlers?: WebSocketEventHandlers,
  config?: WebSocketConnectionConfig
): HzSystemWebSocketAPI {
  return new HzSystemWebSocketAPI(baseUrl, eventHandlers, config);
}

/**
 * 便捷函数：连接到检测 WebSocket
 */
export async function connectToDetectionWebSocket(
  config: WebSocketConnectionConfig = {},
  eventHandlers: WebSocketEventHandlers = {}
): Promise<HzSystemWebSocketAPI> {
  const api = createWebSocketAPI(undefined, eventHandlers, config);
  await api.connect();
  return api;
}

// 导出类型
export type {
  WebSocketMessage,
  WebSocketConnectionConfig,
  WebSocketEventHandlers,
  DetectionStartData,
  DetectionProgressData,
  DetectionCompleteData,
  DetectionErrorData,
  DetectionResult,
  SystemNotificationData,
  UserMessageResponseData,
  ConnectionEstablishedData,
  ConnectionClosingData,
  ErrorData,
  StartDetectionPayload,
  CancelDetectionPayload,
  GetStatusPayload,
  WebSocketCloseCode,
} from "@/types/apis/hzsystem_websocket_T";
