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
  organization: string
  total_images: number
}

export interface DatasetStatistics {
  total_size_mb: number
  avg_image_size: string
  format: string
}

export interface Dataset {
  code: number
  message: string
  data: Data
}

export interface Data {
  overview: Overview
  folder_stats: FolderStat[]
  sample_images: string[]
  dataset_info: DatasetInfo
}

export interface Overview {
  total_folders: number
  total_images: number
  dataset_size: number
  folder_structure: string
  image_format: string
  avg_images_per_folder: number
}

export interface FolderStat {
  folder_name: string
  start_range: number
  end_range: number
  image_count: number
  sample_images: string[]
}

// 交通标志分类类型
export type CategoryType = 'warning' | 'prohibition' | 'indication' | 'guide' | 'tourist' | 'construction'

export interface TrafficCategory {
  id: number
  name: string
  category_type: CategoryType
  description: string
  usage_scenario: string
  icon: string
  color: string
  created_at: string
  updated_at: string
}

export interface CreateTrafficCategoryRequest {
  name: string
  category_type: CategoryType
  description: string
  usage_scenario: string
  icon: string
  color: string
}

export interface UpdateTrafficCategoryRequest {
  name?: string
  description?: string
  usage_scenario?: string
  icon?: string
  color?: string
}

export interface TrafficCategoryQueryParams {
  category_type?: CategoryType
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
  code: number;
  message: string;
  data: Daum[];
}

export interface Daum {
  id: number;
  user_name: string;
  user_email: string;
  accuracy_rate: number;
  favorite_signs_count: number;
  total_detections: number;
  correct_detections: number;
  weekly_detections: number;
  monthly_detections: number;
  total_signs_detected: number;
  achievements: string[];
  last_detection_date: string;
  created_at: string;
  updated_at: string;
  user: number;
  favorite_signs: any[];
}

export interface CreateUserStatisticsRequest {
  user: number;
  total_detections: number;
  correct_detections: number;
  total_time_spent: number;
  favorite_signs: number[];
  monthly_detections: number;
  achievements: string[];
}

export interface UserStatisticsQueryParams {
  user?: number;
  min_accuracy?: number;
  min_detections?: number;
}

// 检测记录列表响应类型（嵌套结构）
export interface DetectionRecordListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    code: number;
    message: string;
    data: DetectionRecord[];
  };
}

// 统计接口类型
export interface CategoryDistribution {
  traffic_sign__category__name: string;
  count: number;
}

export interface SystemStatisticsOverview {
  total_users: number;
  total_detections: number;
  average_accuracy: number;
  system_availability: number;
  category_distribution: CategoryDistribution[];
}

export interface UserDetailedStatistics {
  total_detections: number;
  correct_detections: number;
  accuracy_rate: number;
  weekly_detections: number;
  monthly_detections: number;
  achievements: string[];
  recent_records: Array<{
    id: number;
    user_name: string;
    detection_type_display: string;
    status_display: string;
    processing_time: number;
    created_at: string;
  }>;
}

// 知识文章类型
export type ArticleType = "guide" | "regulation" | "safety" | "technology";

export interface RelatedSignDetail {
  id: number;
  name: string;
  code: string;
  category_name: string;
  shape: string;
  main_color: string;
  is_active: boolean;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  article_type: ArticleType;
  article_type_display: string;
  tags: string[];
  related_signs: number[];
  related_signs_count: number;
  related_signs_detail: RelatedSignDetail[];
  view_count: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeArticleRequest {
  title: string;
  content: string;
  summary: string;
  article_type: ArticleType;
  tags?: string[];
  related_signs?: number[];
  is_published: boolean;
  sort_order: number;
}

export interface UpdateKnowledgeArticleRequest {
  title?: string;
  content?: string;
  summary?: string;
  article_type?: ArticleType;
  tags?: string[];
  related_signs?: number[];
  is_published?: boolean;
  sort_order?: number;
}

export interface KnowledgeArticleQueryParams {
  article_type?: ArticleType;
  is_published?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// 知识文章列表响应类型（嵌套结构）
export interface KnowledgeArticleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    code: number;
    message: string;
    data: KnowledgeArticle[];
  };
}

// 响应类型定义
export type DatasetResponse = Dataset;
export type TrafficCategoryListResponse = ApiResponse<TrafficCategory[]>;
export type TrafficCategoryResponse = ApiResponse<TrafficCategory>;
export type TrafficSignListResponse = TrafficSign[];
export type TrafficSignResponse = TrafficSign;
export type DetectionRecordResponse = ApiResponse<DetectionRecord>;
export type DetectionResultListResponse = DetectionResult[];
export type DetectionResultResponse = DetectionResult;
export type TrafficUserListResponse = PaginatedResponse<TrafficUser>;
export type TrafficUserResponse = TrafficUser;
export type UserStatisticsListResponse = UserStatistics;
export type UserStatisticsResponse = UserStatistics;
export type SystemStatisticsOverviewResponse = SystemStatisticsOverview;
export type UserDetailedStatisticsResponse = UserDetailedStatistics;
export type KnowledgeArticleResponse = KnowledgeArticle;
