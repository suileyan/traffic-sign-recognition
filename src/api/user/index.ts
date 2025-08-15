import type { CaptchaResponse, LoginReq, LoginResNoToken, RegisterRequest, RegisterResponse, UserInfo } from '@/types/apis/auth'
import serviceAxios from '@/http'

export function getUserInfo(query: UserInfo) {
  return serviceAxios({
    url: '/api/website/queryMenuWebsite',
    method: 'get',
    params: query,
  })
}

export function login(data: LoginReq): Promise<LoginResNoToken> {
  return serviceAxios({
    url: '/hzadmin/auth/login/',
    method: 'post',
    data,
  })
}

export function getCaptCha(): Promise<CaptchaResponse> {
  return serviceAxios({
    url: '/hzadmin/auth/captcha/',
    method: 'get',
  })
}

export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return serviceAxios({
    url: '/hzadmin/auth/register/',
    method: 'post',
    data,
  })
}