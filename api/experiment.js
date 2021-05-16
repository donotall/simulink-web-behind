import request from '@/utils/request'
const api = "/manageservice/eduexperiment"
export default {
  getExperimentById(courseId) {
        return request({
            url: `${api}/list/${courseId}`,
            method: 'get'
        })
   },
   getDetailExperimentById(id,experimentId){
    return request({
        url: `${api}/detailed/${id}/${experimentId}`,
        method: 'get'
    })
   }
}