import serviceAxios from '@/http'

/**
 * 上传单个文件
 * @param file 文件对象
 * @param uploadUrl 上传地址
 * @returns Promise<any>
 */
export const uploadFile = (file: File, uploadUrl: string): Promise<any> => {

  const formData = new FormData()
  formData.append('file', file)

  console.log(formData);


  return serviceAxios({
    method: 'POST',
    url: uploadUrl,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 批量上传文件
 * @param files 文件数组
 * @param uploadUrl 上传地址
 * @returns Promise<any[]>
 */
export const uploadMultipleFiles = (files: File[], uploadUrl: string): Promise<any[]> => {
  const uploadPromises = files.map(file => uploadFile(file, uploadUrl))
  return Promise.all(uploadPromises)
}