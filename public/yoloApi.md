# 3. hzsystem_yolo 模块 API

## 3.1 YOLO模型检测服务概述

hzsystem_yolo模块提供基于YOLO模型的交通标志检测服务，支持图片和视频检测功能。

**基础URL**: `/api/yolo/`

---

## 3.2 图片检测接口

### POST /api/yolo/detect/image/

对上传的图片进行交通标志检测

**请求方式**: POST (multipart/form-data)

**请求参数**:
- `image` (必需): 图片文件 (支持格式: jpg, jpeg, png, bmp)
- `confidence_threshold` (可选): 置信度阈值，默认0.5
- `save_result` (可选): 是否保存检测结果，默认true
- `return_image` (可选): 是否返回标注后的图片，默认true

**请求示例**:
```bash
curl -X POST \
  http://localhost:8000/api/yolo/detect/image/ \
  -H 'Content-Type: multipart/form-data' \
  -F 'image=@/path/to/image.jpg' \
  -F 'confidence_threshold=0.6' \
  -F 'save_result=true' \
  -F 'return_image=true'
```

**响应体**:
```json
{
    "code": 200,
    "message": "图片检测完成",
    "data": {
        "task_id": "img_task_12345",
        "detection_id": 123,
        "processing_time": 2.35,
        "image_info": {
            "original_filename": "test_image.jpg",
            "image_size": [1920, 1080],
            "file_size_mb": 2.5
        },
        "detection_results": {
            "total_detections": 3,
            "detections": [
                {
                    "class_id": 0,
                    "class_name": "禁止通行",
                    "confidence": 0.95,
                    "bbox": {
                        "x1": 100,
                        "y1": 100,
                        "x2": 200,
                        "y2": 200,
                        "width": 100,
                        "height": 100
                    },
                    "center_point": [150, 150]
                },
                {
                    "class_id": 1,
                    "class_name": "限速60",
                    "confidence": 0.88,
                    "bbox": {
                        "x1": 300,
                        "y1": 150,
                        "x2": 400,
                        "y2": 250,
                        "width": 100,
                        "height": 100
                    },
                    "center_point": [350, 200]
                },
                {
                    "class_id": 2,
                    "class_name": "警告标志",
                    "confidence": 0.76,
                    "bbox": {
                        "x1": 500,
                        "y1": 200,
                        "x2": 580,
                        "y2": 280,
                        "width": 80,
                        "height": 80
                    },
                    "center_point": [540, 240]
                }
            ]
        },
        "result_image_url": "/media/detection_results/result_test_image.jpg",
        "statistics": {
            "avg_confidence": 0.863,
            "detection_density": 0.00145,
            "model_version": "yolov8n_traffic_v1.0",
            "inference_time": 0.85
        }
    }
}
```

**错误响应**:
```json
{
    "code": 400,
    "message": "检测失败",
    "errors": {
        "image": ["不支持的图片格式"],
        "confidence_threshold": ["置信度阈值必须在0-1之间"]
    }
}
```

---

## 3.3 视频检测接口

### POST /api/yolo/detect/video/

对上传的视频进行交通标志检测

**请求方式**: POST (multipart/form-data)

**请求参数**:
- `video` (必需): 视频文件 (支持格式: mp4, avi, mov, mkv)
- `confidence_threshold` (可选): 置信度阈值，默认0.5
- `frame_interval` (可选): 帧间隔，默认1（每帧检测）
- `save_result` (可选): 是否保存检测结果，默认true
- `return_video` (可选): 是否返回标注后的视频，默认false
- `max_duration` (可选): 最大处理时长(秒)，默认300

**请求示例**:
```bash
curl -X POST \
  http://localhost:8000/api/yolo/detect/video/ \
  -H 'Content-Type: multipart/form-data' \
  -F 'video=@/path/to/video.mp4' \
  -F 'confidence_threshold=0.6' \
  -F 'frame_interval=5' \
  -F 'save_result=true' \
  -F 'return_video=false'
```

**响应体**:
```json
{
    "code": 200,
    "message": "视频检测完成",
    "data": {
        "task_id": "vid_task_12345",
        "detection_id": 124,
        "processing_time": 45.67,
        "video_info": {
            "original_filename": "test_video.mp4",
            "duration": 30.5,
            "fps": 30,
            "total_frames": 915,
            "processed_frames": 183,
            "resolution": [1920, 1080],
            "file_size_mb": 25.8
        },
        "detection_results": {
            "total_detections": 156,
            "unique_classes": ["禁止通行", "限速60", "警告标志"],
            "frame_detections": [
                {
                    "frame_number": 1,
                    "timestamp": 0.033,
                    "detections": [
                        {
                            "class_id": 0,
                            "class_name": "禁止通行",
                            "confidence": 0.92,
                            "bbox": {
                                "x1": 150,
                                "y1": 200,
                                "x2": 250,
                                "y2": 300,
                                "width": 100,
                                "height": 100
                            },
                            "center_point": [200, 250]
                        }
                    ]
                },
                {
                    "frame_number": 6,
                    "timestamp": 0.2,
                    "detections": [
                        {
                            "class_id": 1,
                            "class_name": "限速60",
                            "confidence": 0.87,
                            "bbox": {
                                "x1": 300,
                                "y1": 150,
                                "x2": 400,
                                "y2": 250,
                                "width": 100,
                                "height": 100
                            },
                            "center_point": [350, 200]
                        }
                    ]
                }
            ]
        },
        "result_video_url": null,
        "statistics": {
            "avg_confidence": 0.845,
            "detections_per_frame": 0.85,
            "model_version": "yolov8n_traffic_v1.0",
            "total_inference_time": 15.6,
            "avg_inference_time_per_frame": 0.085
        }
    }
}
```

---

## 3.4 YOLO模型管理接口

### GET /api/yolo/models/

获取可用的YOLO模型列表

**请求参数**:
- `is_active` (可选): 是否启用 (true/false)
- `model_type` (可选): 模型类型 (yolov8n/yolov8s/yolov8m/yolov8l/yolov8x)

**响应体**:
```json
{
    "code": 200,
    "message": "获取模型列表成功",
    "data": [
        {
            "id": 1,
            "name": "交通标志检测模型v1.0",
            "model_type": "yolov8n",
            "model_path": "/models/traffic_signs_v1.pt",
            "config_path": "/models/traffic_signs_v1.yaml",
            "class_names": ["禁止通行", "限速60", "警告标志", "指示标志"],
            "num_classes": 4,
            "input_size": [640, 640],
            "is_active": true,
            "version": "1.0",
            "accuracy": 0.92,
            "model_size_mb": 6.2,
            "inference_speed_ms": 15.6,
            "training_dataset": "交通标志数据集v1.0",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]
}
```

### GET /api/yolo/models/{id}/

获取指定YOLO模型详情

**路径参数**:
- `id`: 模型ID

**响应体**:
```json
{
    "code": 200,
    "message": "获取模型详情成功",
    "data": {
        "id": 1,
        "name": "交通标志检测模型v1.0",
        "description": "基于YOLOv8训练的交通标志检测模型",
        "model_type": "yolov8n",
        "model_path": "/models/traffic_signs_v1.pt",
        "config_path": "/models/traffic_signs_v1.yaml",
        "class_names": ["禁止通行", "限速60", "警告标志", "指示标志"],
        "num_classes": 4,
        "input_size": [640, 640],
        "is_active": true,
        "version": "1.0",
        "accuracy": 0.92,
        "precision": 0.89,
        "recall": 0.94,
        "f1_score": 0.915,
        "model_size_mb": 6.2,
        "inference_speed_ms": 15.6,
        "training_dataset": "交通标志数据集v1.0",
        "training_epochs": 100,
        "training_batch_size": 16,
        "training_time_hours": 8.5,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
}
```

### POST /api/yolo/models/

创建新的YOLO模型记录

**请求体**:
```json
{
    "name": "交通标志检测模型v2.0",
    "description": "改进版交通标志检测模型",
    "model_type": "yolov8s",
    "model_path": "/models/traffic_signs_v2.pt",
    "config_path": "/models/traffic_signs_v2.yaml",
    "class_names": ["禁止通行", "限速60", "警告标志", "指示标志", "禁止停车"],
    "version": "2.0",
    "accuracy": 0.95,
    "precision": 0.92,
    "recall": 0.97,
    "model_size_mb": 21.5,
    "inference_speed_ms": 25.3,
    "training_dataset": "交通标志数据集v2.0",
    "is_active": true
}
```

**响应体**:
```json
{
    "code": 201,
    "message": "创建模型成功",
    "data": {
        "id": 2,
        "name": "交通标志检测模型v2.0",
        "description": "改进版交通标志检测模型",
        "model_type": "yolov8s",
        "model_path": "/models/traffic_signs_v2.pt",
        "config_path": "/models/traffic_signs_v2.yaml",
        "class_names": ["禁止通行", "限速60", "警告标志", "指示标志", "禁止停车"],
        "num_classes": 5,
        "input_size": [640, 640],
        "is_active": true,
        "version": "2.0",
        "accuracy": 0.95,
        "precision": 0.92,
        "recall": 0.97,
        "f1_score": 0.945,
        "model_size_mb": 21.5,
        "inference_speed_ms": 25.3,
        "training_dataset": "交通标志数据集v2.0",
        "training_epochs": null,
        "training_batch_size": null,
        "training_time_hours": null,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
    }
}
```

### PUT /api/yolo/models/{id}/

更新指定YOLO模型

**路径参数**:
- `id`: 模型ID

**请求体**:
```json
{
    "is_active": false,
    "description": "已停用的旧版本模型"
}
```

**响应体**:
```json
{
    "code": 200,
    "message": "更新模型成功",
    "data": {
        "id": 1,
        "name": "交通标志检测模型v1.0",
        "description": "已停用的旧版本模型",
        "model_type": "yolov8n",
        "model_path": "/models/traffic_signs_v1.pt",
        "config_path": "/models/traffic_signs_v1.yaml",
        "class_names": ["禁止通行", "限速60", "警告标志", "指示标志"],
        "num_classes": 4,
        "input_size": [640, 640],
        "is_active": false,
        "version": "1.0",
        "accuracy": 0.92,
        "precision": 0.89,
        "recall": 0.94,
        "f1_score": 0.915,
        "model_size_mb": 6.2,
        "inference_speed_ms": 15.6,
        "training_dataset": "交通标志数据集v1.0",
        "training_epochs": 100,
        "training_batch_size": 16,
        "training_time_hours": 8.5,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T18:00:00Z"
    }
}
```

### DELETE /api/yolo/models/{id}/

删除指定YOLO模型

**路径参数**:
- `id`: 模型ID

**响应体**:
```json
{
    "code": 200,
    "message": "删除模型成功"
}
```

---

## 3.5 检测任务管理接口

### GET /api/yolo/tasks/

获取检测任务列表

**请求参数**:
- `status` (可选): 任务状态 (pending/processing/completed/failed)
- `task_type` (可选): 任务类型 (image/video)
- `model_id` (可选): 模型ID
- `start_date` (可选): 开始日期 (YYYY-MM-DD)
- `end_date` (可选): 结束日期 (YYYY-MM-DD)
- `page` (可选): 页码，默认1
- `page_size` (可选): 每页数量，默认10

**响应体**:
```json
{
    "code": 200,
    "message": "获取任务列表成功",
    "data": {
        "count": 50,
        "next": "http://localhost:8000/api/yolo/tasks/?page=2",
        "previous": null,
        "results": [
            {
                "id": 1,
                "task_id": "img_task_12345",
                "task_type": "image",
                "status": "completed",
                "model_name": "交通标志检测模型v1.0",
                "input_file": "uploads/test_image.jpg",
                "output_file": "detection_results/result_test_image.jpg",
                "processing_time": 2.35,
                "total_detections": 3,
                "avg_confidence": 0.863,
                "created_at": "2024-01-01T00:00:00Z",
                "completed_at": "2024-01-01T00:00:03Z"
            }
        ]
    }
}
```

### GET /api/yolo/tasks/{id}/

获取指定检测任务详情

**路径参数**:
- `id`: 任务ID

**响应体**:
```json
{
    "code": 200,
    "message": "获取任务详情成功",
    "data": {
        "id": 1,
        "task_id": "img_task_12345",
        "task_type": "image",
        "status": "completed",
        "model": {
            "id": 1,
            "name": "交通标志检测模型v1.0",
            "version": "1.0"
        },
        "input_file": "uploads/test_image.jpg",
        "output_file": "detection_results/result_test_image.jpg",
        "processing_time": 2.35,
        "detection_results": {
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
                },
                {
                    "class_name": "警告标志",
                    "confidence": 0.76,
                    "bbox": [500, 200, 580, 280]
                }
            ]
        },
        "error_message": null,
        "created_at": "2024-01-01T00:00:00Z",
        "started_at": "2024-01-01T00:00:01Z",
        "completed_at": "2024-01-01T00:00:03Z"
    }
}
```

### DELETE /api/yolo/tasks/{id}/

删除指定检测任务

**路径参数**:
- `id`: 任务ID

**响应体**:
```json
{
    "code": 200,
    "message": "删除任务成功"
}
```

---

## 3.6 模型性能统计接口

### GET /api/yolo/statistics/

获取YOLO模型性能统计

**请求参数**:
- `model_id` (可选): 模型ID
- `start_date` (可选): 开始日期 (YYYY-MM-DD)
- `end_date` (可选): 结束日期 (YYYY-MM-DD)
- `task_type` (可选): 任务类型 (image/video)

**响应体**:
```json
{
    "code": 200,
    "message": "获取统计信息成功",
    "data": {
        "overview": {
            "total_tasks": 1000,
            "completed_tasks": 950,
            "failed_tasks": 50,
            "success_rate": 0.95,
            "total_detections": 2850,
            "avg_processing_time": 3.2,
            "total_processing_time": 3040.0
        },
        "model_performance": [
            {
                "model_id": 1,
                "model_name": "交通标志检测模型v1.0",
                "tasks_count": 600,
                "success_rate": 0.97,
                "avg_confidence": 0.85,
                "avg_processing_time": 2.8,
                "total_detections": 1800
            },
            {
                "model_id": 2,
                "model_name": "交通标志检测模型v2.0",
                "tasks_count": 400,
                "success_rate": 0.92,
                "avg_confidence": 0.88,
                "avg_processing_time": 3.8,
                "total_detections": 1050
            }
        ],
        "class_statistics": [
            {
                "class_name": "禁止通行",
                "detection_count": 800,
                "avg_confidence": 0.92,
                "percentage": 28.1
            },
            {
                "class_name": "限速60",
                "detection_count": 650,
                "avg_confidence": 0.87,
                "percentage": 22.8
            },
            {
                "class_name": "警告标志",
                "detection_count": 750,
                "avg_confidence": 0.83,
                "percentage": 26.3
            },
            {
                "class_name": "指示标志",
                "detection_count": 650,
                "avg_confidence": 0.81,
                "percentage": 22.8
            }
        ],
        "daily_statistics": [
            {
                "date": "2024-01-01",
                "tasks_count": 50,
                "detections_count": 145,
                "avg_processing_time": 3.1,
                "success_rate": 0.96
            },
            {
                "date": "2024-01-02",
                "tasks_count": 65,
                "detections_count": 180,
                "avg_processing_time": 3.3,
                "success_rate": 0.94
            }
        ]
    }
}
```

---

## 3.7 模型健康检查接口

### GET /api/yolo/health/

检查YOLO服务健康状态

**请求参数**: 无

**响应体**:
```json
{
    "code": 200,
    "message": "服务健康",
    "data": {
        "service_status": "healthy",
        "model_status": {
            "loaded_models": 2,
            "active_models": 1,
            "model_details": [
                {
                    "id": 1,
                    "name": "交通标志检测模型v1.0",
                    "status": "loaded",
                    "memory_usage_mb": 245.6,
                    "last_used": "2024-01-01T12:30:00Z"
                },
                {
                    "id": 2,
                    "name": "交通标志检测模型v2.0",
                    "status": "standby",
                    "memory_usage_mb": 0,
                    "last_used": null
                }
            ]
        },
        "system_resources": {
            "cpu_usage_percent": 25.6,
            "memory_usage_percent": 45.2,
            "gpu_available": true,
            "gpu_usage_percent": 15.8,
            "disk_space_gb": 128.5
        },
        "performance_metrics": {
            "avg_inference_time_ms": 85.6,
            "requests_per_minute": 12.5,
            "queue_length": 0,
            "error_rate_percent": 2.1
        },
        "last_check": "2024-01-01T12:35:00Z"
    }
}
```

### GET /api/yolo/health/models/{id}/

检查指定模型健康状态

**路径参数**:
- `id`: 模型ID

**响应体**:
```json
{
    "code": 200,
    "message": "模型健康",
    "data": {
        "model_id": 1,
        "model_name": "交通标志检测模型v1.0",
        "status": "healthy",
        "is_loaded": true,
        "memory_usage_mb": 245.6,
        "last_inference_time": "2024-01-01T12:30:00Z",
        "total_inferences": 1250,
        "avg_inference_time_ms": 82.3,
        "error_count": 15,
        "error_rate_percent": 1.2,
        "model_file_exists": true,
        "model_file_size_mb": 6.2,
        "config_file_exists": true,
        "last_check": "2024-01-01T12:35:00Z"
    }
}
```

---

## 3.8 错误代码说明

### 常见错误代码

| 错误代码 | HTTP状态码 | 描述 | 解决方案 |
|---------|-----------|------|----------|
| 4001 | 400 | 不支持的文件格式 | 检查文件格式是否为支持的类型 |
| 4002 | 400 | 文件大小超限 | 减小文件大小或联系管理员 |
| 4003 | 400 | 置信度阈值无效 | 确保置信度在0-1之间 |
| 4004 | 400 | 模型未找到 | 检查模型ID是否正确 |
| 4005 | 400 | 模型未激活 | 激活模型或选择其他模型 |
| 5001 | 500 | 模型加载失败 | 检查模型文件是否存在 |
| 5002 | 500 | 推理失败 | 检查输入数据格式 |
| 5003 | 500 | 内存不足 | 等待系统资源释放 |
| 5004 | 500 | GPU不可用 | 检查GPU状态或使用CPU模式 |

### 错误响应格式

```json
{
    "code": 5001,
    "message": "模型加载失败",
    "errors": {
        "model": "模型文件不存在或损坏",
        "details": {
            "model_path": "/models/traffic_signs_v1.pt",
            "error_type": "FileNotFoundError",
            "suggestion": "请检查模型文件路径是否正确"
        }
    },
    "timestamp": "2024-01-01T12:00:00Z"
}
```

---
