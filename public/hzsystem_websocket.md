# 2. hzsystem_websocket 模块 API

## 2.1 WebSocket 连接概述

WebSocket模块提供实时通信功能，支持检测进度推送、实时结果通知等功能。

**WebSocket连接地址**: `ws://192.168.124.3:8002/ws/detection/`

## 2.2 WebSocket 消息格式

### 通用消息格式

```json
{
    "type": "message_type",
    "data": {},
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": 1
}
```

### 消息类型说明

- `detection_start`: 检测开始
- `detection_progress`: 检测进度更新
- `detection_complete`: 检测完成
- `detection_error`: 检测错误
- `system_notification`: 系统通知
- `user_message`: 用户消息

---

## 2.3 检测相关消息

### 检测开始消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "detection_start",
    "data": {
        "task_id": "task_12345",
        "detection_type": "image",
        "file_name": "test_image.jpg",
        "file_size": 2048576,
        "estimated_time": 5.0
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": 1
}
```

**字段说明**:
- `task_id`: 任务唯一标识符
- `detection_type`: 检测类型 (image/video/realtime)
- `file_name`: 文件名称
- `file_size`: 文件大小(字节)
- `estimated_time`: 预估处理时间(秒)

### 检测进度更新消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "detection_progress",
    "data": {
        "task_id": "task_12345",
        "progress": 45,
        "current_step": "模型推理中",
        "total_steps": 4,
        "current_step_index": 2,
        "elapsed_time": 2.5,
        "remaining_time": 2.5
    },
    "timestamp": "2024-01-01T00:00:30Z",
    "user_id": 1
}
```

**字段说明**:
- `progress`: 进度百分比 (0-100)
- `current_step`: 当前步骤描述
- `total_steps`: 总步骤数
- `current_step_index`: 当前步骤索引
- `elapsed_time`: 已用时间(秒)
- `remaining_time`: 剩余时间(秒)

### 检测完成消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "detection_complete",
    "data": {
        "task_id": "task_12345",
        "record_id": 123,
        "status": "success",
        "processing_time": 4.8,
        "results": {
            "total_detections": 3,
            "detections": [
                {
                    "class_name": "禁止通行",
                    "confidence": 0.95,
                    "bbox": [100, 100, 200, 200]
                },
                {
                    "class_name": "限速60",
                    "confidence": 0.88,
                    "bbox": [300, 150, 400, 250]
                }
            ],
            "result_image_url": "/media/detection_results/result_test.jpg"
        }
    },
    "timestamp": "2024-01-01T00:01:00Z",
    "user_id": 1
}
```

**字段说明**:
- `record_id`: 检测记录ID
- `status`: 状态 (success/failed)
- `processing_time`: 实际处理时间(秒)
- `total_detections`: 检测到的标志数量
- `detections`: 检测结果数组
- `result_image_url`: 结果图片URL

### 检测错误消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "detection_error",
    "data": {
        "task_id": "task_12345",
        "error_code": "MODEL_ERROR",
        "error_message": "模型加载失败",
        "error_details": {
            "model_path": "/models/traffic_signs.pt",
            "error_type": "FileNotFoundError",
            "stack_trace": "..."
        },
        "retry_available": true
    },
    "timestamp": "2024-01-01T00:00:45Z",
    "user_id": 1
}
```

**字段说明**:
- `error_code`: 错误代码
- `error_message`: 错误消息
- `error_details`: 错误详情
- `retry_available`: 是否可重试

---

## 2.4 系统通知消息

### 系统通知消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "system_notification",
    "data": {
        "notification_id": "notif_001",
        "title": "系统维护通知",
        "message": "系统将于今晚22:00-24:00进行维护，期间服务可能中断",
        "level": "warning",
        "category": "maintenance",
        "action_required": false,
        "action_url": null,
        "expires_at": "2024-01-02T00:00:00Z"
    },
    "timestamp": "2024-01-01T10:00:00Z",
    "user_id": null
}
```

**字段说明**:
- `notification_id`: 通知唯一标识
- `title`: 通知标题
- `message`: 通知内容
- `level`: 通知级别 (info/warning/error/success)
- `category`: 通知分类 (maintenance/update/security/general)
- `action_required`: 是否需要用户操作
- `action_url`: 操作链接
- `expires_at`: 过期时间

---

## 2.5 用户消息

### 发送用户消息

**发送方向**: 客户端 → 服务器

**消息格式**:
```json
{
    "type": "user_message",
    "data": {
        "message_type": "start_detection",
        "payload": {
            "file_path": "/uploads/test_image.jpg",
            "detection_type": "image",
            "options": {
                "confidence_threshold": 0.5,
                "save_result": true
            }
        }
    }
}
```

**支持的消息类型**:
- `start_detection`: 开始检测
- `cancel_detection`: 取消检测
- `get_status`: 获取状态
- `ping`: 心跳检测

### 用户消息响应

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "user_message_response",
    "data": {
        "request_id": "req_001",
        "status": "success",
        "message": "检测任务已启动",
        "data": {
            "task_id": "task_12345"
        }
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": 1
}
```

---

## 2.6 连接管理

### 连接建立

**WebSocket连接URL**: `ws://localhost:8000/ws/detection/`

**连接参数**:
- `token` (可选): 用户认证令牌
- `user_id` (可选): 用户ID

**连接示例**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/detection/?token=your_token&user_id=1');
```

### 连接确认消息

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "connection_established",
    "data": {
        "connection_id": "conn_12345",
        "user_id": 1,
        "server_time": "2024-01-01T00:00:00Z",
        "supported_features": [
            "detection_progress",
            "real_time_notification",
            "file_upload_progress"
        ]
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": 1
}
```


### 连接断开

**发送方向**: 服务器 → 客户端

**消息格式**:
```json
{
    "type": "connection_closing",
    "data": {
        "reason": "server_shutdown",
        "message": "服务器正在关闭",
        "reconnect_after": 30
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": 1
}
```

---

## 2.7 错误处理

### WebSocket错误代码

| 错误代码 | 描述 | 处理建议 |
|---------|------|----------|
| 1000 | 正常关闭 | 无需处理 |
| 1001 | 端点离开 | 重新连接 |
| 1002 | 协议错误 | 检查消息格式 |
| 1003 | 不支持的数据类型 | 检查数据类型 |
| 1006 | 异常关闭 | 重新连接 |
| 1011 | 服务器错误 | 稍后重试 |
| 4000 | 认证失败 | 检查认证信息 |
| 4001 | 权限不足 | 联系管理员 |
| 4002 | 连接限制 | 减少连接数 |

### 错误消息格式

```json
{
    "type": "error",
    "data": {
        "error_code": 4000,
        "error_type": "AUTHENTICATION_FAILED",
        "message": "认证失败，请检查token",
        "details": {
            "token_expired": true,
            "expires_at": "2024-01-01T00:00:00Z"
        }
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "user_id": null
}
```

---
