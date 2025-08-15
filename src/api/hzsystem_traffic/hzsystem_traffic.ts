import type {
  // 响应类型
  DatasetResponse,
  TrafficCategoryListResponse,
  TrafficCategoryResponse,
  TrafficSignListResponse,
  TrafficSignResponse,
  DetectionRecordListResponse,
  DetectionRecordResponse,
  DetectionResultListResponse,
  DetectionResultResponse,
  TrafficUserListResponse,
  TrafficUserResponse,
  UserStatisticsListResponse,
  UserStatisticsResponse,
  ApiResponse,
  // 请求类型
  CreateTrafficCategoryRequest,
  UpdateTrafficCategoryRequest,
  TrafficCategoryQueryParams,
  CreateTrafficSignRequest,
  UpdateTrafficSignRequest,
  TrafficSignQueryParams,
  CreateDetectionRecordRequest,
  UpdateDetectionRecordRequest,
  DetectionRecordQueryParams,
  CreateDetectionResultRequest,
  UpdateDetectionResultRequest,
  DetectionResultQueryParams,
  CreateTrafficUserRequest,
  UpdateTrafficUserRequest,
  TrafficUserQueryParams,
  CreateUserStatisticsRequest,
  UserStatisticsQueryParams
} from '@/types/apis/hzsystem_traffic_T'
import serviceAxios from '@/http'

// ==================== 1.1 数据集展示接口 ====================

/**
 * 获取交通标志数据集信息
 */
export function getDatasetAPI(): Promise<DatasetResponse> {
  return serviceAxios({
    url: '/api/traffic/dataset/',
    method: 'get'
  })
}

// ==================== 1.2 交通标志分类管理 ====================

/**
 * 获取交通标志分类列表
 */
export function getTrafficCategoriesAPI(params?: TrafficCategoryQueryParams): Promise<TrafficCategoryListResponse> {
  return serviceAxios({
    url: '/api/traffic/categories/',
    method: 'get',
    params
  })
}

/**
 * 创建新的交通标志分类
 */
export function createTrafficCategoryAPI(data: CreateTrafficCategoryRequest): Promise<TrafficCategoryResponse> {
  return serviceAxios({
    url: '/api/traffic/categories/',
    method: 'post',
    data
  })
}

/**
 * 获取指定分类详情
 */
export function getTrafficCategoryAPI(id: number): Promise<TrafficCategoryResponse> {
  return serviceAxios({
    url: `/api/traffic/categories/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定分类
 */
export function updateTrafficCategoryAPI(id: number, data: UpdateTrafficCategoryRequest): Promise<TrafficCategoryResponse> {
  return serviceAxios({
    url: `/api/traffic/categories/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定分类
 */
export function deleteTrafficCategoryAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/categories/${id}/`,
    method: 'delete'
  })
}

// ==================== 1.3 交通标志管理 ====================

/**
 * 获取交通标志列表
 */
export function getTrafficSignsAPI(params?: TrafficSignQueryParams): Promise<TrafficSignListResponse> {
  return serviceAxios({
    url: '/api/traffic/signs/',
    method: 'get',
    params
  })
}

/**
 * 创建新的交通标志
 */
export function createTrafficSignAPI(data: CreateTrafficSignRequest): Promise<TrafficSignResponse> {
  return serviceAxios({
    url: '/api/traffic/signs/',
    method: 'post',
    data
  })
}

/**
 * 获取指定交通标志详情
 */
export function getTrafficSignAPI(id: number): Promise<TrafficSignResponse> {
  return serviceAxios({
    url: `/api/traffic/signs/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定交通标志
 */
export function updateTrafficSignAPI(id: number, data: UpdateTrafficSignRequest): Promise<TrafficSignResponse> {
  return serviceAxios({
    url: `/api/traffic/signs/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定交通标志
 */
export function deleteTrafficSignAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/signs/${id}/`,
    method: 'delete'
  })
}

// ==================== 1.4 检测记录管理 ====================

/**
 * 获取检测记录列表
 */
export function getDetectionRecordsAPI(params?: DetectionRecordQueryParams): Promise<DetectionRecordListResponse> {
  return serviceAxios({
    url: '/api/traffic/records/',
    method: 'get',
    params
  })
}

/**
 * 创建新的检测记录
 */
export function createDetectionRecordAPI(data: CreateDetectionRecordRequest): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: '/api/traffic/records/',
    method: 'post',
    data
  })
}

/**
 * 获取指定检测记录详情
 */
export function getDetectionRecordAPI(id: number): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/api/traffic/records/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定检测记录
 */
export function updateDetectionRecordAPI(id: number, data: UpdateDetectionRecordRequest): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/api/traffic/records/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定检测记录
 */
export function deleteDetectionRecordAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/records/${id}/`,
    method: 'delete'
  })
}

// ==================== 1.5 检测结果管理 ====================

/**
 * 获取检测结果列表
 */
export function getDetectionResultsAPI(params?: DetectionResultQueryParams): Promise<DetectionResultListResponse> {
  return serviceAxios({
    url: '/api/traffic/results/',
    method: 'get',
    params
  })
}

/**
 * 创建新的检测结果
 */
export function createDetectionResultAPI(data: CreateDetectionResultRequest): Promise<DetectionResultResponse> {
  return serviceAxios({
    url: '/api/traffic/results/',
    method: 'post',
    data
  })
}

/**
 * 获取指定检测结果详情
 */
export function getDetectionResultAPI(id: number): Promise<DetectionResultResponse> {
  return serviceAxios({
    url: `/api/traffic/results/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定检测结果
 */
export function updateDetectionResultAPI(id: number, data: UpdateDetectionResultRequest): Promise<DetectionResultResponse> {
  return serviceAxios({
    url: `/api/traffic/results/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定检测结果
 */
export function deleteDetectionResultAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/results/${id}/`,
    method: 'delete'
  })
}

// ==================== 1.6 用户管理 ====================

/**
 * 获取用户列表
 */
export function getTrafficUsersAPI(params?: TrafficUserQueryParams): Promise<TrafficUserListResponse> {
  return serviceAxios({
    url: '/api/traffic/users/',
    method: 'get',
    params
  })
}

/**
 * 创建新用户
 */
export function createTrafficUserAPI(data: CreateTrafficUserRequest): Promise<TrafficUserResponse> {
  return serviceAxios({
    url: '/api/traffic/users/',
    method: 'post',
    data
  })
}

/**
 * 获取指定用户详情
 */
export function getTrafficUserAPI(id: number): Promise<TrafficUserResponse> {
  return serviceAxios({
    url: `/api/traffic/users/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定用户
 */
export function updateTrafficUserAPI(id: number, data: UpdateTrafficUserRequest): Promise<TrafficUserResponse> {
  return serviceAxios({
    url: `/api/traffic/users/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定用户
 */
export function deleteTrafficUserAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/users/${id}/`,
    method: 'delete'
  })
}

// ==================== 1.7 用户统计管理 ====================

/**
 * 获取用户统计列表
 */
export function getUserStatisticsAPI(params?: UserStatisticsQueryParams): Promise<UserStatisticsListResponse> {
  return serviceAxios({
    url: '/api/traffic/user-statistics/',
    method: 'get',
    params
  })
}

/**
 * 创建用户统计
 */
export function createUserStatisticsAPI(data: CreateUserStatisticsRequest): Promise<UserStatisticsResponse> {
  return serviceAxios({
    url: '/api/traffic/user-statistics/',
    method: 'post',
    data
  })
}

/**
 * 获取指定用户统计详情
 */
export function getUserStatisticsDetailAPI(id: number): Promise<UserStatisticsResponse> {
  return serviceAxios({
    url: `/api/traffic/user-statistics/${id}/`,
    method: 'get'
  })
}

/**
 * 更新指定用户统计
 */
export function updateUserStatisticsAPI(id: number, data: Partial<CreateUserStatisticsRequest>): Promise<UserStatisticsResponse> {
  return serviceAxios({
    url: `/api/traffic/user-statistics/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定用户统计
 */
export function deleteUserStatisticsAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/api/traffic/user-statistics/${id}/`,
    method: 'delete'
  })
}
