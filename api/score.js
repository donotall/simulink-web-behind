import request from '@/utils/request'
const api = "/manageservice/studentScore"
export default {
  addScore(studentScore) {
    return request({
      url: `${api}/finish`,
      method: 'post',
      data: studentScore
    })
  },
  getMaxMinScore(id) {
    return request({
      url: `${api}/score/minmax/${id}`,
      method: 'get'
    })
  }
}