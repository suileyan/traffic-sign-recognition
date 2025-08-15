import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'menu.dashboard',
    href: '/dashboard',
    icon: null,
    hide: true,
  },
  {
    id: 'system',
    label: 'menu.system',
    icon: null,
    children: [
      {
        id: 'user-management',
        label: 'menu.userManagement',
        href: '/system/users',
      },
      {
        id: 'role-management',
        label: 'menu.roleManagement',
        href: '/system/roles',
      },
      {
        id: 'permission',
        label: 'menu.permission',
        children: [
          {
            id: 'menu-permission',
            label: 'menu.menuPermission',
            href: '/system/permission/menu',
          },
          {
            id: 'api-permission',
            label: 'menu.apiPermission',
            href: '/system/permission/api',
            hide: true,
          },
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'menu.content',
    icon: null,
    children: [
      {
        id: 'articles',
        label: 'menu.articles',
        href: '/content/articles',
      },
      {
        id: 'categories',
        label: 'menu.categories',
        href: '/content/categories',
      },
    ],
  },
  {
    id: 'settings',
    label: 'menu.settings',
    href: '/settings',
    icon: null,
  },
  {
    id: 'admin',
    label: 'menu.admin',
    href: '/admin',
    icon: null,
  },
]

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: '1',
    title: '仪表板',
    icon: 'Odometer',
    path: '/admin/dashboard',
  },
  {
    id: '2',
    title: '用户管理',
    icon: 'User',
    path: '/admin/userManage',
    // children: [
    //   { id: '2-1', title: '用户列表', icon: 'UserFilled', path: '/admin/userManage' },
    // ]
  },
  {
    id: '3',
    title: '内容管理',
    icon: 'Document',
    path: '/admin/content',
    // children: [
    //   { id: '3-1', title: '通知管理', icon: 'Bell', path: '/admin/content/' },
    // ]
  },
  {
    id: '4',
    title: '订单管理',
    icon: 'ShoppingCart',
    path: '/admin/orders',
    hide: true,
    children: [
      { id: '4-1', title: '订单列表', icon: 'List', path: '/admin/orders/list' },
      { id: '4-2', title: '退款管理', icon: 'RefreshLeft', path: '/admin/orders/refunds' }
    ]
  },
  {
    id: '5',
    title: '文件系统',
    icon: 'FolderChecked',
    path: '/admin/files',
  },
  {
    id: '6',
    title: 'AI 助手',
    icon: 'ChatDotRound',
    path: '/admin/ai',
  },
  {
    id: '7',
    title: '财务管理',
    icon: 'Money',
    path: '/admin/finance',
    hide: true,
    children: [
      { id: '7-1', title: '收支明细', icon: 'Wallet', path: '/admin/finance/transactions' },
      { id: '7-2', title: '财务报表', icon: 'DataAnalysis', path: '/admin/finance/reports' }
    ]
  },
  {
    id: '8',
    title: '系统设置',
    icon: 'Setting',
    path: '/admin/settings',
    hide: true,
    children: [
      { id: '8-1', title: '基础设置', icon: 'Tools', path: '/admin/settings/basic' },
      { id: '8-2', title: '权限管理', icon: 'Key', path: '/admin/settings/permissions' },
      { id: '8-3', title: '系统日志', icon: 'DocumentCopy', path: '/admin/settings/logs' }
    ]
  },
  {
    id: '9',
    title: '系统配置',
    icon: 'Tools',
    path: '/admin/systemConfig'
  }
]

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

}
export default serverConfig
