import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/blog_web/table/list',
    method: 'get',
    params
  })
}
