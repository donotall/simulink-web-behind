import request from '@/utils/request'
const api = "/manageservice/img"
export default {
  uploadImg(userId,exId,imgLists) {
        return request({
            url: `${api}/img/${userId}/${exId}`,
            method: 'post',
            data: imgLists
        })
   }  
}