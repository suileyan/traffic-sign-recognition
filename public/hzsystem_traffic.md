# 1. hzsystem_traffic 模块 API

## 1.1 数据集展示接口

### GET /api/traffic/dataset/

获取交通标志数据集信息

**请求参数**: 无

**响应体**:

```json
[
  {
    "id": 12,
    "name": "有害垃圾",
    "category_type": "hazardous",
    "description": "对人体健康或环境有害的垃圾，如电池、灯管等",
    "disposal_method": "投放到红色垃圾桶，单独收集",
    "icon": "☠️",
    "color": "#dc3545",
    "created_at": "2025-08-14T14:37:24.426782",
    "updated_at": "2025-08-14T14:37:24.426782"
  }
]
```

---

## 1.2 交通标志分类管理 not

### GET /api/traffic/categories/

获取交通标志分类列表

**请求参数**:

- `category_type` (可选): 分类类型 (warning/prohibition/indication)
- `is_active` (可选): 是否启用 (true/false)

**响应体**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "警告标志",
      "category_type": "warning",
      "description": "警告车辆、行人注意危险地点的标志。",
      "usage_scenario": "用于道路施工、事故多发路段等。",
      "icon": "⚠️",
      "color": "#FFD700",
      "created_at": "2025-08-15T15:27:50.407297",
      "updated_at": "2025-08-15T15:27:50.407297"
    }
  ]
}
```

### POST /api/traffic/categories/

创建新的交通标志分类

**请求体**:

```json
{
  "name": "指示标志",
  "category_type": "indication",
  "description": "表示指示、引导等含义的标志",
  "color_scheme": "蓝色方形",
  "is_active": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建分类成功",
  "data": {
    "id": 2,
    "name": "指示标志",
    "category_type": "indication",
    "description": "表示指示、引导等含义的标志",
    "color_scheme": "蓝色方形",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/categories/{id}/

获取指定分类详情

**路径参数**:

- `id`: 分类 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取分类详情成功",
  "data": {
    "id": 1,
    "name": "禁令标志",
    "category_type": "prohibition",
    "description": "表示禁止、限制等含义的标志",
    "color_scheme": "红色圆圈",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/categories/{id}/

更新指定分类

**路径参数**:

- `id`: 分类 ID

**请求体**:

```json
{
  "name": "禁令标志(更新)",
  "description": "更新后的描述",
  "is_active": false
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新分类成功",
  "data": {
    "id": 1,
    "name": "禁令标志(更新)",
    "category_type": "prohibition",
    "description": "更新后的描述",
    "color_scheme": "红色圆圈",
    "is_active": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### DELETE /api/traffic/categories/{id}/

删除指定分类

**路径参数**:

- `id`: 分类 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除分类成功"
}
```

---

## 1.3 交通标志管理

### GET /api/traffic/signs/

获取交通标志列表

**请求参数**:

- `category` (可选): 分类 ID
- `shape` (可选): 形状 (circle/triangle/rectangle/diamond/octagon)
- `main_color` (可选): 主要颜色
- `is_active` (可选): 是否启用 (true/false)
- `search` (可选): 搜索关键词

**响应体**:

```json
{
  "code": 200,
  "message": "获取标志列表成功",
  "data": [
    {
      "id": 1,
      "name": "禁止通行",
      "code": "R101",
      "category_name": "禁令标志",
      "shape": "circle",
      "main_color": "红色",
      "is_active": true
    }
  ]
}
```

### POST /api/traffic/signs/

创建新的交通标志

**请求体**:

```json
{
  "name": "限速60",
  "code": "R201",
  "category": 1,
  "description": "限制最高时速60公里",
  "shape": "circle",
  "main_color": "红色",
  "background_color": "白色",
  "text_content": "60",
  "usage_scenario": "城市道路",
  "legal_basis": "道路交通安全法",
  "is_active": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建标志成功",
  "data": {
    "id": 2,
    "name": "限速60",
    "code": "R201",
    "category": 1,
    "category_name": "禁令标志",
    "category_type": "prohibition",
    "description": "限制最高时速60公里",
    "shape": "circle",
    "shape_display": "圆形",
    "main_color": "红色",
    "background_color": "白色",
    "text_content": "60",
    "usage_scenario": "城市道路",
    "legal_basis": "道路交通安全法",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/signs/{id}/

获取指定交通标志详情

**路径参数**:

- `id`: 标志 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取标志详情成功",
  "data": {
    "id": 1,
    "name": "禁止通行",
    "code": "R101",
    "category": 1,
    "category_name": "禁令标志",
    "category_type": "prohibition",
    "description": "禁止一切车辆和行人通行",
    "shape": "circle",
    "shape_display": "圆形",
    "main_color": "红色",
    "background_color": "白色",
    "text_content": "",
    "usage_scenario": "道路施工、危险路段",
    "legal_basis": "道路交通安全法",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/signs/{id}/

更新指定交通标志

**路径参数**:

- `id`: 标志 ID

**请求体**:

```json
{
  "name": "禁止通行(更新)",
  "description": "更新后的描述",
  "usage_scenario": "更新后的使用场景"
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新标志成功",
  "data": {
    "id": 1,
    "name": "禁止通行(更新)",
    "code": "R101",
    "category": 1,
    "category_name": "禁令标志",
    "category_type": "prohibition",
    "description": "更新后的描述",
    "shape": "circle",
    "shape_display": "圆形",
    "main_color": "红色",
    "background_color": "白色",
    "text_content": "",
    "usage_scenario": "更新后的使用场景",
    "legal_basis": "道路交通安全法",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### DELETE /api/traffic/signs/{id}/

删除指定交通标志

**路径参数**:

- `id`: 标志 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除标志成功"
}
```

---

## 1.4 检测记录管理

### GET /api/traffic/records/

获取检测记录列表

**请求参数**:

- `user` (可选): 用户 ID
- `detection_type` (可选): 检测类型 (image/video/realtime)
- `status` (可选): 状态 (pending/processing/completed/failed)
- `start_date` (可选): 开始日期 (YYYY-MM-DD)
- `end_date` (可选): 结束日期 (YYYY-MM-DD)
- `page` (可选): 页码，默认 1
- `page_size` (可选): 每页数量，默认 10

**响应体**:

```json
{
	"count": 98,
	"next": "http://192.168.124.3:8003/api/traffic/records/?page=2",
	"results": {
		"code": 200,
		"message": "获取成功",
		"data": [
			{
				"id": 99,
				"detection_type_display": "实时检测",
				"status_display": "completed",
				"processing_time": 0,
				"created_at": "2025-08-15T20:25:41.603630"
			},
		]
	}
}
```

### POST /api/traffic/records/

创建新的检测记录

**请求体**:

```json
{
  "user": 1,
  "detection_type": "image",
  "original_file": "uploads/images/test.jpg",
  "detected_category": 1,
  "confidence": 0.95,
  "processing_time": 1.25,
  "detection_data": {
    "detections": [
      {
        "class_name": "禁止通行",
        "confidence": 0.95,
        "bbox": [100, 100, 200, 200]
      }
    ]
  }
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建记录成功",
  "data": {
    "id": 2,
    "user": 1,
    "user_name": "admin",
    "detection_type": "image",
    "detection_type_display": "图片检测",
    "status": "completed",
    "status_display": "已完成",
    "original_file": "uploads/images/test.jpg",
    "result_image": null,
    "detected_category": 1,
    "confidence": 0.95,
    "processing_time": 1.25,
    "detection_data": {
      "detections": [
        {
          "class_name": "禁止通行",
          "confidence": 0.95,
          "bbox": [100, 100, 200, 200]
        }
      ]
    },
    "detection_results": [],
    "file_size_mb": 2.5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/records/{id}/

获取指定检测记录详情

**路径参数**:

- `id`: 记录 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取记录详情成功",
  "data": {
    "id": 1,
    "user": 1,
    "user_name": "admin",
    "detection_type": "image",
    "detection_type_display": "图片检测",
    "status": "completed",
    "status_display": "已完成",
    "original_file": "uploads/images/test.jpg",
    "result_image": "detection_results/result_test.jpg",
    "detected_category": 1,
    "confidence": 0.95,
    "processing_time": 1.25,
    "detection_data": {
      "detections": [
        {
          "class_name": "禁止通行",
          "confidence": 0.95,
          "bbox": [100, 100, 200, 200]
        }
      ]
    },
    "detection_results": [
      {
        "id": 1,
        "traffic_sign_name": "禁止通行",
        "traffic_sign_code": "R101",
        "confidence": 0.95,
        "confidence_percent": "95.0%",
        "bbox_x": 100,
        "bbox_y": 100,
        "bbox_width": 100,
        "bbox_height": 100,
        "is_correct": true
      }
    ],
    "file_size_mb": 2.5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/records/{id}/

更新指定检测记录

**路径参数**:

- `id`: 记录 ID

**请求体**:

```json
{
  "status": "completed",
  "confidence": 0.98,
  "processing_time": 1.1
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新记录成功",
  "data": {
    "id": 1,
    "user": 1,
    "user_name": "admin",
    "detection_type": "image",
    "detection_type_display": "图片检测",
    "status": "completed",
    "status_display": "已完成",
    "original_file": "uploads/images/test.jpg",
    "result_image": "detection_results/result_test.jpg",
    "detected_category": 1,
    "confidence": 0.98,
    "processing_time": 1.1,
    "detection_data": {},
    "detection_results": [],
    "file_size_mb": 2.5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### DELETE /api/traffic/records/{id}/

删除指定检测记录

**路径参数**:

- `id`: 记录 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除记录成功"
}
```

---

## 1.5 检测结果管理

### GET /api/traffic/results/

获取检测结果列表

**请求参数**:

- `record` (可选): 检测记录 ID
- `traffic_sign` (可选): 交通标志 ID
- `min_confidence` (可选): 最小置信度
- `is_correct` (可选): 是否正确 (true/false)

**响应体**:

```json
{
  "code": 200,
  "message": "获取结果列表成功",
  "data": [
    {
      "id": 1,
      "record": 1,
      "traffic_sign": 1,
      "traffic_sign_name": "禁止通行",
      "traffic_sign_code": "R101",
      "confidence": 0.95,
      "confidence_percent": "95.0%",
      "bbox_x": 100,
      "bbox_y": 100,
      "bbox_width": 100,
      "bbox_height": 100,
      "is_correct": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/traffic/results/

创建新的检测结果

**请求体**:

```json
{
  "record": 1,
  "traffic_sign": 1,
  "confidence": 0.95,
  "bbox_x": 100,
  "bbox_y": 100,
  "bbox_width": 100,
  "bbox_height": 100,
  "is_correct": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建结果成功",
  "data": {
    "id": 2,
    "record": 1,
    "traffic_sign": 1,
    "traffic_sign_name": "禁止通行",
    "traffic_sign_code": "R101",
    "confidence": 0.95,
    "confidence_percent": "95.0%",
    "bbox_x": 100,
    "bbox_y": 100,
    "bbox_width": 100,
    "bbox_height": 100,
    "is_correct": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/results/{id}/

获取指定检测结果详情

**路径参数**:

- `id`: 结果 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取结果详情成功",
  "data": {
    "id": 1,
    "record": 1,
    "traffic_sign": 1,
    "traffic_sign_name": "禁止通行",
    "traffic_sign_code": "R101",
    "confidence": 0.95,
    "confidence_percent": "95.0%",
    "bbox_x": 100,
    "bbox_y": 100,
    "bbox_width": 100,
    "bbox_height": 100,
    "is_correct": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/results/{id}/

更新指定检测结果

**路径参数**:

- `id`: 结果 ID

**请求体**:

```json
{
  "confidence": 0.98,
  "is_correct": false
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新结果成功",
  "data": {
    "id": 1,
    "record": 1,
    "traffic_sign": 1,
    "traffic_sign_name": "禁止通行",
    "traffic_sign_code": "R101",
    "confidence": 0.98,
    "confidence_percent": "98.0%",
    "bbox_x": 100,
    "bbox_y": 100,
    "bbox_width": 100,
    "bbox_height": 100,
    "is_correct": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### DELETE /api/traffic/results/{id}/

删除指定检测结果

**路径参数**:

- `id`: 结果 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除结果成功"
}
```

---

## 1.6 用户管理

### GET /api/traffic/users/

获取用户列表

**请求参数**:

- `is_active` (可选): 是否激活 (true/false)
- `search` (可选): 搜索关键词
- `page` (可选): 页码，默认 1
- `page_size` (可选): 每页数量，默认 10

**响应体**:

```json
{
  "code": 200,
  "message": "获取用户列表成功",
  "data": {
    "count": 50,
    "next": "http://localhost:8000/api/traffic/users/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "first_name": "管理员",
        "last_name": "",
        "is_active": true,
        "date_joined": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-01T12:00:00Z",
        "statistics": {
          "id": 1,
          "user_name": "admin",
          "user_email": "admin@example.com",
          "total_detections": 100,
          "correct_detections": 95,
          "accuracy_rate": 0.95,
          "total_time_spent": 3600.0,
          "favorite_signs": [1, 2, 3],
          "favorite_signs_count": 3,
          "monthly_detections": 50,
          "achievements": ["新手上路", "检测达人"]
        }
      }
    ]
  }
}
```

### POST /api/traffic/users/

创建新用户

**请求体**:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "first_name": "测试",
  "last_name": "用户",
  "is_active": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建用户成功",
  "data": {
    "id": 2,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "测试",
    "last_name": "用户",
    "is_active": true,
    "date_joined": "2024-01-01T00:00:00Z",
    "last_login": null,
    "statistics": null
  }
}
```

### GET /api/traffic/users/{id}/

获取指定用户详情

**路径参数**:

- `id`: 用户 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取用户详情成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "管理员",
    "last_name": "",
    "is_active": true,
    "date_joined": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T12:00:00Z",
    "statistics": {
      "id": 1,
      "user": 1,
      "user_name": "admin",
      "user_email": "admin@example.com",
      "total_detections": 100,
      "correct_detections": 95,
      "accuracy_rate": 0.95,
      "total_time_spent": 3600.0,
      "favorite_signs": [1, 2, 3],
      "favorite_signs_count": 3,
      "monthly_detections": 50,
      "achievements": ["新手上路", "检测达人"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

### PUT /api/traffic/users/{id}/

更新指定用户

**路径参数**:

- `id`: 用户 ID

**请求体**:

```json
{
  "first_name": "超级管理员",
  "email": "superadmin@example.com",
  "is_active": true
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新用户成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "superadmin@example.com",
    "first_name": "超级管理员",
    "last_name": "",
    "is_active": true,
    "date_joined": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T12:00:00Z",
    "statistics": null
  }
}
```

### DELETE /api/traffic/users/{id}/

删除指定用户

**路径参数**:

- `id`: 用户 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除用户成功"
}
```

---

## 1.7 用户统计管理

### GET /api/traffic/user-statistics/

获取用户统计列表

**请求参数**:

- `user` (可选): 用户 ID
- `min_accuracy` (可选): 最小准确率
- `min_detections` (可选): 最小检测次数

**响应体**:

```json
{
  "code": 200,
  "message": "获取统计列表成功",
  "data": [
    {
      "id": 1,
      "user": 1,
      "user_name": "admin",
      "user_email": "admin@example.com",
      "total_detections": 100,
      "correct_detections": 95,
      "accuracy_rate": 0.95,
      "total_time_spent": 3600.0,
      "favorite_signs": [1, 2, 3],
      "favorite_signs_count": 3,
      "monthly_detections": 50,
      "achievements": ["新手上路", "检测达人"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### POST /api/traffic/user-statistics/

创建用户统计

**请求体**:

```json
{
  "user": 2,
  "total_detections": 10,
  "correct_detections": 8,
  "total_time_spent": 300.0,
  "favorite_signs": [1],
  "monthly_detections": 10,
  "achievements": ["新手上路"]
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建统计成功",
  "data": {
    "id": 2,
    "user": 2,
    "user_name": "testuser",
    "user_email": "test@example.com",
    "total_detections": 10,
    "correct_detections": 8,
    "accuracy_rate": 0.8,
    "total_time_spent": 300.0,
    "favorite_signs": [1],
    "favorite_signs_count": 1,
    "monthly_detections": 10,
    "achievements": ["新手上路"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/user-statistics/{id}/

获取指定用户统计详情

**路径参数**:

- `id`: 统计 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取统计详情成功",
  "data": {
    "id": 1,
    "user": 1,
    "user_name": "admin",
    "user_email": "admin@example.com",
    "total_detections": 100,
    "correct_detections": 95,
    "accuracy_rate": 0.95,
    "total_time_spent": 3600.0,
    "favorite_signs": [1, 2, 3],
    "favorite_signs_count": 3,
    "monthly_detections": 50,
    "achievements": ["新手上路", "检测达人"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### PUT /api/traffic/user-statistics/{id}/

更新指定用户统计

**路径参数**:

- `id`: 统计 ID

**请求体**:

```json
{
  "total_detections": 120,
  "correct_detections": 115,
  "total_time_spent": 4200.0,
  "monthly_detections": 60,
  "achievements": ["新手上路", "检测达人", "精准射手"]
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新统计成功",
  "data": {
    "id": 1,
    "user": 1,
    "user_name": "admin",
    "user_email": "admin@example.com",
    "total_detections": 120,
    "correct_detections": 115,
    "accuracy_rate": 0.958,
    "total_time_spent": 4200.0,
    "favorite_signs": [1, 2, 3],
    "favorite_signs_count": 3,
    "monthly_detections": 60,
    "achievements": ["新手上路", "检测达人", "精准射手"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T18:00:00Z"
  }
}
```

### DELETE /api/traffic/user-statistics/{id}/

删除指定用户统计

**路径参数**:

- `id`: 统计 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除统计成功"
}
```

---

## 1.8 知识文章管理

### GET /api/traffic/knowledge/

获取知识文章列表

**请求参数**:

- `article_type` (可选): 文章类型 (guide/regulation/safety/technology)
- `is_published` (可选): 是否发布 (true/false)
- `search` (可选): 搜索关键词
- `page` (可选): 页码，默认 1
- `page_size` (可选): 每页数量，默认 10

**响应体**:

```json
{
  "code": 200,
  "message": "获取文章列表成功",
  "data": {
    "count": 20,
    "next": "http://localhost:8000/api/traffic/knowledge/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "交通标志识别入门指南",
        "article_type_display": "指南教程",
        "summary": "本文介绍了交通标志识别的基础知识",
        "view_count": 150,
        "is_published": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /api/traffic/knowledge/

创建新的知识文章

**请求体**:

```json
{
  "title": "交通标志颜色含义详解",
  "content": "本文详细介绍了不同颜色交通标志的含义...",
  "summary": "介绍交通标志颜色的含义和作用",
  "article_type": "guide",
  "tags": ["颜色", "含义", "基础知识"],
  "related_signs": [1, 2, 3],
  "is_published": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建文章成功",
  "data": {
    "id": 2,
    "title": "交通标志颜色含义详解",
    "content": "本文详细介绍了不同颜色交通标志的含义...",
    "summary": "介绍交通标志颜色的含义和作用",
    "article_type": "guide",
    "article_type_display": "指南教程",
    "tags": ["颜色", "含义", "基础知识"],
    "related_signs": [1, 2, 3],
    "related_signs_count": 3,
    "related_signs_detail": [
      {
        "id": 1,
        "name": "禁止通行",
        "code": "R101",
        "category_name": "禁令标志",
        "shape": "circle",
        "main_color": "红色",
        "is_active": true
      }
    ],
    "view_count": 0,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/knowledge/{id}/

获取指定知识文章详情

**路径参数**:

- `id`: 文章 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取文章详情成功",
  "data": {
    "id": 1,
    "title": "交通标志识别入门指南",
    "content": "本文介绍了交通标志识别的基础知识，包括...",
    "summary": "本文介绍了交通标志识别的基础知识",
    "article_type": "guide",
    "article_type_display": "指南教程",
    "tags": ["入门", "基础", "指南"],
    "related_signs": [1, 2],
    "related_signs_count": 2,
    "related_signs_detail": [
      {
        "id": 1,
        "name": "禁止通行",
        "code": "R101",
        "category_name": "禁令标志",
        "shape": "circle",
        "main_color": "红色",
        "is_active": true
      },
      {
        "id": 2,
        "name": "限速60",
        "code": "R201",
        "category_name": "禁令标志",
        "shape": "circle",
        "main_color": "红色",
        "is_active": true
      }
    ],
    "view_count": 150,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/knowledge/{id}/

更新指定知识文章

**路径参数**:

- `id`: 文章 ID

**请求体**:

```json
{
  "title": "交通标志识别完整指南(更新版)",
  "content": "更新后的文章内容...",
  "summary": "更新后的摘要",
  "tags": ["入门", "基础", "指南", "更新"]
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新文章成功",
  "data": {
    "id": 1,
    "title": "交通标志识别完整指南(更新版)",
    "content": "更新后的文章内容...",
    "summary": "更新后的摘要",
    "article_type": "guide",
    "article_type_display": "指南教程",
    "tags": ["入门", "基础", "指南", "更新"],
    "related_signs": [1, 2],
    "related_signs_count": 2,
    "related_signs_detail": [],
    "view_count": 150,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### PATCH /api/traffic/knowledge/{id}/

部分更新知识文章（如增加浏览量）

**路径参数**:

- `id`: 文章 ID

**请求体**:

```json
{
  "view_count": 151
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新文章成功",
  "data": {
    "id": 1,
    "title": "交通标志识别完整指南(更新版)",
    "content": "更新后的文章内容...",
    "summary": "更新后的摘要",
    "article_type": "guide",
    "article_type_display": "指南教程",
    "tags": ["入门", "基础", "指南", "更新"],
    "related_signs": [1, 2],
    "related_signs_count": 2,
    "related_signs_detail": [],
    "view_count": 151,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:30:00Z"
  }
}
```

### DELETE /api/traffic/knowledge/{id}/

删除指定知识文章

**路径参数**:

- `id`: 文章 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除文章成功"
}
```

---

## 1.9 系统配置管理

### GET /api/traffic/configs/

获取系统配置列表

**请求参数**:

- `config_type` (可选): 配置类型 (system/detection/ui/notification)
- `is_active` (可选): 是否启用 (true/false)

**响应体**:

```json
{
  "code": 200,
  "message": "获取配置列表成功",
  "data": [
    {
      "id": 1,
      "key": "detection_confidence_threshold",
      "value": "0.5",
      "description": "检测置信度阈值",
      "config_type": "detection",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "key": "max_upload_size_mb",
      "value": "10",
      "description": "最大上传文件大小(MB)",
      "config_type": "system",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/traffic/configs/

创建新的系统配置

**请求体**:

```json
{
  "key": "ui_theme",
  "value": "dark",
  "description": "用户界面主题",
  "config_type": "ui",
  "is_active": true
}
```

**响应体**:

```json
{
  "code": 201,
  "message": "创建配置成功",
  "data": {
    "id": 3,
    "key": "ui_theme",
    "value": "dark",
    "description": "用户界面主题",
    "config_type": "ui",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/traffic/configs/{id}/

获取指定系统配置详情

**路径参数**:

- `id`: 配置 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取配置详情成功",
  "data": {
    "id": 1,
    "key": "detection_confidence_threshold",
    "value": "0.5",
    "description": "检测置信度阈值",
    "config_type": "detection",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/traffic/configs/{id}/

更新指定系统配置

**路径参数**:

- `id`: 配置 ID

**请求体**:

```json
{
  "value": "0.6",
  "description": "检测置信度阈值(更新)"
}
```

**响应体**:

```json
{
  "code": 200,
  "message": "更新配置成功",
  "data": {
    "id": 1,
    "key": "detection_confidence_threshold",
    "value": "0.6",
    "description": "检测置信度阈值(更新)",
    "config_type": "detection",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### DELETE /api/traffic/configs/{id}/

删除指定系统配置

**路径参数**:

- `id`: 配置 ID

**响应体**:

```json
{
  "code": 200,
  "message": "删除配置成功"
}
```

---

## 1.10 统计接口

### GET /api/traffic/statistics/overview/

获取系统统计概览

**请求参数**: 无

**响应体**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total_users": 5,
    "total_detections": 73,
    "average_accuracy": 0,
    "system_availability": 99.9,
    "category_distribution": [
      {
        "traffic_sign__category__name": "警告标志",
        "count": 25
      },
      {
        "traffic_sign__category__name": "禁令标志",
        "count": 20
      },
      {
        "traffic_sign__category__name": "指示标志",
        "count": 15
      },
      {
        "traffic_sign__category__name": "指路标志",
        "count": 13
      }
    ]
  }
}
```

### GET /api/traffic/statistics/user/{user_id}/

获取指定用户的详细统计信息

**路径参数**:

- `user_id`: 用户 ID

**响应体**:

```json
{
  "code": 200,
  "message": "获取用户统计成功",
  "data": {
    "user_info": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "date_joined": "2024-01-01T00:00:00Z"
    },
    "statistics": {
      "total_detections": 100,
      "correct_detections": 95,
      "accuracy_rate": 0.95,
      "total_time_spent": 3600.0,
      "favorite_signs": [1, 2, 3],
      "monthly_detections": 50,
      "achievements": ["新手上路", "检测达人"],
      "recent_records": [
        {
          "id": 1,
          "user_name": "admin",
          "detection_type_display": "图片检测",
          "status_display": "已完成",
          "processing_time": 1.25,
          "created_at": "2024-01-01T00:00:00Z"
        }
      ]
    }
  }
}
```
