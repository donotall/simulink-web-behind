import request from '@/utils/request'
export default {
  getList() {
    return request({
      url: `/serviceedu/index/index`,
      method: 'get'
    })
  }
}