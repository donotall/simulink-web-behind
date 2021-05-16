import request from '@/utils/request'
const api = "/educenter/usercourse"
export default {
  joinCourse(userCourse) {
        return request({
            url: `${api}/joinCourse`,
            method: 'post',
            data: userCourse
        })
   },
   unJoincourse(classId,userId) {
    return request({
      url: `${api}/${classId}`,
      method: 'delete',
      params: {userId}
    })
  },
  getCourseByUserId(id){
    return request({
      url: `/educenter/member/getUser/${id}`,
      method: 'get'
    })
  }  
}