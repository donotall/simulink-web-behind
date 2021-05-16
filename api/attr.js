import request from '@/utils/request'
const api = "/manageservice/xpcAttr"
export default {
  getAttr() {
        return request({
            url: `${api}/getAddr`,
            method: 'get'
        })
   }  
}