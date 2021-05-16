import request from '@/utils/request'
const api = "/manageservice/educourse"
export default {
   getCoursePage(page,limit,searchObj) {
    return request({
      url: `${api}/client/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },  
}