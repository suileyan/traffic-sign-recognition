<template>
  <div class="base-info">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent="handleSubmit">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" disabled placeholder="用户名" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" type="email" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ loading ? '提交中...' : '提交' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserDetailInfo, updateUserInfo } from '@/api/user/userinfo'
import type { UserDetailInfo, UpdateUserInfoRequest } from '@/types/factory'

// 定义组件名称
defineOptions({
  name: 'BaseInfo'
})

// 响应式数据
const loading = ref(false)
const formRef = ref<FormInstance>()
const router = useRouter()

// 表单数据
const formData = ref<UserDetailInfo>({
  id: 0,
  username: '',
  email: '',
})

// 表单验证规则
const rules = reactive<FormRules<UserDetailInfo>>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserDetailInfo()
    if (response.code === 200 && response.data) {
      formData.value = response.data
    } else if (response.code === 401) {
      ElMessage.error('身份认证失败，请先登录')
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 这里可以添加错误提示
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true

    const requestData: UpdateUserInfoRequest = {
      id: formData.value.id,
      username: formData.value.username,
      email: formData.value.email,
    }

    const response = await updateUserInfo(requestData)

    if (response.code === 200) {
      ElMessage.success('更新成功')
    } else if (response.code === 401) {
      ElMessage.error('身份认证失败，请先登录')
      router.push('/auth/login')
    } else {
      ElMessage.error(response.msg || '更新失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped lang="scss">
.base-info {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .form-control {
    .label-text {
      font-weight: 500;
    }
  }

  .input-error,
  .select-error {
    border-color: hsl(var(--error));
  }

  // Element Plus 表单样式优化
  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .el-input__wrapper {
      border-radius: 8px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &:hover {
        border-color: #d1d5db;
      }

      &.is-focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }

    .el-button {
      border-radius: 8px;
      font-weight: 600;
      padding: 12px 24px;
      transition: all 0.3s ease;

      &.el-button--primary {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
