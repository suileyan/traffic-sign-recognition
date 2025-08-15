import type {
  BaseResponse,
  ImageDetectionRequest,
  ImageDetectionResponse,
  VideoDetectionRequest,
  VideoDetectionResponse,
  YoloModel,
  YoloModelListResponse,
  CreateYoloModelRequest,
  UpdateYoloModelRequest,
  YoloDetectionTask,
  YoloDetectionTaskListResponse,
  YoloDetectionStatisticsResponse,
  YoloHealthResponse,
  ModelHealthResponse,
  GetYoloModelsParams,
  GetYoloTasksParams,
  GetYoloStatisticsParams
} from '@/types/apis/yolo_T'
import serviceAxios from '@/http'

// ==================== 检测接口 ====================

/**
 * 图片检测接口
 * @param data 图片检测请求数据
 * @returns Promise<BaseResponse<ImageDetectionResponse>>
 */
export function detectImageAPI(data: ImageDetectionRequest): Promise<BaseResponse<ImageDetectionResponse>> {
  const formData = new FormData()
  formData.append('image', data.image)
  
  if (data.confidence_threshold !== undefined) {
    formData.append('confidence_threshold', data.confidence_threshold.toString())
  }
  if (data.save_result !== undefined) {
    formData.append('save_result', data.save_result.toString())
  }
  if (data.return_image !== undefined) {
    formData.append('return_image', data.return_image.toString())
  }

  return serviceAxios({
    url: '/api/yolo/detect/image/',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 视频检测接口
 * @param data 视频检测请求数据
 * @returns Promise<BaseResponse<VideoDetectionResponse>>
 */
export function detectVideoAPI(data: VideoDetectionRequest): Promise<BaseResponse<VideoDetectionResponse>> {
  const formData = new FormData()
  formData.append('video', data.video)
  
  if (data.confidence_threshold !== undefined) {
    formData.append('confidence_threshold', data.confidence_threshold.toString())
  }
  if (data.frame_interval !== undefined) {
    formData.append('frame_interval', data.frame_interval.toString())
  }
  if (data.save_result !== undefined) {
    formData.append('save_result', data.save_result.toString())
  }
  if (data.return_video !== undefined) {
    formData.append('return_video', data.return_video.toString())
  }
  if (data.max_duration !== undefined) {
    formData.append('max_duration', data.max_duration.toString())
  }

  return serviceAxios({
    url: '/api/yolo/detect/video/',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// ==================== YOLO模型管理接口 ====================

/**
 * 获取YOLO模型列表
 * @param params 查询参数
 * @returns Promise<YoloModelListResponse>
 */
export function getYoloModelsAPI(params?: GetYoloModelsParams): Promise<YoloModelListResponse> {
  return serviceAxios({
    url: '/api/yolo/models/',
    method: 'get',
    params
  })
}

/**
 * 获取指定YOLO模型详情
 * @param id 模型ID
 * @returns Promise<BaseResponse<YoloModel>>
 */
export function getYoloModelAPI(id: number): Promise<BaseResponse<YoloModel>> {
  return serviceAxios({
    url: `/api/yolo/models/${id}/`,
    method: 'get'
  })
}

/**
 * 创建新的YOLO模型记录
 * @param data 创建模型请求数据
 * @returns Promise<BaseResponse<YoloModel>>
 */
export function createYoloModelAPI(data: CreateYoloModelRequest): Promise<BaseResponse<YoloModel>> {
  return serviceAxios({
    url: '/api/yolo/models/',
    method: 'post',
    data
  })
}

/**
 * 更新指定YOLO模型
 * @param id 模型ID
 * @param data 更新模型请求数据
 * @returns Promise<BaseResponse<YoloModel>>
 */
export function updateYoloModelAPI(id: number, data: UpdateYoloModelRequest): Promise<BaseResponse<YoloModel>> {
  return serviceAxios({
    url: `/api/yolo/models/${id}/`,
    method: 'put',
    data
  })
}

/**
 * 删除指定YOLO模型
 * @param id 模型ID
 * @returns Promise<BaseResponse<void>>
 */
export function deleteYoloModelAPI(id: number): Promise<BaseResponse<void>> {
  return serviceAxios({
    url: `/api/yolo/models/${id}/`,
    method: 'delete'
  })
}

// ==================== 检测任务管理接口 ====================

/**
 * 获取检测任务列表
 * @param params 查询参数
 * @returns Promise<YoloDetectionTaskListResponse>
 */
export function getYoloTasksAPI(params?: GetYoloTasksParams): Promise<YoloDetectionTaskListResponse> {
  return serviceAxios({
    url: '/api/yolo/tasks/',
    method: 'get',
    params
  })
}

/**
 * 获取指定检测任务详情
 * @param id 任务ID
 * @returns Promise<BaseResponse<YoloDetectionTask>>
 */
export function getYoloTaskAPI(id: number): Promise<BaseResponse<YoloDetectionTask>> {
  return serviceAxios({
    url: `/api/yolo/tasks/${id}/`,
    method: 'get'
  })
}

/**
 * 删除指定检测任务
 * @param id 任务ID
 * @returns Promise<BaseResponse<void>>
 */
export function deleteYoloTaskAPI(id: number): Promise<BaseResponse<void>> {
  return serviceAxios({
    url: `/api/yolo/tasks/${id}/`,
    method: 'delete'
  })
}

// ==================== 模型性能统计接口 ====================

/**
 * 获取YOLO模型性能统计
 * @param params 查询参数
 * @returns Promise<YoloDetectionStatisticsResponse>
 */
export function getYoloStatisticsAPI(params?: GetYoloStatisticsParams): Promise<YoloDetectionStatisticsResponse> {
  return serviceAxios({
    url: '/api/yolo/statistics/',
    method: 'get',
    params
  })
}

// ==================== 模型健康检查接口 ====================

/**
 * 检查YOLO服务健康状态
 * @returns Promise<YoloHealthResponse>
 */
export function getYoloHealthAPI(): Promise<YoloHealthResponse> {
  return serviceAxios({
    url: '/api/yolo/health/',
    method: 'get'
  })
}

/**
 * 检查指定模型健康状态
 * @param id 模型ID
 * @returns Promise<ModelHealthResponse>
 */
export function getYoloModelHealthAPI(id: number): Promise<ModelHealthResponse> {
  return serviceAxios({
    url: `/api/yolo/health/models/${id}/`,
    method: 'get'
  })
}

// ==================== 导出所有API函数 ====================

export default {
  // 检测接口
  detectImage: detectImageAPI,
  detectVideo: detectVideoAPI,
  
  // 模型管理接口
  getModels: getYoloModelsAPI,
  getModel: getYoloModelAPI,
  createModel: createYoloModelAPI,
  updateModel: updateYoloModelAPI,
  deleteModel: deleteYoloModelAPI,
  
  // 任务管理接口
  getTasks: getYoloTasksAPI,
  getTask: getYoloTaskAPI,
  deleteTask: deleteYoloTaskAPI,
  
  // 统计接口
  getStatistics: getYoloStatisticsAPI,
  
  // 健康检查接口
  getHealth: getYoloHealthAPI,
  getModelHealth: getYoloModelHealthAPI
}
