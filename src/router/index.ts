// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

type AutoRoute = {
  path?: string
  name?: string
  component?: any
  children?: AutoRoute[]
  [k: string]: any
}

function normalizePath(p: string) {
  const s = p.replace(/\/+/g, '/').replace(/\/$/, '')
  return s === '' ? '/' : s
}

/**
 * 扁平化并保留组件与子路由：
 * - 如果节点有 component -> 保留该节点（path 为 fullPath），并继续递归处理 children
 * - 如果节点没有 component，但有 children：
 *     - 若存在 index child (path === '') 且该 index 有 component -> 把它当作 fullPath 的组件路由
 *     - 递归处理其他子路由（basePath = fullPath）
 */
function flattenRoutes(list: AutoRoute[], basePath = ''): AutoRoute[] {
  const out: AutoRoute[] = []

  for (const r of list) {
    const seg = r.path ? `${r.path}` : ''
    const fullBase = `${basePath}${seg ? `${seg}/` : ''}` // e.g. '' | 'dashboard/' | '/motion-demo/'

    if (r.component) {
      // 保留当前有 component 的路由（作为父路由/布局）
      out.push({
        ...r,
        path: normalizePath(fullBase)
      })
      // 若有 children，递归保留子路由（不会丢）
      if (r.children && r.children.length) {
        out.push(...flattenRoutes(r.children, fullBase))
      }
      continue
    }

    if (r.children && r.children.length) {
      // 若该目录没有 component，但存在 index child（空 path）并且 index 有 component -> 视为 fullBase 的组件
      const indexChild = r.children.find(c => c.path === '' && c.component)
      if (indexChild) {
        out.push({
          ...indexChild,
          path: normalizePath(fullBase)
        })
      }
      // 处理其余子路由（排除 index）
      out.push(...flattenRoutes(r.children.filter(c => c.path !== ''), fullBase))
      continue
    }

    // 没有 component 且无 children -> 忽略
  }

  return out
}

function buildRoutes() {
  const normalRoutes = flattenRoutes(routes.filter(r => r.path !== '/admin'))
  const adminRoot = routes.find(r => r.path === '/admin')
  const adminChildren = adminRoot ? flattenRoutes(adminRoot.children || [], '') : []

  return [
    ...normalRoutes,
    {
      path: '/admin',
      component: () => import('@/pages/admin/index.vue'),
      redirect: '/admin/dashboard',
      children: adminChildren
    }
  ]
}

const router = createRouter({
  history: createWebHistory(),
  routes: buildRoutes() as RouteRecordRaw[]
})

export default router
