# HZ系统管理模块 API 文档

## 概述

本文档描述了HZ系统管理模块（hzadmin）的所有API接口，包括客户端接口和管理员接口。

## 基础信息

- **基础URL**: `/api/hzadmin/`
- **认证方式**: Session认证 + Token认证
- **数据格式**: JSON
- **响应格式**: 统一使用R类封装

### 统一响应格式

```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {}
}
```

## 客户端接口

### 1. 认证模块 (/auth/)

#### 1.1 获取验证码

**接口地址**: `GET /api/hzadmin/auth/captcha/`

**权限要求**: 无

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "captcha_id": "uuid-string",
        "captcha_url": "/captcha/image/xxx/"
    }
}
```

#### 1.2 用户注册

**接口地址**: `POST /api/hzadmin/auth/register/`

**权限要求**: 无

**请求参数**:
```json
{
    "username": "用户名",
    "password": "密码",
    "email": "邮箱地址",
    "captcha_id": "验证码ID",
    "captcha_text": "验证码文本"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "注册成功",
    "data": null
}
```

#### 1.3 用户登录

**接口地址**: `POST /api/hzadmin/auth/login/`

**权限要求**: 无

**请求参数**:
```json
{
    "username": "用户名",
    "password": "密码",
    "captcha_id": "验证码ID",
    "captcha_text": "验证码文本"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "登录成功",
    "data": {
        "user_id": 1,
        "username": "用户名",
        "login_time": "2024-01-01 12:00:00",
        "ip": "127.0.0.1"
    }
}
```

#### 1.4 用户注销

**接口地址**: `GET /api/hzadmin/auth/logout/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "注销成功",
    "data": null
}
```

#### 1.5 获取用户信息

**接口地址**: `GET /api/hzadmin/auth/userinfo/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "username": "用户名",
        "email": "邮箱",
        "first_name": "姓",
        "last_name": "名",
        "is_active": true,
        "date_joined": "2024-01-01T12:00:00Z",
        "user_info": {
            "avatar": "头像URL",
            "phone": "手机号",
            "bio": "个人简介"
        },
        "login_info": {
            "login_time": "2024-01-01 12:00:00",
            "ip": "127.0.0.1"
        }
    }
}
```

#### 1.6 修改密码

**接口地址**: `POST /api/hzadmin/auth/changepassword/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "old_password": "旧密码",
    "new_password": "新密码"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "密码修改成功",
    "data": null
}
```

#### 1.7 更新用户信息

**接口地址**: `POST /api/hzadmin/auth/update_userinfo/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "email": "新邮箱",
    "first_name": "姓",
    "last_name": "名",
    "user_info": {
        "avatar": "头像URL",
        "phone": "手机号",
        "bio": "个人简介",
        "address": "地址",
        "birthday": "生日",
        "gender": "性别"
    }
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户信息更新成功",
    "data": null
}
```

#### 1.8 重置密码

**接口地址**: `POST /api/hzadmin/auth/reset_password/`

**权限要求**: 无

**请求参数**:
```json
{
    "email": "邮箱地址",
    "reset_code": "重置验证码",
    "new_password": "新密码"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "密码重置成功",
    "data": null
}
```

### 2. 公共模块 (/public/)

#### 2.1 文件上传

**接口地址**: `POST /api/hzadmin/public/upload_file/`

**权限要求**: 需要登录

**请求参数**: 
- Content-Type: multipart/form-data
- file: 文件对象

**支持的文件格式**: .jpg, .jpeg, .png, .doc, .docx, .rar, .zip, .7z, .pptx, .pdf, .mp3, .mp4, .avi

**文件大小限制**: 10MB

**响应示例**:
```json
{
    "code": 200,
    "msg": "上传成功",
    "data": {
        "file_id": 1,
        "file_name": "原始文件名.jpg",
        "file_path": "static/public/uploads/20240101120000.jpg",
        "file_size": 1024000,
        "file_type": "image",
        "upload_time": "2024-01-01 12:00:00"
    }
}
```

#### 2.2 发送邮箱验证码

**接口地址**: `POST /api/hzadmin/public/send_email_code/`

**权限要求**: 无

**请求参数**:
```json
{
    "email": "邮箱地址",
    "type": "验证码类型(register/reset_password)"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "验证码发送成功",
    "data": null
}
```

#### 2.3 用户文件列表

**接口地址**: `GET /api/hzadmin/public/user_files/`

**权限要求**: 需要登录

**请求参数**:
- page: 页码 (可选，默认1)
- page_size: 每页数量 (可选，默认10)
- file_type: 文件类型筛选 (可选)

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "total": 100,
        "page": 1,
        "page_size": 10,
        "files": [
            {
                "id": 1,
                "file_name": "文件名.jpg",
                "file_path": "文件路径",
                "file_size": 1024000,
                "file_type": "image",
                "upload_time": "2024-01-01 12:00:00"
            }
        ]
    }
}
```

#### 2.4 用户文件详情

**接口地址**: `GET /api/hzadmin/public/user_files/{file_id}/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "file_name": "文件名.jpg",
        "file_path": "文件路径",
        "file_size": 1024000,
        "file_type": "image",
        "mime_type": "image/jpeg",
        "description": "文件描述",
        "upload_time": "2024-01-01 12:00:00"
    }
}
```

#### 2.5 删除用户文件

**接口地址**: `POST /api/hzadmin/public/user_files/delete/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "file_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "删除成功",
    "data": null
}
```

### 3. 通知模块 (/notification/)

#### 3.1 通知列表

**接口地址**: `GET /api/hzadmin/notification/list/`

**权限要求**: 需要登录

**请求参数**:
- page: 页码 (可选，默认1)
- page_size: 每页数量 (可选，默认10)
- is_read: 是否已读 (可选，true/false)

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "total": 50,
        "page": 1,
        "page_size": 10,
        "unread_count": 5,
        "notifications": [
            {
                "id": 1,
                "title": "通知标题",
                "content": "通知内容",
                "created_at": "2024-01-01 12:00:00",
                "is_read": false
            }
        ]
    }
}
```

#### 3.2 通知详情

**接口地址**: `GET /api/hzadmin/notification/detail/{notification_id}/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "title": "通知标题",
        "content": "通知详细内容",
        "created_at": "2024-01-01 12:00:00",
        "is_read": false
    }
}
```

#### 3.3 标记通知已读

**接口地址**: `POST /api/hzadmin/notification/read/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "notification_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "标记成功",
    "data": null
}
```

#### 3.4 标记所有通知已读

**接口地址**: `POST /api/hzadmin/notification/read_all/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "成功标记X条通知为已读",
    "data": null
}
```

### 4. 系统监控模块 (/monitor/)

#### 4.1 CPU监控

**接口地址**: `GET /api/hzadmin/monitor/cpu/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "cpu_percent": [25.5, 30.2, 28.1, 32.4],
        "cpu_count": 4,
        "cpu_freq": {
            "current": 2400.0,
            "min": 800.0,
            "max": 3200.0
        },
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.2 内存监控

**接口地址**: `GET /api/hzadmin/monitor/memory/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "memory": {
            "total": 8589934592,
            "available": 4294967296,
            "used": 4294967296,
            "percent": 50.0
        },
        "swap": {
            "total": 2147483648,
            "used": 0,
            "free": 2147483648,
            "percent": 0.0
        },
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.3 磁盘监控

**接口地址**: `GET /api/hzadmin/monitor/disk/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "disk_info": [
            {
                "device": "C:\\",
                "mountpoint": "C:\\",
                "fstype": "NTFS",
                "total": 107374182400,
                "used": 53687091200,
                "free": 53687091200,
                "percent": 50.0
            }
        ],
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.4 网络监控

**接口地址**: `GET /api/hzadmin/monitor/network/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "network_io": {
            "bytes_sent": 1024000,
            "bytes_recv": 2048000,
            "packets_sent": 1000,
            "packets_recv": 1500
        },
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.5 进程监控

**接口地址**: `GET /api/hzadmin/monitor/process/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "process_count": 150,
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.6 GPU监控

**接口地址**: `GET /api/hzadmin/monitor/gpu/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "gpu_available": true,
        "gpu_info": [
            {
                "id": 0,
                "name": "NVIDIA GeForce RTX 3080",
                "load": 45.5,
                "memory_total": 10240,
                "memory_used": 2048,
                "memory_free": 8192,
                "temperature": 65
            }
        ],
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

#### 4.7 系统概览

**接口地址**: `GET /api/hzadmin/monitor/overview/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "system_info": {
            "platform": "Windows-10",
            "architecture": "AMD64",
            "hostname": "DESKTOP-XXX",
            "boot_time": "2024-01-01 08:00:00"
        },
        "cpu_summary": {
            "usage": 25.5,
            "count": 4
        },
        "memory_summary": {
            "usage": 50.0,
            "total_gb": 8.0
        },
        "disk_summary": {
            "usage": 50.0,
            "total_gb": 100.0
        },
        "timestamp": "2024-01-01 12:00:00"
    }
}
```

### 5. AI助手模块 (/ai/)

#### 5.1 AI聊天列表

**接口地址**: `GET /api/hzadmin/ai/chats/`

**权限要求**: 需要登录

**请求参数**:
- query: 搜索关键词 (可选)
- page: 页码 (可选，默认1)
- page_size: 每页数量 (可选，默认10)

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "total": 20,
        "page": 1,
        "page_size": 10,
        "chats": [
            {
                "id": 1,
                "title": "聊天标题",
                "created_at": "2024-01-01 12:00:00",
                "updated_at": "2024-01-01 13:00:00",
                "latest_message": "最近一条消息的前50个字符..."
            }
        ]
    }
}
```

#### 5.2 创建AI聊天

**接口地址**: `POST /api/hzadmin/ai/chats/create/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "title": "聊天标题"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "创建成功",
    "data": {
        "chat_id": 1,
        "title": "聊天标题"
    }
}
```

#### 5.3 AI聊天详情

**接口地址**: `GET /api/hzadmin/ai/chats/{chat_id}/`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "chat_id": 1,
        "title": "聊天标题",
        "created_at": "2024-01-01 12:00:00",
        "messages": [
            {
                "id": 1,
                "role": "user",
                "content": "用户消息内容",
                "created_at": "2024-01-01 12:01:00"
            },
            {
                "id": 2,
                "role": "assistant",
                "content": "AI回复内容",
                "created_at": "2024-01-01 12:01:30"
            }
        ]
    }
}
```

#### 5.4 更新AI聊天

**接口地址**: `PUT /api/hzadmin/ai/chats/{chat_id}/update/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "title": "新的聊天标题"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "更新成功",
    "data": null
}
```

#### 5.5 发送AI消息

**接口地址**: `POST /api/hzadmin/ai/chats/{chat_id}/message/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "message": "用户消息内容"
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "发送成功",
    "data": {
        "user_message": {
            "id": 1,
            "role": "user",
            "content": "用户消息内容",
            "created_at": "2024-01-01 12:01:00"
        },
        "ai_response": {
            "id": 2,
            "role": "assistant",
            "content": "AI回复内容",
            "created_at": "2024-01-01 12:01:30"
        }
    }
}
```

#### 5.6 删除AI聊天

**接口地址**: `POST /api/hzadmin/ai/chats/delete/`

**权限要求**: 需要登录

**请求参数**:
```json
{
    "chat_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "删除成功",
    "data": null
}
```

## 管理员接口

### 1. 用户管理模块 (/admin/user/)

#### 1.1 用户列表

**接口地址**: `GET /api/hzadmin/admin/user/users/`

**权限要求**: 管理员权限

**请求参数**:
- query: 搜索关键词 (可选)
- page: 页码 (可选，默认1)
- page_size: 每页数量 (可选，默认10)
- status: 用户状态 (可选，active/inactive)

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "total": 100,
        "page": 1,
        "page_size": 10,
        "users": [
            {
                "id": 1,
                "username": "用户名",
                "email": "邮箱",
                "is_active": true,
                "date_joined": "2024-01-01T12:00:00Z",
                "login_info": {
                    "login_time": "2024-01-01 12:00:00",
                    "ip": "127.0.0.1"
                }
            }
        ]
    }
}
```

#### 1.2 用户详情

**接口地址**: `GET /api/hzadmin/admin/user/users/{user_id}/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "username": "用户名",
        "email": "邮箱",
        "first_name": "姓",
        "last_name": "名",
        "is_active": true,
        "date_joined": "2024-01-01T12:00:00Z",
        "user_info": {
            "avatar": "头像URL",
            "phone": "手机号",
            "bio": "个人简介"
        },
        "login_info": {
            "login_time": "2024-01-01 12:00:00",
            "ip": "127.0.0.1"
        }
    }
}
```

#### 1.3 添加用户

**接口地址**: `PUT /api/hzadmin/admin/user/users/addUser/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "username": "用户名",
    "password": "密码",
    "email": "邮箱",
    "first_name": "姓",
    "last_name": "名",
    "is_active": true
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户创建成功",
    "data": {
        "user_id": 1
    }
}
```

#### 1.4 编辑用户

**接口地址**: `POST /api/hzadmin/admin/user/users/editUser/{user_id}/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "username": "新用户名",
    "email": "新邮箱",
    "first_name": "姓",
    "last_name": "名",
    "is_active": true
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户信息更新成功",
    "data": null
}
```

#### 1.5 修改用户状态

**接口地址**: `POST /api/hzadmin/admin/user/users/status/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "user_ids": [1, 2, 3],
    "is_active": false
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户状态更新成功",
    "data": null
}
```

#### 1.6 删除用户

**接口地址**: `POST /api/hzadmin/admin/user/users/delete/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "user_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户删除成功",
    "data": null
}
```

#### 1.7 修改用户角色

**接口地址**: `POST /api/hzadmin/admin/user/users/role/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "user_ids": [1, 2, 3],
    "is_staff": true,
    "is_superuser": false
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "用户角色更新成功",
    "data": null
}
```

### 2. 验证码管理模块 (/admin/captcha/)

#### 2.1 验证码列表

**接口地址**: `GET /api/hzadmin/admin/captcha/captchas/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "captchas": [
            {
                "hashkey": "验证码key",
                "challenge": "验证码文本",
                "expiration": "2024-01-01T12:05:00Z"
            }
        ]
    }
}
```

#### 2.2 清理验证码

**接口地址**: `POST /api/hzadmin/admin/captcha/captchas/clear/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "验证码清理成功",
    "data": null
}
```

#### 2.3 Redis验证码列表

**接口地址**: `GET /api/hzadmin/admin/captcha/redis-captchas/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "redis_captchas": [
            {
                "key": "captcha:uuid",
                "value": "验证码文本",
                "ttl": 300
            }
        ]
    }
}
```

#### 2.4 清理Redis验证码

**接口地址**: `POST /api/hzadmin/admin/captcha/redis-captchas/clear/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "Redis验证码清理成功",
    "data": null
}
```

### 3. 系统配置管理模块 (/admin/config/)

#### 3.1 配置列表

**接口地址**: `GET /api/hzadmin/admin/config/configs/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "configs": [
            {
                "id": 1,
                "key": "配置键",
                "value": "配置值",
                "description": "配置描述",
                "updated_at": "2024-01-01 12:00:00"
            }
        ]
    }
}
```

#### 3.2 配置详情

**接口地址**: `GET /api/hzadmin/admin/config/configs/{config_id}/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "key": "配置键",
        "value": "配置值",
        "description": "配置描述",
        "created_at": "2024-01-01 12:00:00",
        "updated_at": "2024-01-01 12:00:00"
    }
}
```

#### 3.3 邮箱配置

**接口地址**: `GET/POST /api/hzadmin/admin/config/configs/email/`

**权限要求**: 管理员权限

**GET请求响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "email_host": "smtp.gmail.com",
        "email_port": 587,
        "email_use_tls": true,
        "email_host_user": "user@gmail.com",
        "email_host_password": "password"
    }
}
```

**POST请求参数**:
```json
{
    "email_host": "smtp.gmail.com",
    "email_port": 587,
    "email_use_tls": true,
    "email_host_user": "user@gmail.com",
    "email_host_password": "password"
}
```

#### 3.4 验证码配置

**接口地址**: `GET/POST /api/hzadmin/admin/config/configs/captcha/`

**权限要求**: 管理员权限

**GET请求响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "captcha_length": 4,
        "captcha_timeout": 300,
        "captcha_image_size": [120, 40]
    }
}
```

### 4. 通知管理模块 (/admin/notification/)

#### 4.1 通知列表

**接口地址**: `GET /api/hzadmin/admin/notification/list/`

**权限要求**: 管理员权限

**请求参数**:
- page: 页码 (可选，默认1)
- page_size: 每页数量 (可选，默认10)
- query: 搜索关键词 (可选)

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "total": 50,
        "page": 1,
        "page_size": 10,
        "notifications": [
            {
                "id": 1,
                "title": "通知标题",
                "content": "通知内容",
                "is_public": true,
                "is_active": true,
                "created_at": "2024-01-01 12:00:00",
                "recipient_count": 100
            }
        ]
    }
}
```

#### 4.2 通知详情

**接口地址**: `GET /api/hzadmin/admin/notification/detail/{notification_id}/`

**权限要求**: 管理员权限

**请求参数**: 无

**响应示例**:
```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 1,
        "title": "通知标题",
        "content": "通知详细内容",
        "is_public": true,
        "is_active": true,
        "created_at": "2024-01-01 12:00:00",
        "updated_at": "2024-01-01 12:00:00",
        "recipients": [
            {
                "user_id": 1,
                "username": "用户名",
                "is_read": false,
                "read_at": null
            }
        ]
    }
}
```

#### 4.3 创建通知

**接口地址**: `POST /api/hzadmin/admin/notification/create/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "title": "通知标题",
    "content": "通知内容",
    "is_public": true,
    "recipient_user_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "通知创建成功",
    "data": {
        "notification_id": 1
    }
}
```

#### 4.4 更新通知

**接口地址**: `PUT /api/hzadmin/admin/notification/update/{notification_id}/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "title": "新的通知标题",
    "content": "新的通知内容",
    "is_active": true
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "通知更新成功",
    "data": null
}
```

#### 4.5 删除通知

**接口地址**: `POST /api/hzadmin/admin/notification/delete/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "notification_ids": [1, 2, 3]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "通知删除成功",
    "data": null
}
```

#### 4.6 发送邮件通知

**接口地址**: `POST /api/hzadmin/admin/notification/send_email/`

**权限要求**: 管理员权限

**请求参数**:
```json
{
    "notification_id": 1,
    "recipient_emails": ["user1@example.com", "user2@example.com"]
}
```

**响应示例**:
```json
{
    "code": 200,
    "msg": "邮件发送成功",
    "data": {
        "sent_count": 2,
        "failed_count": 0
    }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有需要登录的接口都需要在请求头中包含有效的认证信息
2. 管理员接口需要用户具有管理员权限
3. 文件上传接口有大小和格式限制
4. 分页参数page从1开始
5. 时间格式统一使用 `YYYY-MM-DD HH:MM:SS`
6. 所有POST/PUT请求的Content-Type应为 `application/json`（文件上传除外）