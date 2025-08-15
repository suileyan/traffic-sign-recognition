import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: "index",
    label: "首页",
    href: "/",
    icon: null,
  },
  {
    id: "detection",
    label: "智能检测",
    icon: null,
    href: "/detection",
  },
  {
    id: "record",
    label: "检测记录",
    icon: null,
    href: "/record",
  },
  {
    id: "knowledge",
    label: "知识库",
    href: "/knowledge",
    icon: null,
  },
  {
    id: "statistics",
    label: "统计信息",
    href: "/statistics",
    icon: null,
  },
  {
    id: "admin",
    label: "admin",
    href: "/admin",
    icon: null,
  },
];

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: "1",
    title: "仪表板",
    icon: "Odometer",
    path: "/admin/dashboard",
  },
  {
    id: "2",
    title: "用户管理",
    icon: "User",
    path: "/admin/userManage",
  },
  {
    id: "3",
    title: "检测历史",
    icon: "Tickets",
    path: "/admin/history",
  },
  {
    id: "4",
    title: "垃圾分类管理",
    icon: "Filter",
    path: "/admin/classification",
  },
  {
    id: "5",
    title: "宣传知识管理",
    icon: "Collection",
    path: "/admin/promoteKnowledge",
  },
  {
    id: "6",
    title: "模型管理",
    icon: "SetUp",
    path: "/admin/modelParameter",
  },
  {
    id: "7",
    title: "数据集展示",
    icon: "DataAnalysis",
    path: "/admin/datasetShow",
  },
];

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

}
export default serverConfig
