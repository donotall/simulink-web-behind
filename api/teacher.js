import request from '@/utils/request'
const api_name = '/serviceedu/teacher'
export default {
  getPageList(page, limit) {   
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
        url: `${api_name}/getTeacher/${id}`,
        method: 'get'
    })
  }
}