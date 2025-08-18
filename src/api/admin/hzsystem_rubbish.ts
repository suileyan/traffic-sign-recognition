import type {
  DatasetResponse,
  RubbishCategory,
  RubbishCategoryListResponse,
  CreateRubbishCategoryRequest,
  UpdateRubbishCategoryRequest,
  RubbishItem,
  RubbishItemListResponse,
  CreateRubbishItemRequest,
  DetectionRecordListResponse,
    KnowledgeArticle,
  KnowledgeArticleListResponse,
  CreateKnowledgeArticleRequest,
  UpdateKnowledgeArticleRequest,
  StatisticsOverview,
  YoloModelInfo,
  YoloModel,
  YoloModelListResponse,
  CreateYoloModelRequest,
  YoloDetectionTask,
  YoloDetectionTaskListResponse,
  YoloDetectionStatistics
} from '@/types/apis/hzsystem_rubbish_T'
import serviceAxios from '@/http'

// 1.1 获取数据集概览
export function getDatasetAPI(): Promise<DatasetResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/dataset/',
    method: 'get'
  })
}

// 1.2 获取垃圾分类列表
export function getRubbishCategoriesAPI(): Promise<RubbishCategoryListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/categories/',
    method: 'get'
  })
}

// 1.2 创建垃圾分类
export function createRubbishCategoryAPI(data: CreateRubbishCategoryRequest): Promise<RubbishCategory> {
  return serviceAxios({
    url: '/api/rubbish/api/categories/',
    method: 'post',
    data
  })
}

// 1.2 获取单个垃圾分类
export function getRubbishCategoryAPI(id: number): Promise<RubbishCategory> {
  return serviceAxios({
    url: `/api/rubbish/api/categories/${id}/`,
    method: 'get'
  })
}

// 1.2 更新垃圾分类
export function updateRubbishCategoryAPI(id: number, data: UpdateRubbishCategoryRequest): Promise<RubbishCategory> {
  return serviceAxios({
    url: `/api/rubbish/api/categories/${id}/`,
    method: 'put',
    data
  })
}

// 1.2 删除垃圾分类
export function deleteRubbishCategoryAPI(id: number): Promise<void> {
  return serviceAxios({
    url: `/api/rubbish/api/categories/${id}/`,
    method: 'delete'
  })
}

// 1.3 获取垃圾物品列表
export function getRubbishItemsAPI(params?: { category?: number }): Promise<RubbishItemListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/items/',
    method: 'get',
    params
  })
}

// 1.3 创建垃圾物品
export function createRubbishItemAPI(data: CreateRubbishItemRequest): Promise<RubbishItem> {
  return serviceAxios({
    url: '/api/rubbish/api/items/',
    method: 'post',
    data
  })
}

// 1.4 获取检测记录列表
export function getDetectionRecordsAPI(params?: { user?: number; type?: string }): Promise<DetectionRecordListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/records/',
    method: 'get',
    params
  })
}

// 1.5.1 获取知识文章列表
export function getKnowledgeArticlesAPI(params?: { type?: string }): Promise<KnowledgeArticleListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/knowledge/',
    method: 'get',
    params
  })
}

// 1.5.2 创建知识文章
export function createKnowledgeArticleAPI(data: CreateKnowledgeArticleRequest | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: '/api/rubbish/api/knowledge/',
    method: 'post',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.3 更新知识文章（全量更新）
export function updateKnowledgeArticleAPI(id: number, data: UpdateKnowledgeArticleRequest | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'put',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.3 部分更新知识文章
export function patchKnowledgeArticleAPI(id: number, data: Partial<UpdateKnowledgeArticleRequest> | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'patch',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.4 删除知识文章
export function deleteKnowledgeArticleAPI(id: number): Promise<void> {
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'delete'
  })
}

// 1.6 获取统计概览
export function getStatisticsOverviewAPI(): Promise<StatisticsOverview> {
  return serviceAxios({
    url: '/api/rubbish/api/statistics/overview/',
    method: 'get'
  })
}

// ==================== YOLO相关API ====================

// 2.3 获取当前YOLO模型信息
export const getYoloModelInfo = (): Promise<YoloModelInfo> => {
  return serviceAxios({
    url: "/api/yolo/model/info/",
    method: "get",
  });
};

// 2.4 获取所有YOLO模型配置
export const getYoloModels = (): Promise<YoloModelListResponse> => {
  return serviceAxios({
    url: "/api/yolo/models/",
    method: "get",
  });
};

// 创建YOLO模型
export const createYoloModel = (
  data: CreateYoloModelRequest
): Promise<YoloModel> => {
  return serviceAxios({
    url: "/api/yolo/models/",
    method: "post",
    data,
  });
};

// 更新YOLO模型
export const updateYoloModel = (
  id: number,
  data: Partial<CreateYoloModelRequest>
): Promise<YoloModel> => {
  return serviceAxios({
    url: `/api/yolo/models/${id}/`,
    method: "put",
    data,
  });
};

// 删除YOLO模型
export const deleteYoloModel = (id: number): Promise<void> => {
  return serviceAxios({
    url: `/api/yolo/models/${id}/`,
    method: "delete",
  });
};

// 2.5 获取检测任务列表
export const getYoloDetectionTasks =
  (): Promise<YoloDetectionTaskListResponse> => {
    return serviceAxios({
      url: "/api/yolo/tasks/",
      method: "get",
    });
  };

// 获取单个检测任务详情
export const getYoloDetectionTask = (
  id: number
): Promise<YoloDetectionTask> => {
  return serviceAxios({
    url: `/api/yolo/tasks/${id}/`,
    method: "get",
  });
};

// 删除检测任务
export const deleteYoloDetectionTask = (id: number): Promise<void> => {
  return serviceAxios({
    url: `/api/yolo/tasks/${id}/`,
    method: "delete",
  });
};

// 2.6 获取YOLO检测统计信息
export const getYoloDetectionStatistics =
  (): Promise<YoloDetectionStatistics> => {
    return serviceAxios({
      url: "/api/yolo/statistics/",
      method: "get",
    });
  };
