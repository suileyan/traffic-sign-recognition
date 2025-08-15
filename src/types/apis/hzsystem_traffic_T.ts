// hzsystem_traffic 模块类型定义

// 基础响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 分页响应类型
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// 数据集信息类型
export interface DatasetInfo {
  name: string
  version: string
  description: string
  classes: string[]
  total_images: number
  train_images: number
  val_images: number
}

export interface DatasetStatistics {
  total_size_mb: number
  avg_image_size: string
  format: string
}

export interface Dataset {
  dataset_info: DatasetInfo
  statistics: DatasetStatistics
}

// 交通标志分类类型
export type CategoryType = 'warning' | 'prohibition' | 'indication'

export interface TrafficCategory {
  id: number
  name: string
  category_type: CategoryType
  description: string
  color_scheme: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTrafficCategoryRequest {
  name: string
  category_type: CategoryType
  description: string
  color_scheme: string
  is_active: boolean
}

export interface UpdateTrafficCategoryRequest {
  name?: string
  description?: string
  is_active?: boolean
}

export interface TrafficCategoryQueryParams {
  category_type?: CategoryType
  is_active?: boolean
}

// 交通标志类型
export type SignShape = 'circle' | 'triangle' | 'rectangle' | 'diamond' | 'octagon'

export interface TrafficSign {
  id: number
  name: string
  code: string
  category: number
  category_name: string
  category_type: CategoryType
  description: string
  shape: SignShape
  shape_display: string
  main_color: string
  background_color: string
  text_content: string
  usage_scenario: string
  legal_basis: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTrafficSignRequest {
  name: string
  code: string
  category: number
  description: string
  shape: SignShape
  main_color: string
  background_color: string
  text_content: string
  usage_scenario: string
  legal_basis: string
  is_active: boolean
}

export interface UpdateTrafficSignRequest {
  name?: string
  description?: string
  usage_scenario?: string
}

export interface TrafficSignQueryParams {
  category?: number
  shape?: SignShape
  main_color?: string
  is_active?: boolean
  search?: string
}

// 检测记录类型
export type DetectionType = 'image' | 'video' | 'realtime'
export type RecordStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface DetectionData {
  detections: Array<{
    class_name: string
    confidence: number
    bbox: number[]
  }>
}

export interface DetectionRecord {
  id: number
  user: number
  user_name: string
  detection_type: DetectionType
  detection_type_display: string
  status: RecordStatus
  status_display: string
  original_file: string
  result_image: string | null
  detected_category: number
  confidence: number
  processing_time: number
  detection_data: DetectionData
  detection_results: DetectionResult[]
  file_size_mb: number
  created_at: string
  updated_at: string
}

export interface CreateDetectionRecordRequest {
  user: number
  detection_type: DetectionType
  original_file: string
  detected_category: number
  confidence: number
  processing_time: number
  detection_data: DetectionData
}

export interface UpdateDetectionRecordRequest {
  status?: RecordStatus
  confidence?: number
  processing_time?: number
}

export interface DetectionRecordQueryParams {
  user?: number
  detection_type?: DetectionType
  status?: RecordStatus
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}

// 检测结果类型
export interface DetectionResult {
  id: number
  record: number
  traffic_sign: number
  traffic_sign_name: string
  traffic_sign_code: string
  confidence: number
  confidence_percent: string
  bbox_x: number
  bbox_y: number
  bbox_width: number
  bbox_height: number
  is_correct: boolean
  created_at: string
}

export interface CreateDetectionResultRequest {
  record: number
  traffic_sign: number
  confidence: number
  bbox_x: number
  bbox_y: number
  bbox_width: number
  bbox_height: number
  is_correct: boolean
}

export interface UpdateDetectionResultRequest {
  confidence?: number
  is_correct?: boolean
}

export interface DetectionResultQueryParams {
  record?: number
  traffic_sign?: number
  min_confidence?: number
  is_correct?: boolean
}

// 用户类型
export interface TrafficUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  date_joined: string
  last_login: string | null
  statistics: UserStatistics | null
}

export interface CreateTrafficUserRequest {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  is_active: boolean
}

export interface UpdateTrafficUserRequest {
  first_name?: string
  email?: string
  is_active?: boolean
}

export interface TrafficUserQueryParams {
  is_active?: boolean
  search?: string
  page?: number
  page_size?: number
}

// 用户统计类型
export interface UserStatistics {
  id: number
  user: number
  user_name: string
  user_email: string
  total_detections: number
  correct_detections: number
  accuracy_rate: number
  total_time_spent: number
  favorite_signs: number[]
  favorite_signs_count: number
  monthly_detections: number
  achievements: string[]
  created_at: string
  updated_at: string
}

export interface CreateUserStatisticsRequest {
  user: number
  total_detections: number
  correct_detections: number
  total_time_spent: number
  favorite_signs: number[]
  monthly_detections: number
  achievements: string[]
}

export interface UserStatisticsQueryParams {
  user?: number
  min_accuracy?: number
  min_detections?: number
}

// 响应类型定义
export type DatasetResponse = ApiResponse<Dataset>
export type TrafficCategoryListResponse = ApiResponse<TrafficCategory[]>
export type TrafficCategoryResponse = ApiResponse<TrafficCategory>
export type TrafficSignListResponse = ApiResponse<TrafficSign[]>
export type TrafficSignResponse = ApiResponse<TrafficSign>
export type DetectionRecordListResponse = ApiResponse<PaginatedResponse<DetectionRecord>>
export type DetectionRecordResponse = ApiResponse<DetectionRecord>
export type DetectionResultListResponse = ApiResponse<DetectionResult[]>
export type DetectionResultResponse = ApiResponse<DetectionResult>
export type TrafficUserListResponse = ApiResponse<PaginatedResponse<TrafficUser>>
export type TrafficUserResponse = ApiResponse<TrafficUser>
export type UserStatisticsListResponse = ApiResponse<UserStatistics[]>
export type UserStatisticsResponse = ApiResponse<UserStatistics>