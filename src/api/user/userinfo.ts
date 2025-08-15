import type { 
  UserDetailInfo, 
  UpdateUserInfoRequest, 
  UpdateUserInfoResponse, 
  ChangePasswordRequest, 
  ChangePasswordResponse 
} from '@/types/factory'
import serviceAxios from '@/http'

// 获取当前用户信息
export function getUserDetailInfo(): Promise<{ code: number; msg: string; data: UserDetailInfo }> {
  return serviceAxios({
    url: '/hzadmin/auth/userinfo/',
    method: 'get',
  })
}

// 更新用户信息
export function updateUserInfo(data: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> {
  return serviceAxios({
    url: '/hzadmin/auth/updateinfo/',
    method: 'post',
    data,
  })
}

// 修改密码
export function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  return serviceAxios({
    url: '/hzadmin/auth/changepassword/',
    method: 'post',
    data,
  })
}

// 文件上传
export function uploadFile(file: File): Promise<{ code: number; msg: string; data: { upload_path: string } }> {
  const formData = new FormData()
  formData.append('file', file)
  
  return serviceAxios({
    url: '/hzadmin/public/upload_file/',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}