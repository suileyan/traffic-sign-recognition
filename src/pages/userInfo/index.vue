<template>
  <div class="userinfo">
    <div class="container">
      <!-- Tab 导航 -->
      <div class="tab-navigation">
        <button v-for="tab in tabList" :key="tab.key" :class="['tab-btn', { 'active': activeTab === tab.key }]"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 内容 -->
      <div class="content">
        <BaseInfo v-show="activeTab === 'baseInfo'" />
        <ChangePassword v-show="activeTab === 'changePassword'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import BaseInfo from 'components/pages/userInfo/BaseInfo.vue'
import ChangePassword from 'components/pages/userInfo/ChangePassword.vue'

// 定义页面元数据
defineOptions({
  name: 'UserInfo'
})

// 响应式数据
const activeTab = ref<string>('baseInfo')

watch(activeTab, (val) => {
  console.log(val);

})

// Tab 列表配置
const tabList = reactive([
  {
    key: 'baseInfo',
    label: '基本信息'
  },
  {
    key: 'changePassword',
    label: '修改密码'
  }
])
</script>

<style scoped lang="scss">
.userinfo {
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .tab-navigation {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    background: white;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(229, 231, 235, 0.6);

    .tab-btn {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #6b7280;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba(59, 130, 246, 0.05);
        color: #3b82f6;
      }

      &.active {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        transform: translateY(-1px);

        &:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
        }
      }
    }
  }

  .content {
    min-height: 400px;
    animation: fadeIn 0.3s ease-in-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>