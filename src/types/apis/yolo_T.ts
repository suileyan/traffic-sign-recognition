// YOLO API 类型定义

// 基础响应类型
export interface BaseResponse<T = any> {
  code: number
  message: string
  data?: T
  errors?: any
  timestamp?: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// 检测结果相关类型
export interface BoundingBox {
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  height: number
}

export interface Detection {
  class_id: number
  class_name: string
  confidence: number
  bbox: BoundingBox
  center_point: [number, number]
}

export interface ImageInfo {
  original_filename: string
  image_size: [number, number]
  file_size_mb: number
}

export interface VideoInfo {
  original_filename: string
  duration: number
  fps: number
  total_frames: number
  processed_frames: number
  resolution: [number, number]
  file_size_mb: number
}

export interface DetectionResults {
  total_detections: number
  detections: Detection[]
}

export interface VideoDetectionResults {
  total_detections: number
  unique_classes: string[]
  frame_detections: FrameDetection[]
}

export interface FrameDetection {
  frame_index: number
  timestamp: number
  detections: ActualDetection[]
}

export interface DetectionStatistics {
  avg_confidence: number
  detection_density?: number
  detections_per_frame?: number
  model_version: string
  inference_time?: number
  total_inference_time?: number
  avg_inference_time_per_frame?: number
}

// 图片检测请求和响应
export interface ImageDetectionRequest {
  image: File
  confidence_threshold?: number
  save_result?: boolean
  return_image?: boolean
}

// API返回的检测结果格式
export interface ActualDetection {
  sign_name: string
  category: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
  class_id: number
}

export interface ImageDetectionResponse {
  success: boolean
  record_id: number
  detections: ActualDetection[]
  processing_time: number
  original_image: string
  result_image: string
  detected_category: string | null
}

// 视频检测请求和响应
export interface VideoDetectionRequest {
  video: File
  confidence_threshold?: number
  frame_interval?: number
  save_result?: boolean
  return_video?: boolean
  max_duration?: number
}

export interface VideoDetectionResponse {
  success: boolean
  record_id: number
  frame_detections: FrameDetection[]
  summary: {
    total_frames: number
    processed_frames: number
    total_detections: number
    unique_signs: string[]
    unique_categories: string[]
    video_duration: number
    fps: number
  }
  processing_time: number
  original_video: string
  detected_category: string | null
}

// YOLO模型相关类型
export interface YoloModel {
  id: number
  name: string
  description?: string
  model_type: string
  model_path: string
  config_path: string
  class_names: string[]
  num_classes: number
  input_size: [number, number]
  is_active: boolean
  version: string
  accuracy: number
  precision?: number
  recall?: number
  f1_score?: number
  model_size_mb: number
  inference_speed_ms: number
  training_dataset: string
  training_epochs?: number
  training_batch_size?: number
  training_time_hours?: number
  created_at: string
  updated_at: string
}

export interface CreateYoloModelRequest {
  name: string
  description?: string
  model_type: string
  model_path: string
  config_path: string
  class_names: string[]
  version: string
  accuracy: number
  precision?: number
  recall?: number
  model_size_mb: number
  inference_speed_ms: number
  training_dataset: string
  is_active?: boolean
}

export interface UpdateYoloModelRequest extends Partial<CreateYoloModelRequest> {}

export interface YoloModelListResponse extends BaseResponse<YoloModel[]> {}

// 检测任务相关类型
export interface YoloDetectionTask {
  id: number
  task_id: string
  task_type: 'image' | 'video'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model_name: string
  input_file: string
  output_file: string | null
  processing_time: number | null
  total_detections: number | null
  avg_confidence: number | null
  error_message: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  model?: {
    id: number
    name: string
    version: string
  }
  detection_results?: DetectionResults | VideoDetectionResults
}

export interface YoloDetectionTaskListResponse extends BaseResponse<PaginatedResponse<YoloDetectionTask>> {}

// 统计相关类型
export interface YoloStatisticsOverview {
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  success_rate: number
  total_detections: number
  avg_processing_time: number
  total_processing_time: number
}

export interface ModelPerformance {
  model_id: number
  model_name: string
  tasks_count: number
  success_rate: number
  avg_confidence: number
  avg_processing_time: number
  total_detections: number
}

export interface ClassStatistics {
  class_name: string
  detection_count: number
  avg_confidence: number
  percentage: number
}

export interface DailyStatistics {
  date: string
  tasks_count: number
  detections_count: number
  avg_processing_time: number
  success_rate: number
}

export interface YoloDetectionStatistics {
  overview: YoloStatisticsOverview
  model_performance: ModelPerformance[]
  class_statistics: ClassStatistics[]
  daily_statistics: DailyStatistics[]
}

export interface YoloDetectionStatisticsResponse extends BaseResponse<YoloDetectionStatistics> {}

// 健康检查相关类型
export interface ModelStatus {
  id: number
  name: string
  status: 'loaded' | 'standby' | 'error'
  memory_usage_mb: number
  last_used: string | null
}

export interface SystemResources {
  cpu_usage_percent: number
  memory_usage_percent: number
  gpu_available: boolean
  gpu_usage_percent: number
  disk_space_gb: number
}

export interface PerformanceMetrics {
  avg_inference_time_ms: number
  requests_per_minute: number
  queue_length: number
  error_rate_percent: number
}

export interface YoloHealthStatus {
  service_status: 'healthy' | 'degraded' | 'unhealthy'
  model_status: {
    loaded_models: number
    active_models: number
    model_details: ModelStatus[]
  }
  system_resources: SystemResources
  performance_metrics: PerformanceMetrics
  last_check: string
}

export interface YoloHealthResponse extends BaseResponse<YoloHealthStatus> {}

export interface ModelHealthStatus {
  model_id: number
  model_name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  is_loaded: boolean
  memory_usage_mb: number
  last_inference_time: string | null
  total_inferences: number
  avg_inference_time_ms: number
  error_count: number
  error_rate_percent: number
  model_file_exists: boolean
  model_file_size_mb: number
  config_file_exists: boolean
  last_check: string
}

export interface ModelHealthResponse extends BaseResponse<ModelHealthStatus> {}

// API请求参数类型
export interface GetYoloModelsParams {
  is_active?: boolean
  model_type?: string
}

export interface GetYoloTasksParams {
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  task_type?: 'image' | 'video'
  model_id?: number
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}

export interface GetYoloStatisticsParams {
  model_id?: number
  start_date?: string
  end_date?: string
  task_type?: 'image' | 'video'
}
