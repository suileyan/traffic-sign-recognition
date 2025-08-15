<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import LanguageSwitch from './btns/LanguageSwitch.vue'
import Search from './btns/search.vue'
import ThemeSwitch from './btns/ThemeSwitch.vue'
import MenuItems from './MenuItems.vue'
import serverConfig, { defaultMenuItems } from '@/configs'
import { useUserStore } from '@/stores/auth/user'
import { storeToRefs } from "pinia"

const { t } = useI18n()
const expandedMenus = ref<Set<string>>(new Set())

const store = useUserStore()

const { userInfo, getUserAvatar } = storeToRefs(store)

// 使用store中的头像方法
const avatar = getUserAvatar

// 用户头像下拉菜单项
const userMenuItems = ref([
  {
    title: '个人资料',
    class: 'justify-between',
    badge: '新',
    event: () => {
      console.log('跳转到个人资料页面')
      router.push('/userInfo')
    }
  },
  {
    title: '设置',
    class: '',
    hide: true,
    event: () => {
      console.log('跳转到设置页面')
      // router.push('/settings')
    }
  },
  {
    title: '退出登录',
    class: '',
    event: () => {
      console.log('执行退出登录')
      router.push("/auth/login")
    }
  }
])

// 从configs获取菜单项并应用国际化
const menuItems = computed(() => {
  const applyI18n = (items: any[]): any[] => {
    return items.map(item => ({
      ...item,
      label: t(item.label),
      children: item.children ? applyI18n(item.children) : undefined
    }))
  }
  return applyI18n(defaultMenuItems)
})

function toggleSubmenu(menuId: string) {
  if (expandedMenus.value.has(menuId)) {
    expandedMenus.value.delete(menuId)
  }
  else {
    expandedMenus.value.add(menuId)
  }
}

function isMenuExpanded(menuId: string) {
  return expandedMenus.value.has(menuId)
}

// 提供菜单状态管理函数给子组件
provide('isMenuExpanded', isMenuExpanded)
provide('toggleSubmenu', toggleSubmenu)
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <MenuItems :menu-items="menuItems" />
        </ul>
      </div>
      <a href="/" class="btn btn-ghost text-xl">{{ serverConfig.VITE_APP_TITLE }}</a>
      <search />
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu lg:menu-horizontal rounded-box">
        <MenuItems :menu-items="menuItems" />
      </ul>
    </div>
    <div class="navbar-end">
      <div class="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeSwitch />

        <!-- 用户头像显示区域 -->
        <div class="dropdown dropdown-end" v-if="userInfo?.username">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar avatar-online">
            <div class="w-10 rounded-full">
              <img alt="用户头像" height="30" :src="avatar" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li v-for="(item, index) in userMenuItems" :key="index" v-show="!item.hide">
              <a :class="item.class" :title="item.title" @click="item.event">
                {{ item.title }}
                <span v-if="item.badge" class="badge">{{ item.badge }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div v-else>
          <button class="btn btn-soft btn-success w-28 mr-1" @click="router.push('/auth/login')">
            {{ t('header.login') }}
          </button>
          <button class="btn btn-soft btn-warning w-28" @click="router.push('/auth/register')">
            {{ t('header.register') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='stylus' scoped></style>
